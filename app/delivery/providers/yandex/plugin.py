import datetime
import json
import logging

import requests
from django.utils import timezone

from delivery.models import Delivery
from delivery.utils import convert_option_for_delivery_creation
from shop.models import Shop, Order
from store import settings


log = logging.getLogger(__name__)


class YandexDeliveryPlugin:
    endpoint = settings.YANDEX_DELIVERY_API_ENDPOINT
    code = Shop.YANDEX

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
    def get_optimal_option(cls, shop, delivery_type, address, items_value, sorting=True):
        if shop.delivery_provider != cls.code:
            log.error('Attempt to find options for shop not connected to Yandex.Delivery')
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
            'deliveryType': delivery_type,
            'shipment': {
                'type': 'WITHDRAW',
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

        print(result)

        return None if len(result) == 0 else result[0]

    @classmethod
    def start_delivery(cls, delivery):
        order = delivery.order

        optimal_option = cls.get_optimal_option(
            order.shop, order.delivery_type, order.address, order.items_cost,
            sorting=True
        )

        print(optimal_option)

        converted_option = convert_option_for_delivery_creation(optimal_option)

        data = {
            'senderId': settings.YANDEX_DELIVERY_CLIENT_ID,
            'externalId': order.id,
            'comment': f'Доставка по заказу {order.id}',
            'deliveryType': order.delivery_type,
            'recipient': {
                'firstName': order.name,
                'lastName': '-',
                'email': order.email,
                'address': {
                    'geoId': 213,
                    'country': 'Россия',
                    'region': 'Москва',
                    'locality': 'Москва',
                    'street': 'ул. Большая Татарская',
                    'house': '32',
                    'apartment': '20',
                    'postalCode': '115184',
                }
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
                    'firstName': order.name,
                    'lastName': '-'
                }
            ],
            'deliveryOption': converted_option,
            'shipment': {
                'type': 'WITHDRAW',
                'date': timezone.now().date().isoformat(),
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

        print(data)

        response = requests.post(
            cls.endpoint + '/orders',
            headers={
                'Content-Type': 'application/json',
                'Authorization': order.shop.yandex_oauth_token
            },
            data=json.dumps(data).encode('utf-8')
        )

        if response.status_code == 200:
            delivery.status = Delivery.DRAFT
            delivery.external_id = response.json()
            delivery.save(update_fields=['status', 'external_id'])

            order.status = Order.DELIVERY
            order.save(update_fields=['status'])

            log.info(f'Создана Яндекс.Доставка по заказу {order.id}')
        else:
            log.error(f'Ошибка интеграции при создании Яндекс.Доставки по заказу {order.id}')
            log.error(response.json())
