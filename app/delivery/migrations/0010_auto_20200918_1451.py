# Generated by Django 3.1 on 2020-09-18 14:51

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('delivery', '0009_auto_20200914_0904'),
    ]

    operations = [
        migrations.RenameField(
            model_name='shipment',
            old_name='external_target_id',
            new_name='destination_id',
        ),
    ]
