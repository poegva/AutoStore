import logging

from delivery.tasks import request_delivery_for_order

log = logging.getLogger(__name__)


def set_order_payed(order):
    if order.status != order.WAITING_PAYMENT:
        log.warning(f'Attempt to pay order {order.id} second time')
        return

    order.status = order.PAYED
    order.notifications.create()
    order.save(update_fields=['status'])

    request_delivery_for_order.delay(order.id)
