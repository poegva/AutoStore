# Generated by Django 3.1 on 2020-08-29 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0017_shop_yandex_pickup_deadline'),
    ]

    operations = [
        migrations.AddField(
            model_name='shop',
            name='yandex_direct_addcost',
            field=models.PositiveIntegerField(blank=True, default=0, verbose_name='Доп'),
        ),
        migrations.AlterField(
            model_name='order',
            name='delivery_type',
            field=models.CharField(choices=[('NONE', 'Не выбрано'), ('COURIER', 'Курьер'), ('DIRECT_COURIER', 'Прямой курьер'), ('POST', 'Почта')], default='NONE', max_length=20, verbose_name='Способ доставки'),
        ),
        migrations.AlterField(
            model_name='shop',
            name='yandex_pickup_deadline',
            field=models.TimeField(blank=True, default='21:00', verbose_name='Дедлайн для отгрузки в текущий день'),
        ),
    ]