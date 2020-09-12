import datetime
import json
import logging
from typing import Optional

import requests
from django.core.files.base import ContentFile
from django.utils import timezone

from delivery.models import Delivery, DeliveryType, Address, DeliveryProviderConfiguration, Package
from delivery.providers.base import DeliveryOption, ProviderPluginBase
from delivery.utils import geo_distance
from store import settings


log = logging.getLogger(__name__)


months = [
    'ничего',
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
]


def convert_delivery_date(min_date, max_date):
    if max_date == timezone.now().date():
        return 'cегодня'
    if max_date == (timezone.now() + timezone.timedelta(days=1)).date():
        return 'завтра'
    if min_date == max_date:
        return f'{max_date.day} {months[max_date.month]}'
    if min_date.month == max_date.month:
        return f'{min_date.day}-{max_date.day} {months[max_date.month]}'
    return f'{min_date.day} {min_date.month} - {max_date.day} {max_date.month}'


def delivery_option_from_api_data(api_option):
    delivery_date_min = datetime.datetime.strptime(
        api_option['delivery']['calculatedDeliveryDateMin'],
        "%Y-%m-%d"
    ).date()
    delivery_date_max = datetime.datetime.strptime(
        api_option['delivery']['calculatedDeliveryDateMax'],
        "%Y-%m-%d"
    ).date()
    return DeliveryOption(
        cost=api_option['cost']['deliveryForSender'],
        date=convert_delivery_date(delivery_date_min, delivery_date_max)
    )


def convert_recipient(recipient, to, geo_id, pickup_point):
    return {
        'firstName': recipient.first_name,
        'lastName': recipient.last_name,
        'email': recipient.email,
        'address': {
            'geoId': geo_id,
            'country': to.country,
            'region': to.region,
            'locality': to.settlement,
            'street': to.street,
            'house': to.house,
            'housing': to.building if to.building and to.building[:1] == 'к' else None,
            'building': to.building if to.building and to.building[:3] == 'стр' else None,
            'apartment': to.apartment,
            'postalCode': to.postal_code
        },
        'pickupPointId': pickup_point['id'] if pickup_point else None,
    }


def convert_option(optimal_option):
    return {
        'tariffId': optimal_option['tariffId'],
        'partnerId': optimal_option['delivery']['partner']['id'],
        'delivery': optimal_option['cost']['deliveryForSender'],
        'deliveryForCustomer': optimal_option['cost']['deliveryForCustomer'],
        'calculatedDeliveryDateMin': optimal_option['delivery']['calculatedDeliveryDateMin'],
        'calculatedDeliveryDateMax': optimal_option['delivery']['calculatedDeliveryDateMax'],
        'services': optimal_option['services']
    }


def convert_order_item(order_item):
    return {
        'externalId': order_item.item.id,
        'name': order_item.item.name,
        'count': order_item.quantity,
        'price': order_item.item.price,
        'assessedValue': order_item.item.price,
        'tax': 'VAT_20',
        'dimensions': {
            'length': 5,
            'width': 1,
            'height': 1,
            'weight': 0.05
        }
    }


def convert_package(package):
    return {
        'length': package.length,
        'width': package.width,
        'height': package.height,
        'weight': float(package.weight),
    }


