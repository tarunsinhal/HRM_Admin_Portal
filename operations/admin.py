from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from import_export.widgets import ForeignKeyWidget
from import_export import resources, fields
from .models import Item_types, Product_type, recurringItems, Adhoc_types, AdhocItems, vendorContactList, repairServices, t_shirt_inventory, Detail_types, engagementJoining, officeEvents
from .serializers import ProductSerializer

class recurringResource(resources.ModelResource):
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(Item_types, 'type_name'))
    product = fields.Field(column_name='product', attribute='product', widget=ForeignKeyWidget(Product_type, 'product_name'))
    # def clean(self, value):
    #     val = super(ForeignKeyWidget, self).clean(value)
    #     object, created = Product_type.objects.get_or_create(product_name='')
    # product = fields.Field(column_name='new_product', attribute='new_product')
    class Meta:
        model = recurringItems
        

class recurringAdmin(ImportExportModelAdmin):
    resource_class = recurringResource
    serializer_class = ProductSerializer


admin.site.register(recurringItems, recurringAdmin)


class adhocResource(resources.ModelResource):
    # type = fields.Field()
    # # below code used for displaying value of key in export csv file
    # type = fields.Field(
    #     attribute='get_type_display',
    #     column_name='Type'
    # )
    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(Adhoc_types, 'type_name'))
    class Meta:
        model = AdhocItems


class adhocAdmin(ImportExportModelAdmin):
    resource_class = adhocResource

admin.site.register(AdhocItems, adhocAdmin)


class joiningResource(resources.ModelResource):
    details = fields.Field(column_name='details', attribute='details', widget=ForeignKeyWidget(Detail_types, 'type_name'))
    class Meta:
        model = engagementJoining

class joiningAdmin(ImportExportModelAdmin):
    resource_class = joiningResource

admin.site.register(engagementJoining, joiningAdmin)

class vendorResource(resources.ModelResource):
    class Meta:
        model = vendorContactList

class vendorAdmin(ImportExportModelAdmin):
    resource_class = vendorResource

admin.site.register(vendorContactList, vendorAdmin)

class repairServiceResource(resources.ModelResource):
    service_of = fields.Field(column_name='service_of', attribute='service_of', widget=ForeignKeyWidget(vendorContactList, 'service'))
    class Meta:
        model = repairServices

class repairServiceAdmin(ImportExportModelAdmin):
    resource_class = repairServiceResource

admin.site.register(repairServices, repairServiceAdmin)


class TshirtResource(resources.ModelResource):
    class Meta:
        model = t_shirt_inventory

class TshirtAdmin(ImportExportModelAdmin):
    resource_class = TshirtResource

admin.site.register(t_shirt_inventory, TshirtAdmin)


class officeEventsResource(resources.ModelResource):
    class Meta:
        model = officeEvents

class officeEventsAdmin(ImportExportModelAdmin):
    resource_class = officeEventsResource

admin.site.register(officeEvents, officeEventsAdmin)


# @admin.register(engagementJoining)
# class joiningAdmin(ImportExportModelAdmin):
#     list_display = ('employee_name', 'details', 'loi', 'offer_letter', 'nda_signed', 'joining_letter', 'joining_documents', 'joining_hamper', 'relieving_letter', 'experience_letter', 'laptop_charger', 'mouse_mousePad', 'bag', 'id_card', 'induction', 'add_to_skype_group', 'add_to_whatsapp_group', 'remove_from_skype_group', 'remove_from_whatsapp_group', 'grant_onedrive_access', 'onedrive_access', 'microsoft_account_created', 'microsoft_account_deleted', 'gmail_account', 'skype_id', 'system_configration', 'system_format', 'email_account', 'upwork_account_Add_to_team', 'upwork_account_Add_account', 'upwork_account_Remove_from_team', 'upwork_account_Close_account')


admin.site.register(Item_types)
admin.site.register(Product_type)
admin.site.register(Adhoc_types)
admin.site.register(Detail_types)
# admin.site.register(recurringItems)
# admin.site.register(AdhocItems)
# admin.site.register(vendorContactList)
# admin.site.register(repairServices)

