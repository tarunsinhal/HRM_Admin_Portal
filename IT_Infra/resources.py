from import_export import widgets,fields,resources
from .models import it_inventory, it_inventory_type, it_inventory_item, it_inventory_status
from import_export.widgets import ForeignKeyWidget
from django.core.exceptions import ValidationError


class itHardwareInventoryResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]
        dataset.headers.append('type')
        dataset.headers.remove('validity_start_date')
        dataset.headers.remove('validity_end_date')

    def before_import_row(self, row, row_number=None, **kwargs):
        query = it_inventory.objects.filter(name=row["item_name"]).values('name')
        if query:
            raise ValidationError({'Item Name':'Item Name already exist.'})
        row['type'] = '1'
        return row

    item = fields.Field(column_name='item', attribute='item', widget=ForeignKeyWidget(it_inventory_item, 'item'))
    status = fields.Field(column_name='status', attribute='status', widget=ForeignKeyWidget(it_inventory_status, 'status'))
    name = fields.Field(column_name='item_name', attribute='name')

    class Meta:
        model = it_inventory
        clean_model_instances=True


class itSoftwareInventoryResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]
        dataset.headers.append('type')

    def before_import_row(self, row, row_number=None, **kwargs):
        query = it_inventory.objects.filter(name=row["item_name"]).values('name')
        if query:
            raise ValidationError({'Item Name':'Item Name already exist.'})
        row['type'] = '2'
        return row

    item = fields.Field(column_name='item', attribute='item', widget=ForeignKeyWidget(it_inventory_item, 'item'))
    status = fields.Field(column_name='status', attribute='status', widget=ForeignKeyWidget(it_inventory_status, 'status'))
    name = fields.Field(column_name='item_name', attribute='name')

    class Meta:
        model = it_inventory
        clean_model_instances=True
