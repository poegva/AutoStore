# Generated by Django 3.1 on 2020-09-11 15:36

import delivery.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0022_shop_warehouse_email'),
        ('delivery', '0005_auto_20200905_1352'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country', models.CharField(blank=True, max_length=200, null=True, verbose_name='Страна')),
                ('region', models.CharField(blank=True, max_length=200, null=True, verbose_name='Регион')),
                ('settlement', models.CharField(blank=True, max_length=400, null=True, verbose_name='Населенный пункт')),
                ('street', models.CharField(blank=True, max_length=400, null=True, verbose_name='Улица')),
                ('house', models.CharField(blank=True, max_length=20, null=True, verbose_name='Дом')),
                ('building', models.CharField(blank=True, max_length=20, null=True, verbose_name='Корпус')),
                ('apartment', models.CharField(blank=True, max_length=20, null=True, verbose_name='Квартира')),
                ('postal_code', models.CharField(blank=True, max_length=6, null=True, verbose_name='Почтовый индекс')),
                ('kladr', models.CharField(blank=True, max_length=50, null=True, verbose_name='Код КЛАДР')),
                ('latitude', models.CharField(blank=True, max_length=50, null=True, verbose_name='Широта')),
                ('longitude', models.CharField(blank=True, max_length=50, null=True, verbose_name='Долгота')),
                ('value', models.CharField(blank=True, db_index=True, max_length=1000, null=True, unique=True, verbose_name='Полный адрес')),
            ],
        ),
        migrations.CreateModel(
            name='Recipient',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=200, verbose_name='Имя')),
                ('last_name', models.CharField(max_length=200, verbose_name='Фамилия')),
                ('phone', models.CharField(max_length=50, verbose_name='Телефон')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='Email')),
            ],
        ),
        migrations.RemoveField(
            model_name='delivery',
            name='provider',
        ),
        migrations.RemoveField(
            model_name='delivery',
            name='shipment_partner',
        ),
        migrations.AddField(
            model_name='delivery',
            name='cost',
            field=models.PositiveIntegerField(default=0, verbose_name='Стоимость'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='extra',
            field=models.JSONField(blank=True, default=delivery.models.get_empty_dict, verbose_name='Дополнительная информация'),
        ),
        migrations.AlterField(
            model_name='delivery',
            name='status',
            field=models.CharField(choices=[('REQUESTED', 'Запрошена'), ('SUBMITED', 'Оформлена'), ('APPROVED', 'Подтверждена'), ('IN_FULFILLMENT', 'Передана в фулфиллмент'), ('IN_DELIVERY', 'В доставке у провайдера'), ('COMPLETED', 'Выполнена'), ('ERROR', 'Ошибка'), ('CANCELED', 'Отменена')], db_index=True, default='REQUESTED', max_length=25, verbose_name='Статус доставки'),
        ),
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True, verbose_name='Название')),
                ('email', models.EmailField(blank=True, max_length=254, null=True, verbose_name='Почтовый адрес')),
                ('extra', models.JSONField(blank=True, default=delivery.models.get_empty_dict, verbose_name='Дополнительная информация')),
                ('address', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='delivery.address', verbose_name='Адрес')),
                ('shop', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='shop.shop', verbose_name='Магазин')),
            ],
        ),
        migrations.CreateModel(
            name='Package',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('length', models.PositiveIntegerField(verbose_name='Длина (см)')),
                ('width', models.PositiveIntegerField(verbose_name='Ширина (см)')),
                ('height', models.PositiveIntegerField(verbose_name='Высота (см)')),
                ('weight', models.DecimalField(decimal_places=3, max_digits=8, verbose_name='Вес (кг)')),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.shop', verbose_name='Магазин')),
            ],
        ),
        migrations.CreateModel(
            name='DeliveryType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=200, null=True, verbose_name='Название')),
                ('code', models.SlugField(verbose_name='Код типа доставки')),
                ('provider', models.CharField(choices=[('MANUAL', 'Самостоятельная доставка'), ('YANDEX', 'Яндекс.Доставка')], default='MANUAL', max_length=20, verbose_name='Тип провайдера')),
                ('type', models.CharField(choices=[('NO_TYPE', 'Нет типа'), ('POST', 'Почта'), ('COURIER', 'Курьер'), ('PICKUP', 'Пункт самовывоза')], default='NO_TYPE', max_length=20, verbose_name='Тип доставки')),
                ('extra', models.JSONField(blank=True, default=delivery.models.get_empty_dict, verbose_name='Дополнительная информация')),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.shop', verbose_name='Магазин')),
            ],
        ),
        migrations.AddField(
            model_name='delivery',
            name='package',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='delivery.package', verbose_name='Упаковка'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='recipient',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='delivery.recipient', verbose_name='Получатель'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='to',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='delivery.address', verbose_name='Адрес доставки'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='type',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='delivery.deliverytype', verbose_name='Тип доставки'),
        ),
        migrations.CreateModel(
            name='DeliveryProviderConfiguration',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('provider', models.CharField(choices=[('MANUAL', 'Самостоятельная доставка'), ('YANDEX', 'Яндекс.Доставка')], default='MANUAL', max_length=20, verbose_name='Тип провайдера')),
                ('config', models.JSONField(blank=True, default=delivery.models.get_empty_dict, verbose_name='Кофигурация')),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.shop', verbose_name='Магазин')),
            ],
            options={
                'unique_together': {('shop', 'provider')},
                'index_together': {('shop', 'provider')},
            },
        ),
    ]
