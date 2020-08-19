import datetime

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
