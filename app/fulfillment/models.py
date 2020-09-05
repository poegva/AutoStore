from django.db import models

from delivery.models import Delivery


class Fulfillment(models.Model):
    delivery = models.ForeignKey(Delivery, on_delete=models.CASCADE, verbose_name='Заказ')

    REQUESTED = 'REQUESTED'
    COMPLETED = 'COMPLETED'
    STATUS_CHOICES = [
        (REQUESTED, 'Запрошен'),
        (COMPLETED, 'Собран')
    ]
    status = models.CharField(max_length=20, default=REQUESTED, verbose_name='Статус')

    def __str__(self):
        return f'Фулфиллмент по заказу {self.delivery.order_id}'
