import datetime
import json

import requests
from django.utils import timezone

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


def get_optimal_delivery(address, delivery_type, assesed_value):
    data = {
        'senderId': 500001942,
        'from': {
            'location': 'г.Москва, ул. Складочная, д. 1',
            'geoId': 213
        },
        'to': {
            'location': address
        },
        'dimensions': {
            'length': 26,
            'height': 17,
            'width': 8,
            'weight': 0.2
        },
        'deliveryType': delivery_type,
        'shipment': {
            'date': '2020-08-10',
            'type': 'WITHDRAW',
            'warehouseId': 10001565560
        },
        'cost': {
            'assesedValue': assesed_value,
            'itemsSum': 0,
            'manualDeliveryForCustomer': 0,
            'fullyPrepaid': True
        }
    }

    response = requests.put(
        'https://api.delivery.yandex.ru/delivery-options',
        headers={
            'Content-Type': 'application/json',
            'Authorization': 'OAuth AgAAAABDt7svAAaJeBQNRE36jEfHi32Bl2XK5Lc'
        },
        data=json.dumps(data).encode('utf-8')
    )
    result = response.json()
    print(result)
    return None if len(result) == 0 else result[0]
