import logging

from django.core.mail import EmailMultiAlternatives, get_connection
from django.template.loader import get_template

from delivery.tasks import request_delivery_for_order

log = logging.getLogger(__name__)


def send_template_mail(to, subject, template_name, context, from_mail, from_password, attachments=None):

    plain_text = get_template(template_name + '.txt')
    html_text = get_template(template_name + '.html')

    connection = get_connection(username=from_mail, password=from_password)
    msg = EmailMultiAlternatives(subject, plain_text.render(context), from_mail, [to], connection=connection)
    msg.attach_alternative(html_text.render(context), 'text/html')

    if attachments is None:
        attachments = []
    for attachment in attachments:
        msg.attach_file(attachment)

    msg.send()


def set_order_payed(order):
    if order.status != order.WAITING_PAYMENT:
        log.warning(f'Attempt to pay order {order.id} second time')
        return

    order.status = order.PAYED
    order.notifications.create()
    order.save(update_fields=['status'])

    request_delivery_for_order.delay(order.id)