class YandexDeliveryPlugin(ProviderPluginBase):
    code = 'YANDEX'
    endpoint = settings.YANDEX_DELIVERY_API_ENDPOINT

    # Configuration
    supported_types = ['POST', 'COURIER', 'PICKUP']

    shop_configuration = {
        'ClientId': 'ID Магазина в Я.Доставке',
        'OAuth': 'OAuth-токен',
        'WarehouseGeoId': 'geoId склада'
    }

    type_configuration = {
        'sorting': 'Использовать сортировочный центр (True/False)',
        'useClosestPickup': 'Автоматически выбирать ближайший пункт самовывоза (True/False)'
    }

    # Plugin methods

    @classmethod
    def get_optimal(cls, delivery_type: DeliveryType, to: Address, items_value: int) -> Optional[DeliveryOption]:
        assert delivery_type.provider == cls.code
        config = cls.get_config(delivery_type)

        optimal_option = cls.request_optimal(delivery_type, to, items_value, config)

        return delivery_option_from_api_data(optimal_option) if optimal_option else None

    @classmethod
    def get_pickup_points(cls, delivery_type: DeliveryType, to: Address):
        return []

    @classmethod
    def submit_delivery(cls, delivery: Delivery):
        assert delivery.type.provider == cls.code
        config = cls.get_config(delivery.type)

        status = cls.request_delivery_draft(delivery, config)
        if status:
            cls.request_delivery_submit(delivery, config)

    @classmethod
    def refresh_delivery(cls, delivery: Delivery):
        assert delivery.type.provider == cls.code
        config = cls.get_config(delivery.type)
        cls.request_refresh_delivery(delivery, config)

    @classmethod
    def refresh_shipments(cls):
        pass

    # Helper methods

    @classmethod
    def get_config(cls, delivery_type: DeliveryType):
        provider_configuration = DeliveryProviderConfiguration.objects.get(
            shop=delivery_type.shop, provider=delivery_type.provider
        )
        return provider_configuration.config

    @classmethod
    def get_complete_address(cls, delivery_type: DeliveryType, address: Address, config):
        locality_full = address.region + ', ' + address.settlement

        response = requests.get(
            cls.endpoint + f'/location?term={locality_full}',
            headers={
                'Content-Type': 'application/json',
                'Authorization': config['OAuth']
            }
        )
        result = response.json()

        return None if len(result) == 0 else result[0]

    @classmethod
    def get_shipment_date(cls):
        deadline = datetime.datetime.combine(
            timezone.localdate(), settings.YANDEX_DELIVERY_SHIPMENT_DEADLINE, tzinfo=timezone.localtime().tzinfo
        )
        if timezone.localtime() < deadline:
            return (timezone.localdate() + timezone.timedelta(days=1)).isoformat()
        else:
            return (timezone.localdate() + timezone.timedelta(days=2)).isoformat()

    @classmethod
    def get_closest_pickup(cls, delivery, pickup_ids, lat, lon, config):

        response = requests.put(
            cls.endpoint + '/pickup-points',
            headers={
                'Content-Type': 'application/json',
                'Authorization': config['OAuth']
            },
            data=json.dumps({'pickupPointIds': pickup_ids}).encode('utf-8')
        )

        if response.status_code == 200:
            result = response.json()
            if len(result) > 0:
                return min(
                    result,
                    key=lambda p: geo_distance(lat, lon, p['address']['latitude'], p['address']['longitude'])
                )['id']

        return None

    @classmethod
    def request_optimal(cls, delivery_type: DeliveryType, to: Address, items_value: int, config):

        complete_address = cls.get_complete_address(delivery_type, to, config)

        package = Package.objects.filter(shop=delivery_type.shop).first()

        data = {
            'senderId': config['ClientId'],
            'from': {
                'geoId': config['WarehouseGeoId']
            },
            'to': {
                'location': to.value,
                'geoId': complete_address['geoId'] if complete_address else None
            },
            'dimensions': convert_package(package),
            'deliveryType': delivery_type.type,
            'shipment': {
                'type': 'WITHDRAW',
                'date': cls.get_shipment_date(),
                'includeNonDefault': True,
            },
            'cost': {
                'assessedValue': items_value,
                'itemsSum': items_value,
                'manualDeliveryForCustomer': 0,
                'fullyPrepaid': True
            }
        }

        print(data)

        response = requests.put(
            cls.endpoint + '/delivery-options',
            headers={
                'Content-Type': 'application/json',
                'Authorization': config['OAuth']
            },
            data=json.dumps(data).encode('utf-8')
        )
        result = response.json()

        print(result)

        if not isinstance(result, list):
            log.warning(f"Yandex Delivery options returned {result}")
            return None

        sorting = bool(delivery_type.extra.get('sorting', True))
        result = [
            option
            for option in result
            if (option['shipments'][0]['partner']['partnerType'] == 'SORTING_CENTER') == sorting
        ]

        return None if len(result) == 0 else result[0]

    @classmethod
    def request_delivery_draft(cls, delivery: Delivery, config):
        optimal_option = cls.request_optimal(delivery.type, delivery.to, delivery.order.items_cost, config)
        assert optimal_option is not None

        complete_address = cls.get_complete_address(delivery.type, delivery.to, config)
        if not complete_address:
            log.error('Unknown address for delivery')
            delivery.status = Delivery.ERROR
            delivery.save(update_fields=['status'])
            return False

        pickup_point_id = None
        if delivery.type.type in ['POST', 'COURIER']:
            if delivery.type.extra['useClosestPickup']:
                pickup_point_id = cls.get_closest_pickup(
                    delivery, optimal_option['pickupPointIds'], delivery.to.latitude, delivery.to.longitude, config
                )
            else:
                pickup_point_id = delivery.extra['pickupPointId']

        package = Package.objects.for_delivery(delivery)
        if not package:
            log.error("No matching package")
            delivery.status = Delivery.ERROR
            delivery.save(update_fields=['status'])
            return False

        data = {
            'senderId': config['ClientId'],
            'externalId': delivery.order.id if not settings.DEBUG else f'DEBUG_{delivery.order.id}',
            'comment': f'Доставка по заказу {delivery.order.id}',
            'deliveryType': delivery.type.type,
            'recipient': convert_recipient(delivery.recipient, delivery.to, complete_address['geoId'], pickup_point_id),
            'cost': {
                'manualDeliveryForCustomer': 0,
                'paymentMethod': 'PREPAID',
                'assessedValue': delivery.order.items_cost,
                'fullyPrepaid': True
            },
            'contacts': [
                {
                    'type': 'RECIPIENT',
                    'phone': delivery.recipient.phone,
                    'firstName': delivery.recipient.first_name,
                    'lastName': delivery.recipient.last_name,
                }
            ],
            'deliveryOption': convert_option(optimal_option),
            'shipment': {
                'type': 'WITHDRAW',
                'date': cls.get_shipment_date(),
                'warehouseFrom': delivery.order.shop.yandex_warehouse_id,
                'partnerTo': optimal_option['shipments'][0]['partner']['id'],
            },
            'places': [
                {
                    'externalId': delivery.order.id,
                    'dimensions': convert_package(package),
                    'items': [
                        convert_order_item(order_item)
                        for order_item in delivery.order.items.prefetch_related('item').all()
                    ]
                }
            ]
        }

        response = requests.post(
            cls.endpoint + '/orders',
            headers={
                'Content-Type': 'application/json',
                'Authorization': config['OAuth']
            },
            data=json.dumps(data).encode('utf-8')
        )

        if response.status_code == 200:
            delivery.external_id = response.json()
            delivery.extra['shipment'] = int(optimal_option['shipments'][0]['partner']['id'])
            delivery.save(update_fields=['status', 'external_id', 'extra'])
            return True
        else:
            log.error(f'Ошибка интеграции Яндекс.Доставки по заказу {delivery.order.id}: {response.json()}')
            delivery.status = Delivery.ERROR
            delivery.save(update_fields=['status'])
            return False

    @classmethod
    def request_delivery_submit(cls, delivery: Delivery, config):
        response = requests.post(
            cls.endpoint + '/orders/submit',
            headers={
                'Content-Type': 'application/json',
                'Authorization': config['OAuth']
            },
            data=json.dumps({'orderIds': [delivery.external_id]}).encode('utf-8')
        )

        success = False
        if response.status_code == 200:
            result = response.json()[0]
            if result['status'] == 'SUCCESS':
                delivery.status = Delivery.SUBMITED
                success = True
            else:
                delivery.status = Delivery.ERROR
                log.error(result)
            delivery.save(update_fields=['status'])
        else:
            log.error(response.json())

        return success

    @classmethod
    def request_refresh_delivery(cls, delivery, config):
        response = requests.get(
            cls.endpoint + f'/orders/{delivery.external_id}/statuses',
            headers={
                'Content-Type': 'application/json',
                'Authorization': config['OAuth']
            }
        )

        can_approve = False

        if response.status_code == 200:
            status_codes = [s['code'] for s in response.json()['statuses']]

            print(status_codes)

            can_approve = cls.update_delivery_status(delivery, status_codes)

        if delivery.status == Delivery.SUBMITED and can_approve:
            cls.update_delivery_label_and_approve(delivery, config)

    @classmethod
    def update_delivery_status(cls, delivery, status_codes):
        can_approve = False

        if 'DELIVERY_LOADED' in status_codes:
            can_approve = True

        if 'SORTING_CENTER_AT_START' in status_codes or 'DELIVERY_AT_START' in status_codes:
            delivery.status = Delivery.IN_DELIVERY

        if 'DELIVERY_DELIVERED' in status_codes:
            delivery.status = Delivery.COMPLETED

        if 'CANCELLED' in status_codes:
            delivery.status = Delivery.CANCELED
            can_approve = False

        delivery.save(update_fields=['status'])
        return can_approve

    @classmethod
    def update_delivery_label_and_approve(cls, delivery, config):
        label_response = requests.get(
            cls.endpoint + f'/orders/{delivery.external_id}/label',
            headers={
                'Authorization': config['OAuth']
            }
        )

        if label_response.status_code == 200:
            delivery.label.save(f'label_{delivery.id}.pdf', ContentFile(label_response.content))
            delivery.status = Delivery.APPROVED
            delivery.save(update_fields=['label', 'status'])
            return True
        else:
            return False
