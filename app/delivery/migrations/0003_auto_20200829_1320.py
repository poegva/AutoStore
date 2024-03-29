# Generated by Django 3.1 on 2020-08-29 13:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0002_auto_20200827_1720'),
    ]

    operations = [
        migrations.AddField(
            model_name='delivery',
            name='label',
            field=models.FileField(blank=True, null=True, upload_to='labels', verbose_name='Ярлык'),
        ),
        migrations.AddField(
            model_name='delivery',
            name='shipment_partner',
            field=models.BigIntegerField(blank=True, db_index=True, null=True, verbose_name='Партнер отгрузки'),
        ),
        migrations.AlterField(
            model_name='delivery',
            name='status',
            field=models.CharField(choices=[('REQUESTED', 'Запрошена'), ('DRAFT', 'Черновик'), ('SUBMITED', 'Оформлена'), ('APPROVED', 'Подтверждена'), ('IN_DELIVERY', 'В доставке у провайдера'), ('COMPLETED', 'Выполнена'), ('ERROR', 'Ошибка')], db_index=True, default='REQUESTED', max_length=25, verbose_name='Статус доставки'),
        ),
    ]
