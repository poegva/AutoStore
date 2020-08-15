import uuid

from django.db import transaction

from payment.models import Payment
from yandex_checkout import Configuration, Payment as YandexPayment

from shop.models import Order
from store import settings


@transaction.atomic
def refresh_payment(payment):
    Configuration.configure(settings.YANDEX_CHECKOUT_CLIENT_ID, settings.YANDEX_CHECKOUT_SECRET_KEY)
    yandex_payment = YandexPayment.find_one(payment.yandex_id)
    if payment.status == Payment.PENDING and yandex_payment.status in (Payment.WAITING_FOR_CAPTURE, Payment.SUCCEEDED):
        payment.order.status = Order.PAYED
        payment.order.save(update_fields=['status'])
    payment.status = yandex_payment.status
    payment.save(update_fields=['status'])
    return payment


def create_payment(order):
    Configuration.configure(settings.YANDEX_CHECKOUT_CLIENT_ID, settings.YANDEX_CHECKOUT_SECRET_KEY)
    idempotence_key = str(uuid.uuid4())
    yandex_payment = YandexPayment.create({
        'amount': {
            'value': '10.00',
            'currency': 'RUB',
        },
        'description': f'Платеж по заказу {order.id}',
        'confirmation': {
            'type': 'embedded'
        }
    }, idempotence_key)

    payment = Payment.objects.create(
        order=order,
        yandex_id=yandex_payment.id,
        status=yandex_payment.status,
        amount=yandex_payment.amount.value,
        currency=yandex_payment.amount.currency,
        confirmation_token=yandex_payment.confirmation.confirmation_token
    )
    return payment


def get_or_create_payment(order):
    succeeded = Payment.objects.filter(order=order, status__in=(Payment.SUCCEEDED, Payment.WAITING_FOR_CAPTURE))
    if succeeded.exists():
        return succeeded.first()

    pending = Payment.objects.filter(order=order, status=Payment.PENDING)
    if pending.exists():
        payment = pending.first()
        payment = refresh_payment(payment)
        if payment.status != Payment.CANCELLED:
            return payment

    return create_payment(order)


