# Generated by Django 3.0.8 on 2020-07-19 13:08

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Shop',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(verbose_name='Слаг магазина')),
                ('name', models.CharField(max_length=200, verbose_name='Название магазина')),
            ],
        ),
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200, verbose_name='Название')),
                ('description', models.TextField(verbose_name='Описание')),
                ('price', models.PositiveIntegerField(verbose_name='Стоимость')),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shop.Shop', verbose_name='Магазин')),
            ],
        ),
    ]
