# Generated by Django 3.1 on 2020-09-12 08:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0024_auto_20200912_0817'),
        ('delivery', '0007_auto_20200911_2104'),
    ]

    operations = [
        migrations.AlterField(
            model_name='delivery',
            name='order',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='shop.order', verbose_name='Заказ'),
        ),
    ]
