import json
import logging

import requests
from celery.task import task
from django.utils import timezone

from delivery.models import Delivery
from shop.models import Order
from store import settings


log = logging.getLogger(__name__)


@task()
def start_deliveries():
    orders_to_start_delivery_ids = Order.objects.filter(status=Order.PAYED).values_list('id', flat=True)
    for order_id in orders_to_start_delivery_ids:
        start_delivery_for_order.delay(order_id)


@task()
def start_delivery_for_order(order_id):

    order = Order.objects.get(id=order_id)

    data = {
        'senderId': settings.YANDEX_DELIVERY_CLIENT_ID,
        'externalId': order.id,
        'comment': f'Доставка по заказу {order.id}',
        'deliveryType': order.delivery_option,
        'recipient': {
            'firstName': order.name,
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
            'manualDeliveryForCustomer': order.delivery_cost,
            'paymentMethod': 'PREPAID',
            'assessedValue': order.items_cost,
            'fullyPrepaid': True
        },
        'contacts': [
            {
                'type': 'RECIPIENT',
                'phone': order.phone,
                'firstName': order.name,
            }
        ],
        'deliveryOption': {
            'tariffId': order.delivery_tariff,
            'delivery': order.delivery_cost,
            'partnerId': order.delivery_partner,
        },
        'shipment': {
            'type': 'WITHDRAW',
            'date': (timezone.now().date() + timezone.timedelta(days=1)).isoformat(),
            'warehouseFrom': settings.YANDEX_DELIVERY_WAREHOUSE_ID
        },
        'places': [
            {
                'externalId': order.id,
                'dimensions': settings.YANDEX_DELIVERY_DIMENSIONS,
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
        settings.YANDEX_DELIVERY_API_ENDPOINT + '/orders',
        headers={
            'Content-Type': 'application/json',
            'Authorization': settings.YANDEX_DELIVERY_OAUTH_TOKEN
        },
        data=json.dumps(data).encode('utf-8')
    )

    if response.status_code == 200:
        yandex_id = response.json()

        Delivery.objects.create(order=order, yandex_id=yandex_id)

        order.status = Order.DELIVERY
        order.save(update_fields=['status'])

        log.info(f'Создана Яндекс.Доставка по заказу {order.id}')
    else:
        log.error(f'Ошибка интеграции при создании Яндекс.Доставки по заказу {order.id}: ответ {response.status_code}')
