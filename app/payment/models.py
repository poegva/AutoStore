from django.db import models

from shop.models import Order


class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name='Заказ')

    yandex_id = models.CharField(max_length=200, verbose_name='ID в Яндекс Кассе')

    PENDING = 'pending'
    WAITING_FOR_CAPTURE = 'waiting_for_capture'
    SUCCEEDED = 'succeeded'
    CANCELLED = 'cancelled'
    STATUS_CHOICES = [
        (PENDING, 'Ожидает оплаты'),
        (WAITING_FOR_CAPTURE, 'Оплачен, ожидает подтверждения'),
        (SUCCEEDED, 'Оплачен и подтвержден'),
        (CANCELLED, 'Отменен')
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True, verbose_name='Статус платежа')

    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Сумма платежа')
    currency = models.CharField(max_length=3, default='RUB', verbose_name='Валюта платежа')

    confirmation_token = models.CharField(max_length=200, null=True, verbose_name='Токен подтверждения')

    def __str__(self):
        return f'Платеж по заказу {self.order_id} на сумму {self.amount} {self.currency}'
