from django.db import models

from delivery.utils import get_dadata_suggest


def get_empty_dict():
    return dict()


YANDEX = 'YANDEX'
MANUAL = 'MANUAL'

PROVIDER_CHOICES = [
    (MANUAL, 'Самостоятельная доставка'),
    (YANDEX, 'Яндекс.Доставка'),
]


class AddressManager(models.Manager):
    def get_or_create(self, value):
        existing = self.filter(value=value)
        if existing.exists():
            return existing.first()
        else:
            dadata_suggest = get_dadata_suggest(value)[0]
            address = Address.from_dadata(dadata_suggest)
            address.save()
            return address


class Address(models.Model):
    objects = AddressManager()

    country = models.CharField(max_length=200, null=True, blank=True, verbose_name='Страна')
    region = models.CharField(max_length=200, null=True, blank=True, verbose_name='Регион')
    settlement = models.CharField(max_length=400, null=True, blank=True, verbose_name='Населенный пункт')
    street = models.CharField(max_length=400, null=True, blank=True, verbose_name='Улица')
    house = models.CharField(max_length=20, null=True, blank=True, verbose_name='Дом')
    building = models.CharField(max_length=20, null=True, blank=True, verbose_name='Корпус')
    apartment = models.CharField(max_length=20, null=True, blank=True, verbose_name='Квартира')
    postal_code = models.CharField(max_length=6, null=True, blank=True, verbose_name='Почтовый индекс')

    kladr = models.CharField(max_length=50, null=True, blank=True, verbose_name='Код КЛАДР')
    latitude = models.CharField(max_length=50, null=True, blank=True, verbose_name='Широта')
    longitude = models.CharField(max_length=50, null=True, blank=True, verbose_name='Долгота')

    value = models.CharField(
        max_length=1000, db_index=True, unique=True, null=True, blank=True, verbose_name='Полный адрес'
    )

    @classmethod
    def from_dadata(cls, suggestion):
        data = suggestion['data']
        return cls(
            country=data['country'],
            region=data['region_with_type'],
            settlement=data['settlement_with_type'] if data['settlement_with_type'] else data['city_with_type'],
            street=data['street_with_type'],
            house=data['house'],
            building=(data['block_type'] + ' ' + data['block']) if data['block'] else None,
            apartment=data['flat'],
            postal_code=data['postal_code'],
            kladr=data['kladr_id'],
            latitude=data['geo_lat'],
            longitude=data['geo_lon'],
            value=suggestion['value'],
        )

    def __str__(self):
        return self.value


class Warehouse(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True, verbose_name='Название')
    shop = models.OneToOneField('shop.Shop', on_delete=models.CASCADE, verbose_name='Магазин')

    address = models.ForeignKey(Address, null=True, on_delete=models.SET_NULL, verbose_name='Адрес')

    email = models.EmailField(null=True, blank=True, verbose_name='Почтовый адрес')

    extra = models.JSONField(default=get_empty_dict, blank=True, verbose_name='Дополнительная информация')

    def __str__(self):
        return f'Склад магазина {self.shop}'


class DeliveryProviderConfiguration(models.Model):
    shop = models.ForeignKey('shop.Shop', on_delete=models.CASCADE, verbose_name='Магазин')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default=MANUAL, verbose_name='Тип провайдера')

    config = models.JSONField(default=get_empty_dict, blank=True, verbose_name='Кофигурация')

    def __str__(self):
        return f'Конфигурация провайдера {self.provider} магазина {self.shop}'

    class Meta:
        unique_together = ['shop', 'provider']
        index_together = ['shop', 'provider']


class DeliveryType(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True, verbose_name='Название')
    code = models.SlugField(verbose_name='Код типа доставки')

    shop = models.ForeignKey('shop.Shop', on_delete=models.CASCADE, related_name='delivery_types', verbose_name='Магазин')

    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES, default=MANUAL, verbose_name='Тип провайдера')

    NO_TYPE = 'NO_TYPE'
    POST = 'POST'
    COURIER = 'COURIER'
    PICKUP = 'PICKUP'

    TYPE_CHOICES = [
        (NO_TYPE, 'Нет типа'),
        (POST, 'Почта'),
        (COURIER, 'Курьер'),
        (PICKUP, 'Пункт самовывоза')
    ]
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default=NO_TYPE, verbose_name='Тип доставки')

    extra = models.JSONField(default=get_empty_dict, blank=True, verbose_name='Дополнительная информация')

    def __str__(self):
        return f'Тип доставки "{self.name}" магазина {self.shop}'


class Recipient(models.Model):
    first_name = models.CharField(max_length=200, verbose_name='Имя')
    last_name = models.CharField(max_length=200, verbose_name='Фамилия')

    phone = models.CharField(max_length=50, verbose_name='Телефон')
    email = models.EmailField(blank=True, verbose_name='Email')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class PackageManager(models.Manager):
    def for_delivery(self, delivery):
        qs = self.filter(shop=delivery.type.shop).order_by('weight')

        if qs.exists():
            return qs.first()
        else:
            return None


class Package(models.Model):
    objects = PackageManager()

    shop = models.ForeignKey('shop.Shop', on_delete=models.CASCADE, verbose_name='Магазин')

    length = models.PositiveIntegerField(verbose_name='Длина (см)')
    width = models.PositiveIntegerField(verbose_name='Ширина (см)')
    height = models.PositiveIntegerField(verbose_name='Высота (см)')
    weight = models.DecimalField(decimal_places=3, max_digits=8, verbose_name='Вес (кг)')

    def __str__(self):
        return f'Упаковка {self.id} магазина {self.shop}'


class Delivery(models.Model):
    order = models.OneToOneField('shop.Order', on_delete=models.CASCADE, verbose_name='Заказ')
    type = models.ForeignKey(DeliveryType, null=True, on_delete=models.SET_NULL, verbose_name='Тип доставки')

    to = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, verbose_name='Адрес доставки')
    recipient = models.ForeignKey(Recipient, on_delete=models.SET_NULL, null=True, verbose_name='Получатель')

    package = models.ForeignKey(Package, on_delete=models.SET_NULL, null=True, verbose_name='Упаковка')

    REQUESTED = 'REQUESTED'
    SUBMITED = 'SUBMITED'
    APPROVED = 'APPROVED'
    IN_FULFILLMENT = 'IN_FULFILLMENT'
    IN_DELIVERY = 'IN_DELIVERY'
    COMPLETED = 'COMPLETED'
    ERROR = 'ERROR'
    CANCELED = 'CANCELED'
    STATUS_CHOICES = [
        (REQUESTED, 'Запрошена'),
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

    external_id = models.BigIntegerField(null=True, blank=True, db_index=True, verbose_name='ID в системе провайдера')
    cost = models.PositiveIntegerField(default=0, verbose_name='Стоимость')
    label = models.FileField(upload_to='labels', null=True, blank=True, verbose_name='Ярлык')

    extra = models.JSONField(default=get_empty_dict, blank=True, verbose_name='Дополнительная информация')

    def __str__(self):
        return f'Доставка по заказу {self.order_id} ({self.get_status_display()})'
