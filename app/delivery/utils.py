import datetime
import json

import requests
from django.utils import timezone

from store import settings

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


def delivery_date(min_date, max_date):
    if max_date == timezone.now().date():
        return 'cегодня'
    if max_date == (timezone.now() + timezone.timedelta(days=1)).date():
        return 'завтра'
    if min_date == max_date:
        return f'{max_date.day} {months[max_date.month]}'
    if min_date.month == max_date.month:
        return f'{min_date.day}-{max_date.day} {months[max_date.month]}'
    return f'{min_date.day} {min_date.month} - {max_date.day} {max_date.month}'


def convert_option(option):
    delivery_date_min = datetime.datetime.strptime(option['delivery']['calculatedDeliveryDateMin'], "%Y-%m-%d").date()
    delivery_date_max = datetime.datetime.strptime(option['delivery']['calculatedDeliveryDateMax'], "%Y-%m-%d").date()

    return {
        'cost': option['cost']['delivery'],
        'date': delivery_date(delivery_date_min, delivery_date_max)
    }


def get_complete_address(address):
    response = requests.get(
        settings.YANDEX_DELIVERY_API_ENDPOINT + f'/location?term={address}',
        headers={
            'Content-Type': 'application/json',
            'Authorization': settings.YANDEX_DELIVERY_OAUTH_TOKEN
        }
    )
    result = response.json()

    return None if len(result) == 0 else result[0]


def get_optimal_delivery(address, delivery_type, assesed_value):
    complete_address = get_complete_address(address)

    data = {
        'senderId': settings.YANDEX_DELIVERY_CLIENT_ID,
        'from': settings.YANDEX_DELIVERY_WAREHOUSE_LOCATION,
        'to': {
            'location': address,
            'geoId': complete_address['geoId'] if complete_address else None
        },
        'dimensions': settings.YANDEX_DELIVERY_DIMENSIONS,
        'deliveryType': delivery_type,
        'shipment': {
            'type': 'WITHDRAW',
            'warehouseId': settings.YANDEX_DELIVERY_WAREHOUSE_ID
        },
        'cost': {
            'assesedValue': assesed_value,
            'itemsSum': 0,
            'manualDeliveryForCustomer': 0,
            'fullyPrepaid': True
        }
    }

    response = requests.put(
        settings.YANDEX_DELIVERY_API_ENDPOINT + '/delivery-options',
        headers={
            'Content-Type': 'application/json',
            'Authorization': settings.YANDEX_DELIVERY_OAUTH_TOKEN
        },
        data=json.dumps(data).encode('utf-8')
    )
    result = response.json()

    if not isinstance(result, list):
        print(result)
        return None

    return None if len(result) == 0 else result[0]
