from django.db import models

from shop.models import Order


class Delivery(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name='Заказ')

    yandex_id = models.IntegerField(db_index=True, verbose_name='ID в Яндекс.Доставке')

    DRAFT = 'DRAFT'
    CREATED = 'CREATED'
    SHIPMENT_ORDERED = 'SHIPMENT_ORDERED'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'
    STATUS_CHOICES = [
        (DRAFT, 'Черновик'),
        (CREATED, 'Создана'),
        (SHIPMENT_ORDERED, 'Заказана отгрузка'),
        (IN_DELIVERY, 'В Яндекс.Доставке'),
        (COMPLETED, 'Выполнена')
    ]

    status = models.CharField(
        max_length=25, choices=STATUS_CHOICES, default=DRAFT, db_index=True, verbose_name='Статус доставки'
    )
