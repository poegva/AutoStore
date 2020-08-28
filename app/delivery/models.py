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
    CREATED = 'CREATED'
    SHIPMENT_ORDERED = 'SHIPMENT_ORDERED'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'
    STATUS_CHOICES = [
        (REQUESTED, 'Запрошена'),
        (DRAFT, 'Черновик'),
        (CREATED, 'Создана'),
        (SHIPMENT_ORDERED, 'Заказана отгрузка'),
        (IN_DELIVERY, 'В доставке у провайдера'),
        (COMPLETED, 'Выполнена')
    ]

    status = models.CharField(
        max_length=25, choices=STATUS_CHOICES, default=REQUESTED, db_index=True, verbose_name='Статус доставки'
    )

    def __str__(self):
        return f'Доставка по заказу {self.order_id} ({self.get_status_display()})'
