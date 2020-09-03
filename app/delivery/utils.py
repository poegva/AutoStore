import datetime
import logging
from math import sin, cos, sqrt, atan2, radians, ceil

from django.utils import timezone

from dadata import Dadata

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


def convert_option(option, type):
    delivery_date_min = datetime.datetime.strptime(option['delivery']['calculatedDeliveryDateMin'], "%Y-%m-%d").date()
    delivery_date_max = datetime.datetime.strptime(option['delivery']['calculatedDeliveryDateMax'], "%Y-%m-%d").date()

    if type == 'DIRECT_COURIER':
        option['cost']['deliveryForSender'] += 300

    return {
        'cost': int(ceil(option['cost']['deliveryForSender'])),
        'tariff': option['tariffId'],
        'partner': option['delivery']['partner']['id'],
        'date': delivery_date(delivery_date_min, delivery_date_max)
    }


def convert_option_for_delivery_creation(option):
    return {
        'tariffId': option['tariffId'],
        'partnerId': option['delivery']['partner']['id'],
        'delivery': option['cost']['deliveryForSender'],
        'deliveryForCustomer': option['cost']['deliveryForCustomer'],
        'calculatedDeliveryDateMin': option['delivery']['calculatedDeliveryDateMin'],
        'calculatedDeliveryDateMax': option['delivery']['calculatedDeliveryDateMax'],
        'services': option['services']
    }


def get_dadata_suggest(address):
    dadata = Dadata(settings.DADATA_APIKEY, settings.DADATA_SECRET)

    try:
        return dadata.suggest(name='address', query=address)
    except Exception as e:
        log.error('Dadata request exception ' + str(e))
        return None


def geo_distance(lat1, lon1, lat2, lon2):
    lat1r, lon1r, lat2r, lon2r = radians(float(lat1)), radians(float(lon1)), radians(float(lat2)), radians(float(lon2))

    dlon, dlat = lon2r - lon1r, lat2r - lat1r

    a = sin(dlat / 2) ** 2 + cos(lat1r) * cos(lat2r) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return 6373.0 * c
