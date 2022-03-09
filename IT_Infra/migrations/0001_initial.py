# Generated by Django 3.2.6 on 2022-02-18 09:07

import IT_Infra.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import simple_history.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='it_allotment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_id', models.CharField(max_length=50)),
                ('employee_name', models.CharField(max_length=50)),
                ('office_365_Id', models.EmailField(blank=True, max_length=100, null=True)),
                ('official_email', models.EmailField(blank=True, max_length=50, null=True)),
                ('microsoft_email', models.EmailField(blank=True, max_length=50, null=True)),
                ('microsoft_email_password', models.CharField(blank=True, max_length=50, null=True)),
                ('skype_email', models.EmailField(blank=True, max_length=50, null=True)),
                ('skype_email_password', models.CharField(blank=True, max_length=50, null=True)),
                ('damage', models.CharField(blank=True, max_length=500, null=True)),
                ('remarks', models.CharField(blank=True, max_length=500, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='it_inventory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('details', models.CharField(max_length=500)),
                ('name', models.CharField(max_length=50)),
                ('purchase_type', models.CharField(max_length=100)),
                ('allottee_id', models.CharField(blank=True, max_length=50, null=True)),
                ('allotte_name', models.CharField(blank=True, max_length=50, null=True)),
                ('past_allottee_id', models.CharField(blank=True, max_length=50, null=True)),
                ('past_allottee_name', models.CharField(blank=True, max_length=50, null=True)),
                ('remarks', models.CharField(blank=True, max_length=500, null=True)),
                ('validity_start_date', models.DateField(blank=True, null=True)),
                ('validity_end_date', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='it_inventory_item',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='it_inventory_status',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(max_length=50)),
                ('status_id', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='it_inventory_type',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(max_length=50)),
                ('type_id', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='software_allotted_items',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_id', models.CharField(max_length=50)),
                ('employee_name', models.CharField(max_length=50)),
                ('details', models.CharField(max_length=500)),
                ('validity_start_date', models.DateField()),
                ('validity_end_date', models.DateField()),
                ('additional', models.CharField(blank=True, max_length=500, null=True)),
                ('allotment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_allotment')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_item')),
                ('item_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory')),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_status')),
            ],
        ),
        migrations.AddField(
            model_name='it_inventory_item',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_type'),
        ),
        migrations.AddField(
            model_name='it_inventory',
            name='item',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_item'),
        ),
        migrations.AddField(
            model_name='it_inventory',
            name='status',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_status'),
        ),
        migrations.AddField(
            model_name='it_inventory',
            name='type',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_type'),
        ),
        migrations.CreateModel(
            name='Historicalsoftware_allotted_items',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('employee_id', models.CharField(max_length=50)),
                ('employee_name', models.CharField(max_length=50)),
                ('details', models.CharField(max_length=500)),
                ('validity_start_date', models.DateField()),
                ('validity_end_date', models.DateField()),
                ('additional', models.CharField(blank=True, max_length=500, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('allotment', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_allotment')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_item')),
                ('item_name', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory')),
                ('status', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_status')),
            ],
            options={
                'verbose_name': 'historical software_allotted_items',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Historicalit_inventory',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('details', models.CharField(max_length=500)),
                ('name', models.CharField(max_length=50)),
                ('purchase_type', models.CharField(max_length=100)),
                ('allottee_id', models.CharField(blank=True, max_length=50, null=True)),
                ('allotte_name', models.CharField(blank=True, max_length=50, null=True)),
                ('past_allottee_id', models.CharField(blank=True, max_length=50, null=True)),
                ('past_allottee_name', models.CharField(blank=True, max_length=50, null=True)),
                ('remarks', models.CharField(blank=True, max_length=500, null=True)),
                ('validity_start_date', models.DateField(blank=True, null=True)),
                ('validity_end_date', models.DateField(blank=True, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_item')),
                ('status', models.ForeignKey(blank=True, db_constraint=False, default=2, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_status')),
                ('type', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_type')),
            ],
            options={
                'verbose_name': 'historical it_inventory',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Historicalit_allotment',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('employee_id', models.CharField(max_length=50)),
                ('employee_name', models.CharField(max_length=50)),
                ('office_365_Id', models.EmailField(blank=True, max_length=100, null=True)),
                ('official_email', models.EmailField(blank=True, max_length=50, null=True)),
                ('microsoft_email', models.EmailField(blank=True, max_length=50, null=True)),
                ('microsoft_email_password', models.CharField(blank=True, max_length=50, null=True)),
                ('skype_email', models.EmailField(blank=True, max_length=50, null=True)),
                ('skype_email_password', models.CharField(blank=True, max_length=50, null=True)),
                ('damage', models.CharField(blank=True, max_length=500, null=True)),
                ('remarks', models.CharField(blank=True, max_length=500, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'historical it_allotment',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='Historicalhardware_allotted_items',
            fields=[
                ('id', models.BigIntegerField(auto_created=True, blank=True, db_index=True, verbose_name='ID')),
                ('employee_id', models.CharField(max_length=50)),
                ('employee_name', models.CharField(max_length=50)),
                ('details', models.CharField(max_length=500)),
                ('additional', models.CharField(blank=True, max_length=500, null=True)),
                ('history_id', models.AutoField(primary_key=True, serialize=False)),
                ('history_date', models.DateTimeField()),
                ('history_change_reason', models.CharField(max_length=100, null=True)),
                ('history_type', models.CharField(choices=[('+', 'Created'), ('~', 'Changed'), ('-', 'Deleted')], max_length=1)),
                ('allotment', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_allotment')),
                ('history_user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='+', to=settings.AUTH_USER_MODEL)),
                ('item', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_item')),
                ('item_name', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory')),
                ('status', models.ForeignKey(blank=True, db_constraint=False, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='+', to='IT_Infra.it_inventory_status')),
            ],
            options={
                'verbose_name': 'historical hardware_allotted_items',
                'ordering': ('-history_date', '-history_id'),
                'get_latest_by': 'history_date',
            },
            bases=(simple_history.models.HistoricalChanges, models.Model),
        ),
        migrations.CreateModel(
            name='hardware_allotted_items',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('employee_id', models.CharField(max_length=50)),
                ('employee_name', models.CharField(max_length=50)),
                ('details', models.CharField(max_length=500)),
                ('additional', models.CharField(blank=True, max_length=500, null=True)),
                ('allotment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_allotment')),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_item')),
                ('item_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory')),
                ('status', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_inventory_status')),
            ],
        ),
        migrations.CreateModel(
            name='damage_images',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('images_for_damage', models.ImageField(blank=True, null=True, upload_to=IT_Infra.models.get_image_filename)),
                ('allotment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='IT_Infra.it_allotment')),
            ],
        ),
    ]