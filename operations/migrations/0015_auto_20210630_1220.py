# Generated by Django 3.2.4 on 2021-06-30 06:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('operations', '0014_merge_0012_auto_20210623_1605_0013_auto_20210622_1358'),
    ]

    operations = [
        migrations.AlterField(
            model_name='foodinventory',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
        migrations.CreateModel(
            name='recurringItems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('unit', models.CharField(max_length=50)),
                ('price', models.PositiveIntegerField()),
                ('discount', models.PositiveIntegerField(default=0)),
                ('amount', models.PositiveIntegerField(null=True)),
                ('paid_by', models.CharField(max_length=50)),
                ('purchase_date', models.DateField()),
                ('next_order_date', models.DateField()),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='operations.product_type')),
                ('type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='operations.item_types')),
            ],
        ),
    ]