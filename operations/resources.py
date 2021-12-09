from import_export import widgets,fields,resources
from .models import Item_types, Product_type, recurringItems, t_shirt_inventory, Adhoc_types, AdhocItems, vendorContactList, repairServices, officeEvents, Detail_types, engagementJoining, officeEvents 
from import_export.widgets import ForeignKeyWidget

class RecurringResource(resources.ModelResource):
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(Item_types, 'type_name'))
    product = fields.Field(column_name='product', attribute='product', widget=ForeignKeyWidget(Product_type, 'product_name'))
    class Meta:
        model = recurringItems

class AdhocResource(resources.ModelResource):
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(Adhoc_types, 'type_name'))
    class Meta:
        model = AdhocItems

class JoiningResource(resources.ModelResource):
    details = fields.Field(column_name='details', attribute='details', widget=ForeignKeyWidget(Detail_types, 'type_name'))
    class Meta:
        model = engagementJoining

class VendorResource(resources.ModelResource):
    class Meta:
        model = vendorContactList

class TshirtResource(resources.ModelResource):
    class Meta:
        model = t_shirt_inventory

class officeEventsResource(resources.ModelResource):
    class Meta:
        model = officeEvents
    
    

    