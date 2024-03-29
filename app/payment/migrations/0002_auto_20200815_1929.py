# Generated by Django 3.1 on 2020-08-15 19:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='payment',
            name='status',
            field=models.CharField(choices=[('pending', 'Ожидает оплаты'), ('waiting_for_capture', 'Оплачен, ожидает подтверждения'), ('succeeded', 'Оплачен и подтвержден'), ('cancelled', 'Отменен')], db_index=True, max_length=20, verbose_name='Статус платежа'),
        ),
    ]
