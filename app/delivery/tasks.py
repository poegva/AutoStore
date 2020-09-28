import logging

from celery.task import task
from django.db import transaction
from django.utils import timezone

from delivery.models import Delivery, Address, Recipient, Package, MANUAL, Shipment
from delivery.providers import PROVIDERS
from shop.models import Order
from store import settings
from store.utils import send_template_mail

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

    if order.status != Order.PAYED or hasattr(order, 'delivery'):
        log.warning(f'Requesting delivery second time for order {order.id}')
        return

    delivery_type = order.shop.delivery_types.get(code=order.delivery_type)

    to = Address.objects.get_or_create(order.address)

    first_name, last_name = order.name.split()[:2]
    recipient = Recipient.objects.create(
        first_name=first_name,
        last_name=last_name,
        phone=order.phone,
        email=order.email,
    )

    package = Package.objects.filter(shop=order.shop).first()

    Delivery.objects.create(
        order=order,
        type=delivery_type,
        to=to,
        recipient=recipient,
        package=package,
        cost=order.delivery_cost
    )

    order.status = Order.DELIVERY
    order.save(update_fields=['status'])


@task()
def submit_deliveries():
    deliveries_to_start_ids = (
        Delivery.objects
        .filter(status=Delivery.REQUESTED)
        .exclude(type__provider=MANUAL)
        .values_list('id', flat=True)
    )
    for delivery_id in deliveries_to_start_ids:
        submit_delivery.delay(delivery_id)


@task()
def submit_delivery(delivery_id):
    delivery = Delivery.objects.get(id=delivery_id)
    PROVIDERS[delivery.type.provider].submit_delivery(delivery)


@task()
def refresh_deliveries():
    for delivery_id in (
        Delivery.objects
        .exclude(type__isnull=True)
        .exclude(type__provider=MANUAL)
        .exclude(status__in=[Delivery.REQUESTED, Delivery.CANCELED, Delivery.COMPLETED, Delivery.ERROR])
        .values_list('id', flat=True)
    ):
        refresh_delivery.delay(delivery_id)


@task()
def refresh_delivery(delivery_id):
    delivery = Delivery.objects.get(id=delivery_id)
    PROVIDERS[delivery.type.provider].refresh_delivery(delivery)


@task()
def request_shipments():
    for provider in PROVIDERS.values():
        provider.request_shipments()


@task()
def refresh_shipments():
    shipments_to_refresh_ids = (
        Shipment.objects
        .filter(date__gte=timezone.localdate())
        .exclude(status__in=[Shipment.REPORTED, Shipment.COMPLETED])
        .values_list('id', flat=True)
    )
    for shipment_id in shipments_to_refresh_ids:
        refresh_shipment.delay(shipment_id)


@task()
def refresh_shipment(shipment_id):
    shipment = Shipment.objects.get(id=shipment_id)
    PROVIDERS[shipment.provider].refresh_shipment(shipment)


@task()
def report_shipments():
    shipments_to_report_ids = Shipment.objects.filter(status=Shipment.APPROVED).values_list('id', flat=True)
    for shipment_id in shipments_to_report_ids:
        report_shipment.delay(shipment_id)


@task()
def report_shipment(shipment_id):
    shipment = Shipment.objects.get(id=shipment_id)

    send_template_mail(
        shipment.shop.warehouse_email,
        f'HQD Russia: назначена отгрузка',
        'shipment',
        {'date': shipment.date.isoformat()},
        settings.FULFILLMENT_EMAIL,
        settings.FULFILLMENT_PASSWORD,
        attachments=[shipment.act.path],
    )
    shipment.status = Shipment.REPORTED
    shipment.save(update_fields=['status'])
