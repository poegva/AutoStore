# Generated by Django 3.1 on 2020-08-10 00:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_auto_20200808_2258'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='token',
            field=models.CharField(default='NO_TOKEN', max_length=32, verbose_name='Токен доступа к заказу'),
        ),
    ]
