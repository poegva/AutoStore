# Generated by Django 3.1 on 2020-08-26 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0013_order_shop'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='delivery_tariff',
            field=models.IntegerField(blank=True, null=True, verbose_name='Тариф доставки'),
        ),
    ]
