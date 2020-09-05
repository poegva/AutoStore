from celery.task import task

from delivery.models import Delivery
from fulfillment.models import Fulfillment
from shop.utils import send_template_mail
from store import settings


@task()
def request_fulfillments():
    deliveriy_pks_to_fulfill = Delivery.objects.filter(status=Delivery.APPROVED).values_list('pk', flat=True)
    for delivery_pk in deliveriy_pks_to_fulfill:
        request_fulfillment_for_delivery.delay(delivery_pk)


@task()
def request_fulfillment_for_delivery(delivery_pk):
    delivery = Delivery.objects.get(id=delivery_pk)
    fulfillment = Fulfillment.objects.create(delivery=delivery, status=Fulfillment.REQUESTED)
    delivery.status = Delivery.IN_FULFILLMENT
    delivery.save(update_fields=['status'])

    send_template_mail(
        delivery.order.shop.warehouse_email,
        f'HQD Russia: запрошена сборка заказа {delivery.order.id}',
        'fulfillment',
        {'order': delivery.order, 'items': delivery.order.items.all()},
        settings.FULFILLMENT_EMAIL,
        settings.FULFILLMENT_PASSWORD,
        attachments=[delivery.label.path],
    )
    fulfillment.status = Fulfillment.COMPLETED
    fulfillment.save(update_fields=['status'])
