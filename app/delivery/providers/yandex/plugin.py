import datetime
import json
import logging

import requests
from django.core.files.base import ContentFile
from django.utils import timezone

from delivery.models import Delivery
from delivery.utils import convert_option_for_delivery_creation, get_dadata_suggest, geo_distance
from shop.models import Shop, Order
from store import settings


log = logging.getLogger(__name__)


class YandexDeliveryPlugin:
    endpoint = settings.YANDEX_DELIVERY_API_ENDPOINT
    code = Shop.YANDEX
    supported_types = ['POST', 'COURIER', 'DIRECT_COURIER']

    @classmethod
    def yandex_address_from_dadata(cls, shop, suggestion):
        data = suggestion['data']

        locality_full = str(data['region_with_type'])
        if data['city_with_type']:
            locality_full += ', ' + str(data['city_with_type'])
        if data['settlement_with_type']:
            locality_full += ', ' + str(data['settlement_with_type'])

        yandex_address = cls.get_complete_address(shop, locality_full)

        if not yandex_address:
            log.error('Can\'t find address geoId')
            return None

        address_components = {comp['kind']: comp['name'] for comp in yandex_address['addressComponents']}

        return {
            'geoId': yandex_address['geoId'],
            'country': address_components['COUNTRY'],
            'region': address_components['PROVINCE'],
            'locality': address_components['LOCALITY'],
            'street': data['street_with_type'],
            'house': data['house'],
            'housing': data['block'] if data['block_type'] == 'к' else None,
            'building': data['block'] if data['block_type'] == 'стр' else None,
            'apartment': data['flat'],
            'postalCode': data['postal_code'],
        }

    @classmethod
    def get_complete_address(cls, shop, address):
        if shop.delivery_provider != cls.code:
            log.error('Attempt to complete address for shop not connected to Yandex.Delivery')
            return None

        response = requests.get(
            cls.endpoint + f'/location?term={address}',
            headers={
                'Content-Type': 'application/json',
                'Authorization': shop.yandex_oauth_token
            }
        )
        result = response.json()

        return None if len(result) == 0 else result[0]

    @classmethod
    def get_shipment_date(cls, shop):
        deadline = datetime.datetime.combine(
            timezone.localdate(), shop.yandex_pickup_deadline, tzinfo=timezone.localtime().tzinfo
        )
        if timezone.localtime() < deadline:
            return (timezone.localdate() + timezone.timedelta(days=1)).isoformat()
        else:
            return (timezone.localdate() + timezone.timedelta(days=2)).isoformat()

    @classmethod
    def get_optimal_option(cls, shop, delivery_type, address, items_value):
        if shop.delivery_provider != cls.code:
            log.error('Attempt to find options for shop not connected to Yandex.Delivery')
            return None

        if delivery_type == 'COURIER':
            yandex_delivery_type = 'COURIER'
            sorting = True
        elif delivery_type == 'DIRECT_COURIER':
            yandex_delivery_type = 'COURIER'
            sorting = False
        elif delivery_type == 'POST':
            yandex_delivery_type = 'POST'
            sorting = True
        else:
            log.error('Attempt to request delivery with unsupported type')
            return None

        complete_address = cls.get_complete_address(shop, address)

        data = {
            'senderId': shop.yandex_client_id,
            'from': shop.yandex_warehouse_location,
            'to': {
                'location': address,
                'geoId': complete_address['geoId'] if complete_address else None
            },
            'dimensions': shop.yandex_dimensions,
            'deliveryType': yandex_delivery_type,
            'shipment': {
                'type': 'WITHDRAW',
                'date': cls.get_shipment_date(shop),
                'includeNonDefault': True,
            },
            'cost': {
                'assessedValue': items_value,
                'itemsSum': items_value,
                'manualDeliveryForCustomer': 0,
                'fullyPrepaid': True
            }
        }

        response = requests.put(
            cls.endpoint + '/delivery-options',
            headers={
                'Content-Type': 'application/json',
                'Authorization': shop.yandex_oauth_token
            },
            data=json.dumps(data).encode('utf-8')
        )
        result = response.json()

        if not isinstance(result, list):
            log.warning(f"Yandex Delivery options returned {result}")
            return None

        result = [
            option
            for option in result
            if (option['shipments'][0]['partner']['partnerType'] == 'SORTING_CENTER') == sorting
        ]

        return None if len(result) == 0 else result[0]

    @classmethod
    def get_closest_pickup(cls, delivery, pickup_ids, lat, lon):
        data = {
            'pickupPointIds': pickup_ids
        }
        response = requests.put(
            cls.endpoint + '/pickup-points',
            headers={
                'Content-Type': 'application/json',
                'Authorization': delivery.order.shop.yandex_oauth_token
            },
            data=json.dumps(data).encode('utf-8')
        )

        print(data)
        print(response.json())

        if response.status_code == 200:
            result = response.json()
            if len(result) > 0:
                return min(
                    result,
                    key=lambda p: geo_distance(lat, lon, p['address']['latitude'], p['address']['longitude'])
                )

        return None

    @classmethod
    def start_delivery(cls, delivery):
        order = delivery.order

        optimal_option = cls.get_optimal_option(order.shop, order.delivery_type, order.address, order.items_cost)

        converted_option = convert_option_for_delivery_creation(optimal_option)

        dadata_suggestion = get_dadata_suggest(order.address)
        if not dadata_suggestion:
            log.error('Dadata returned None, can\'t start delivery')
            return
        yandex_address = cls.yandex_address_from_dadata(order.shop, dadata_suggestion)
        if not yandex_address:
            log.error('Yandex address is None, can\'t start delivery')
            return

        pickup_point = None

        if order.delivery_type in ('COURIER', 'DIRECT_COURIER'):
            yandex_delivery_type = 'COURIER'
        elif order.delivery_type == 'POST':
            yandex_delivery_type = 'POST'
            pickup_point = cls.get_closest_pickup(
                delivery,
                optimal_option['pickupPointIds'],
                dadata_suggestion['data']['geo_lat'],
                dadata_suggestion['data']['geo_lon'],
            )
        else:
            log.error('Unknown delivery type')
            return

        name_parts = order.name.split()
        if len(name_parts) == 2:
            first_name, last_name = name_parts
        else:
            first_name, last_name = order.name, '-'

        data = {
            'senderId': settings.YANDEX_DELIVERY_CLIENT_ID,
            'externalId': order.id,
            'comment': f'Доставка по заказу {order.id}',
            'deliveryType': yandex_delivery_type,
            'recipient': {
                'firstName': first_name,
                'lastName': last_name,
                'email': order.email,
                'address': yandex_address,
                'pickupPointId': pickup_point['id'],
            },
            'cost': {
                'manualDeliveryForCustomer': 0,
                'paymentMethod': 'PREPAID',
                'assessedValue': order.items_cost,
                'fullyPrepaid': True
            },
            'contacts': [
                {
                    'type': 'RECIPIENT',
                    'phone': order.phone,
                    'firstName': first_name,
                    'lastName': last_name,
                }
            ],
            'deliveryOption': converted_option,
            'shipment': {
                'type': 'WITHDRAW',
                'date': cls.get_shipment_date(order.shop),
                'warehouseFrom': settings.YANDEX_DELIVERY_WAREHOUSE_ID,
                'partnerTo': optimal_option['shipments'][0]['partner']['id'],
            },
            'places': [
                {
                    'externalId': order.id,
                    'dimensions': order.shop.yandex_dimensions,
                    'items': [
                        {
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
                        for order_item in order.items.prefetch_related('item').all()
                    ]
                }
            ]
        }

        response = requests.post(
            cls.endpoint + '/orders',
            headers={
                'Content-Type': 'application/json',
                'Authorization': order.shop.yandex_oauth_token
            },
            data=json.dumps(data).encode('utf-8')
        )

        log.warning(data)

        if response.status_code == 200:
            delivery.status = Delivery.DRAFT
            delivery.external_id = response.json()
            delivery.shipment_partner = int(optimal_option['shipments'][0]['partner']['id'])
            delivery.save(update_fields=['status', 'external_id', 'shipment_partner'])

            log.info(f'Создан черновик Яндекс.Доставки по заказу {order.id}')

            cls.submit_delivery(delivery)
        else:
            log.error(f'Ошибка интеграции при создании Яндекс.Доставки по заказу {order.id}')
            log.error(response.json())
            delivery.status = Delivery.ERROR
            delivery.save(update_fields=['status'])

    @classmethod
    def submit_delivery(cls, delivery):
        data = {
            'orderIds': [delivery.external_id]
        }

        response = requests.post(
            cls.endpoint + '/orders/submit',
            headers={
                'Content-Type': 'application/json',
                'Authorization': delivery.order.shop.yandex_oauth_token
            },
            data=json.dumps(data).encode('utf-8')
        )

        if response.status_code == 200:
            result = response.json()[0]
            if result['status'] == 'SUCCESS':
                delivery.status = Delivery.SUBMITED
                log.info(f'Оформлена Яндекс.Доставка по заказу {delivery.order_id}')
            else:
                delivery.status = Delivery.ERROR
                log.error(result)
        else:
            log.error(response.json())

        delivery.save(update_fields=['status'])

    @classmethod
    def refresh_delivery(cls, delivery):
        response = requests.get(
            cls.endpoint + f'/orders/{delivery.external_id}/statuses',
            headers={
                'Content-Type': 'application/json',
                'Authorization': delivery.order.shop.yandex_oauth_token
            }
        )

        if response.status_code == 200:
            result = response.json()
            status_codes = [s['code'] for s in result['statuses']]

            print(result)

            canceled = 'CANCELLED' in status_codes

            if canceled:
                delivery.status = Delivery.CANCELED
                delivery.save(update_fields=['status'])
                return

            is_created = 'CREATED' in status_codes

            if is_created and delivery.status in [Delivery.DRAFT, Delivery.SUBMITED]:
                delivery.status = Delivery.APPROVED
                delivery.save(update_fields=['status'])
            
            if not bool(delivery.label) and is_created:
                label_response = requests.get(
                    cls.endpoint + f'/orders/{delivery.external_id}/label',
                    headers={
                        'Authorization': delivery.order.shop.yandex_oauth_token
                    }
                )

                if label_response.status_code == 200:
                    delivery.label.save(f'label_{delivery.id}.pdf', ContentFile(label_response.content))
                    delivery.save(update_fields=['label'])
