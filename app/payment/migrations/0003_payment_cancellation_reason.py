# Generated by Django 3.1 on 2020-08-17 14:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payment', '0002_auto_20200815_1929'),
    ]

    operations = [
        migrations.AddField(
            model_name='payment',
            name='cancellation_reason',
            field=models.CharField(max_length=40, null=True, verbose_name='Причина отмены'),
        ),
    ]