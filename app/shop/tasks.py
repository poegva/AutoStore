
from celery.task import task
from django.db.models import F
from django.utils import timezone

from shop.models import Order


@task()
def cancel_unpayed_orders():
    orders_to_cancel = Order.objects.filter(
        status=Order.WAITING_PAYMENT,
        shop__isnull=False,
        shop__payment_max_time__isnull=False,
        created__lt=timezone.now() - timezone.timedelta(minutes=1) * F('shop__payment_max_time')
    )
    for order in orders_to_cancel:
        order.cancel()
