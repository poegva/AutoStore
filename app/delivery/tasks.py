import json
import logging

import requests
from celery.task import task
from django.db import transaction
from django.utils import timezone

from delivery.models import Delivery
from delivery.providers.yandex.plugin import YandexDeliveryPlugin
from shop.models import Order, Shop
from store import settings


log = logging.getLogger(__name__)


@task()
def request_deliveries():
    orders_to_request_delivery_ids = Order.objects.filter(status=Order.PAYED).values_list('id', flat=True)
    for order_id in orders_to_request_delivery_ids:
        request_delivery_for_order.delay(order_id)


@task()
@transaction.atomic
def request_delivery_for_order(order_id):
    order = Order.objects.get(id=order_id)
    Delivery.objects.create(order=order, provider=order.shop.delivery_provider, status=Delivery.REQUESTED)
    order.status = Order.DELIVERY
    order.save(update_fields=['status'])


@task()
def start_yandex_deliveries():
    deliveries_to_start_ids = (
        Delivery.objects
        .filter(provider=Delivery.YANDEX, status=Delivery.REQUESTED)
        .values_list('id', flat=True)
    )
    for delivery_id in deliveries_to_start_ids:
        start_yandex_delivery.delay(delivery_id)


@task()
def start_yandex_delivery(delivery_id):
    delivery = Delivery.objects.get(id=delivery_id)
    YandexDeliveryPlugin.start_delivery(delivery)
