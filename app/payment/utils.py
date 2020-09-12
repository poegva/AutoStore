import uuid

from django.db import transaction

from payment.models import Payment
from yandex_checkout import Configuration, Payment as YandexPayment

from shop.utils import set_order_payed
from store import settings


@transaction.atomic
def refresh_payment(payment):
    Configuration.configure(settings.YANDEX_CHECKOUT_CLIENT_ID, settings.YANDEX_CHECKOUT_SECRET_KEY)
    yandex_payment = YandexPayment.find_one(payment.yandex_id)

    need_to_set_payed = False
    if payment.status == Payment.PENDING and yandex_payment.status in (Payment.WAITING_FOR_CAPTURE, Payment.SUCCEEDED):
        need_to_set_payed = True

    payment.status = yandex_payment.status
    if yandex_payment.cancellation_details:
        payment.cancellation_reason = yandex_payment.cancellation_details.reason
    payment.save(update_fields=['status', 'cancellation_reason'])

    if need_to_set_payed:
        set_order_payed(payment.order)

    return payment


def create_payment(order):
    Configuration.configure(settings.YANDEX_CHECKOUT_CLIENT_ID, settings.YANDEX_CHECKOUT_SECRET_KEY)
    idempotence_key = str(uuid.uuid4())
    yandex_payment = YandexPayment.create({
        'amount': {
            'value': str(order.total_cost),
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
        return succeeded.first(), False, None

    reason = None
    canceled = Payment.objects.filter(order=order, status=Payment.CANCELED).order_by('-id')
    if canceled.exists():
        reason = canceled.first().cancellation_reason

    pending = Payment.objects.filter(order=order, status=Payment.PENDING)
    if pending.exists():
        payment = pending.first()
        payment = refresh_payment(payment)
        if payment.status != Payment.CANCELED:
            return payment, False, reason
        else:
            reason = payment.cancellation_reason

    return create_payment(order), True, reason


