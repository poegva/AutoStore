import datetime
import math
import logging

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


def convert_option(option):
    delivery_date_min = datetime.datetime.strptime(option['delivery']['calculatedDeliveryDateMin'], "%Y-%m-%d").date()
    delivery_date_max = datetime.datetime.strptime(option['delivery']['calculatedDeliveryDateMax'], "%Y-%m-%d").date()

    return {
        'cost': int(math.ceil(option['cost']['deliveryForSender'])),
        'tariff': option['tariffId'],
        'partner': option['delivery']['partner']['id'],
        'date': delivery_date(delivery_date_min, delivery_date_max)
    }


def convert_option_for_delivery_creation(option):
    return {
        'tariffId': option['tariffId'],
        'partnerId': option['delivery']['partner']['id'],
        'delivery': option['cost']['deliveryForSender'],
        'deliveryForCustomer': 0,
        'calculatedDeliveryDateMin': option['delivery']['calculatedDeliveryDateMin'],
        'calculatedDeliveryDateMax': option['delivery']['calculatedDeliveryDateMax'],
        'services': option['services']
    }


def get_dadata_suggest(address):
    dadata = Dadata(settings.DADATA_APIKEY, settings.DADATA_SECRET)

    try:
        suggestions = dadata.suggest(name='address', query=address)
        if len(suggestions) == 0:
            return None
        else:
            return suggestions[0]
    except Exception as e:
        log.error('Dadata request exception ' + str(e))
        return None
