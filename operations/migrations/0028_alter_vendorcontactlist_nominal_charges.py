# Generated by Django 3.2.4 on 2021-08-18 05:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('operations', '0027_alter_vendorcontactlist_nominal_charges'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vendorcontactlist',
            name='nominal_charges',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
