from django.db import models

from shop.models import Order


class Delivery(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name='Заказ')

    NONE = 'NONE'
    YANDEX = 'YANDEX_DELIVERY'
    PROIVDER_CHOICES = [
        (NONE, 'Отсутствует'),
        (YANDEX, 'Яндекс.Доставка'),
    ]
    provider = models.CharField(
        max_length=20, choices=PROIVDER_CHOICES, default=NONE, db_index=True, verbose_name='Провайдер'
    )

    external_id = models.BigIntegerField(null=True, blank=True, db_index=True, verbose_name='ID в системе провайдера')

    REQUESTED = 'REQUESTED'
    DRAFT = 'DRAFT'
    SUBMITED = 'SUBMITED'
    APPROVED = 'APPROVED'
    IN_FULFILLMENT = 'IN_FULFILLMENT'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'
    ERROR = 'ERROR'
    CANCELED = 'CANCELED'
    STATUS_CHOICES = [
        (REQUESTED, 'Запрошена'),
        (DRAFT, 'Черновик'),
        (SUBMITED, 'Оформлена'),
        (APPROVED, 'Подтверждена'),
        (IN_FULFILLMENT, 'Передана в фулфиллмент'),
        (IN_DELIVERY, 'В доставке у провайдера'),
        (COMPLETED, 'Выполнена'),
        (ERROR, 'Ошибка'),
        (CANCELED, 'Отменена')
    ]

    status = models.CharField(
        max_length=25, choices=STATUS_CHOICES, default=REQUESTED, db_index=True, verbose_name='Статус доставки'
    )

    shipment_partner = models.BigIntegerField(null=True, blank=True, db_index=True, verbose_name='Партнер отгрузки')

    label = models.FileField(upload_to='labels', null=True, blank=True, verbose_name='Ярлык')

    def __str__(self):
        return f'Доставка по заказу {self.order_id} ({self.get_status_display()})'
