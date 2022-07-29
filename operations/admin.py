"""
This file contains the Administration configuration for the operations app.
"""
from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export.widgets import ForeignKeyWidget
from import_export import resources, fields
from .models import Item_types, Product_type, recurringItems, Adhoc_types, AdhocItems
from .models import vendorContactList, repairServices, t_shirt_inventory
from .models import Detail_types, engagementJoining, officeEvents
from .serializers import ProductSerializer

class recurringResource(resources.ModelResource):
    """
    This class is used to create resource of recurringItems.
    """
    type = fields.Field(column_name='type', attribute='type',
           widget=ForeignKeyWidget(Item_types, 'type_name'))
    product = fields.Field(column_name='product', attribute='product',
              widget=ForeignKeyWidget(Product_type, 'product_name'))
    class Meta:
        """This class is used to create a meta class for the recurringResource"""
        model = recurringItems

class recurringAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for recurringResource
    in the admin panel.
    """
    resource_class = recurringResource
    serializer_class = ProductSerializer

# register the recurringItems and recurringAdmin functionality in the admin panel
admin.site.register(recurringItems, recurringAdmin)

class adhocResource(resources.ModelResource):
    """
    This class is used to create resource of AdhocItems.
    """
    type = fields.Field(column_name='type', attribute='type',
           widget=ForeignKeyWidget(Adhoc_types, 'item_name'))
    class Meta:
        """This class is used to create a meta class for the adhocResource"""
        model = AdhocItems

class adhocAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for adhocResource
    in the admin panel.
    """
    resource_class = adhocResource

# register the AdhocItems and adhocAdmin functionality in the admin panel
admin.site.register(AdhocItems, adhocAdmin)

class joiningResource(resources.ModelResource):
    """
    This class is used to create resource of engagementJoining.
    """
    details = fields.Field(column_name='details', attribute='details',
              widget=ForeignKeyWidget(Detail_types, 'detail_name'))
    class Meta:
        """This class is used to create a meta class for the joiningResource"""
        model = engagementJoining

class joiningAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for joiningResource
    in the admin panel.
    """
    resource_class = joiningResource

# register the engagementJoining and joiningAdmin functionality in the admin panel
admin.site.register(engagementJoining, joiningAdmin)

class vendorResource(resources.ModelResource):
    """
    This class is used to create resource of vendorContactList.
    """
    class Meta:
        """This class is used to create a meta class for the vendorResource"""
        model = vendorContactList

class vendorAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for vendorResource
    in the admin panel.
    """
    resource_class = vendorResource

# register the vendorContactList and vendorAdmin functionality in the admin panel
admin.site.register(vendorContactList, vendorAdmin)

class repairServiceResource(resources.ModelResource):
    """
    This class is used to create resource of repairServices.
    """
    service_of = fields.Field(column_name='service_of', attribute='service_of',
                 widget=ForeignKeyWidget(vendorContactList, 'service'))
    class Meta:
        """This class is used to create a meta class for the repairServiceResource"""
        model = repairServices

class repairServiceAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for repairServiceResource
    in the admin panel.
    """
    resource_class = repairServiceResource

# register the repairServices and repairServiceAdmin functionality in the admin panel
admin.site.register(repairServices, repairServiceAdmin)

class TshirtResource(resources.ModelResource):
    """
    This class is used to create resource of t_shirt_inventory.
    """
    class Meta:
        """This class is used to create a meta class for the TshirtResource"""
        model = t_shirt_inventory

class TshirtAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for TshirtResource
    in the admin panel.
    """
    resource_class = TshirtResource

# register the t_shirt_inventory and TshirtAdmin functionality in the admin panel
admin.site.register(t_shirt_inventory, TshirtAdmin)

class officeEventsResource(resources.ModelResource):
    """
    This class is used to create resource of officeEvents.
    """
    class Meta:
        """This class is used to create a meta class for the officeEventsResource"""
        model = officeEvents

class officeEventsAdmin(ImportExportModelAdmin):
    """
    This class used to implementing Import & Export functionality for officeEventsResource
    in the admin panel.
    """
    resource_class = officeEventsResource

# register the officeEvents and officeEventsAdmin functionality in the admin panel
admin.site.register(officeEvents, officeEventsAdmin)

# register the Item_types, Product_type, Adhoc_types and Deatils_types in the admin panel
admin.site.register(Item_types)
admin.site.register(Product_type)
admin.site.register(Adhoc_types)
admin.site.register(Detail_types)
