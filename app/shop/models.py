import logging

from django.db import models, transaction
from django_extensions.db.models import TimeStampedModel


log = logging.getLogger(__name__)


class Shop(models.Model):
    slug = models.SlugField(verbose_name='Слаг магазина')
    name = models.CharField(max_length=200, verbose_name='Название магазина')

    payment_max_time = models.PositiveIntegerField(null=True, blank=True, verbose_name='Время на оплату заказа')

    def __str__(self):
        return self.name


class Item(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, verbose_name='Магазин')

    name = models.CharField(max_length=200, verbose_name='Название')
    description = models.TextField(blank=True, verbose_name='Описание')
    price = models.PositiveIntegerField(verbose_name='Стоимость')

    image = models.FileField(upload_to='items', null=True, blank=True, verbose_name='Изображение')

    shop_quantity = models.PositiveIntegerField(default=0, blank=True, verbose_name='Количество на складе')

    def __str__(self):
        return f'{self.name} - {self.shop.name}'


class OrderQuerySet(models.QuerySet):

    def cancel(self):
        self.update(status=Order.CANCELED)


class Order(TimeStampedModel):
    objects = models.Manager.from_queryset(OrderQuerySet)()

    shop = models.ForeignKey(Shop, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Магазин')

    name = models.CharField(max_length=200, verbose_name='Имя покупателя', blank=True)
    email = models.EmailField(verbose_name='Почта покупателя', blank=True)
    phone = models.CharField(max_length=50, verbose_name='Телефон покупателя', blank=True)

    address = models.JSONField(verbose_name='Адрес покупателя', null=True, blank=True)

    NONE = 'NONE'
    COURIER = 'COURIER'
    POST = 'POST'
    DELIVERY_OPTION_CHOICES = [
        (NONE, 'Не выбрано'),
        (COURIER, 'Курьер'),
        (POST, 'Почта')
    ]
    delivery_option = models.CharField(
        max_length=7, choices=DELIVERY_OPTION_CHOICES, default=NONE, verbose_name='Способ доставки'
    )
    delivery_tariff = models.IntegerField(null=True, blank=True, verbose_name='Тариф доставки')
    delivery_partner = models.IntegerField(null=True, blank=True, verbose_name='Партнер по доставке')

    CREATED = 'CREATED'
    WAITING_PAYMENT = 'WAITING_PAYMENT'
    PAYED = 'PAYED'
    DELIVERY = 'DELIVERY'
    COMPLETED = 'COMPLETED'
    CANCELED = 'CANCELED'
    STATUS_CHOiCES = [
        (CREATED, 'Создан'),
        (WAITING_PAYMENT, 'Ожидает оплаты'),
        (PAYED, 'Оплачен'),
        (DELIVERY, 'В процессе доставки'),
        (COMPLETED, 'Выполнен'),
        (CANCELED, 'Отменен')
    ]
    status = models.CharField(
        max_length=20, choices=STATUS_CHOiCES, default=CREATED, verbose_name='Статус'
    )

    token = models.CharField(max_length=32, blank=True, default='NO_TOKEN', verbose_name='Токен доступа к заказу')

    items_cost = models.IntegerField(default=0, verbose_name='Стоимость товаров')
    delivery_cost = models.IntegerField(default=0, verbose_name='Стоимость доставки')

    @property
    def total_cost(self):
        return self.items_cost + self.delivery_cost

    @transaction.atomic
    def cancel(self, refund=False):
        if self.status in (self.CANCELED, self.DELIVERY, self.COMPLETED):
            log.warning(f'Attempt to cancel order {self.id} with invalid state')
            return

        for order_item in self.items.all():
            order_item.item.shop_quantity += order_item.quantity
            order_item.item.save(update_fields=['shop_quantity'])

        if refund and self.status not in (self.CREATED, self.WAITING_PAYMENT):
            log.warning(f'Need to refund order {self.id}')

        self.status = self.CANCELED
        self.save(update_fields=['status'])

    def set_payed(self):
        if self.status != self.WAITING_PAYMENT:
            log.warning(f'Attempt to pay order {self.id} second time')

        self.status = self.PAYED
        self.save(update_fields=['status'])

    def __str__(self):
        return f'Заказ №{self.pk} ({self.name})'


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, verbose_name='Заказ', related_name='items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE, verbose_name='Товар')
    quantity = models.PositiveIntegerField(verbose_name='Количество')

    def __str__(self):
        return f'{self.item} - {self.quantity} шт. ({self.order})'
