# Generated by Django 3.2.4 on 2021-07-26 12:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('operations', '0018_auto_20210726_1637'),
    ]

    operations = [
        migrations.RenameField(
            model_name='vendorcontactlist',
            old_name='alternate_contact_no',
            new_name='alternate_no',
        ),
    ]
