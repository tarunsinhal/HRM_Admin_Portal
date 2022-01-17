from collections import defaultdict

from django.core.exceptions import ValidationError
from import_export import widgets,fields,resources
from .models import Item_types, Product_type, recurringItems, t_shirt_inventory, Adhoc_types, AdhocItems, vendorContactList, repairServices, officeEvents, Detail_types, engagementJoining, officeEvents 
from import_export.widgets import ForeignKeyWidget, CharWidget

class CharRequiredWidget(widgets.CharWidget):
    def clean(self, value, row=None, *args, **kwargs):
        val = super().clean(value)
        if val:
            return val
        else:
            raise ValueError("This field is required")

class RecurringResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(Item_types, 'type_name'))
    product = fields.Field(column_name='product', attribute='product', widget=ForeignKeyWidget(Product_type, 'product_name'))
    quantity = fields.Field(saves_null_values=False, column_name='quantity', attribute='quantity', widget=CharRequiredWidget())
    unit = fields.Field(saves_null_values=False, column_name='unit', attribute='unit', widget=CharRequiredWidget())
    amount = fields.Field(saves_null_values=False, column_name='amount', attribute='amount', widget=CharRequiredWidget())
    paid_by = fields.Field(saves_null_values=False, column_name='paid_by', attribute='paid_by', widget=CharRequiredWidget())
    purchase_date = fields.Field(saves_null_values=False, column_name='purchase_date', attribute='purchase_date', widget=CharRequiredWidget())
    
    class Meta:
        model = recurringItems
        clean_model_instances=True

class AdhocResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    type = fields.Field(column_name='type', attribute='type', widget=ForeignKeyWidget(Adhoc_types, 'type_name'))
    product = fields.Field(saves_null_values=False, column_name='product', attribute='product', widget=CharRequiredWidget())
    quantity = fields.Field(saves_null_values=False, column_name='quantity', attribute='quantity', widget=CharRequiredWidget())
    amount = fields.Field(saves_null_values=False, column_name='amount', attribute='amount', widget=CharRequiredWidget())
    paid_by = fields.Field(saves_null_values=False, column_name='paid_by', attribute='paid_by', widget=CharRequiredWidget())
    purchase_date = fields.Field(saves_null_values=False, column_name='purchase_date', attribute='purchase_date', widget=CharRequiredWidget())
    class Meta:
        model = AdhocItems
        clean_model_instances=True

class JoiningResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    details = fields.Field(column_name='details', attribute='details', widget=ForeignKeyWidget(Detail_types, 'type_name'))
    # employee_name = fields.Field(saves_null_values=False, column_name='employee_name', attribute='employee_name', widget=CharRequiredWidget())
    # email_account = fields.Field(saves_null_values=False, column_name='email_account', attribute='email_account', widget=CharRequiredWidget())
    # # upwork_account_remove_from_team = fields.Field(saves_null_values=True, column_name='upwork_account_remove_from_team', attribute='upwork_account_remove_from_team')
    # # upwork_account_close_account = fields.Field(saves_null_values=True, column_name='upwork_account_close_account', attribute='upwork_account_close_account')
    # loi = fields.Field(saves_null_values=False, column_name='loi', attribute='loi', widget=CharRequiredWidget())
    # offer_letter = fields.Field(saves_null_values=False, column_name='offer_letter', attribute='offer_letter', widget=CharRequiredWidget())
    # nda_signed = fields.Field(saves_null_values=False, column_name='nda_signed', attribute='nda_signed', widget=CharRequiredWidget())
    # joining_letter = fields.Field(saves_null_values=False, column_name='joining_letter', attribute='joining_letter', widget=CharRequiredWidget())
    # joining_hamper = fields.Field(saves_null_values=False, column_name='joining_hamper', attribute='joining_hamper', widget=CharRequiredWidget())
    # # relieving_letter = fields.Field(saves_null_values=True, column_name='relieving_letter', attribute='relieving_letter')
    # # experience_letter = fields.Field(saves_null_values=True, column_name='experience_letter', attribute='experience_letter')
    # laptop_charger = fields.Field(saves_null_values=False, column_name='laptop_charger', attribute='laptop_charger', widget=CharRequiredWidget())
    # mouse_mousepad = fields.Field(saves_null_values=False, column_name='mouse_mousepad', attribute='mouse_mousepad', widget=CharRequiredWidget())
    # bag = fields.Field(saves_null_values=False, column_name='bag', attribute='bag', widget=CharRequiredWidget())
    # induction = fields.Field(saves_null_values=False, column_name='induction', attribute='induction', widget=CharRequiredWidget())
    # add_to_skype_group = fields.Field(saves_null_values=False, column_name='add_to_skype_group', attribute='add_to_skype_group', widget=CharRequiredWidget())
    # add_to_whatsapp_group = fields.Field(saves_null_values=False, column_name='add_to_whatsapp_group', attribute='add_to_whatsapp_group', widget=CharRequiredWidget())
    # # remove_from_skype_group = fields.Field(saves_null_values=True, column_name='remove_from_skype_group', attribute='remove_from_skype_group')
    # # remove_from_whatsapp_group = fields.Field(saves_null_values=True, column_name='remove_from_whatsapp_group', attribute='remove_from_whatsapp_group')
    # onedrive_access = fields.Field(saves_null_values=False, column_name='onedrive_access', attribute='onedrive_access', widget=CharRequiredWidget())
    # microsoft_account_created = fields.Field(saves_null_values=False, column_name='microsoft_account_created', attribute='microsoft_account_created', widget=CharRequiredWidget())
    # # microsoft_account_deleted = fields.Field(saves_null_values=True, column_name='microsoft_account_deleted', attribute='microsoft_account_deleted')
    # gmail_account = fields.Field(saves_null_values=False, column_name='gmail_account', attribute='gmail_account', widget=CharRequiredWidget())
    # skype_id = fields.Field(saves_null_values=False, column_name='skype_id', attribute='skype_id', widget=CharRequiredWidget())
    # system_configuration = fields.Field(saves_null_values=False, column_name='system_configuration', attribute='system_configuration', widget=CharRequiredWidget())
    class Meta:
        model = engagementJoining
        clean_model_instances=True
        fields = ('id', 'employee_name', 'details', 'loi', 'offer_letter', 'nda_signed', 'joining_letter', 'joining_documents', 'joining_hamper', 'laptop_charger', 'mouse_mousepad', 'bag', 'id_card', 'induction', 'add_to_skype_group', 'add_to_whatsapp_group', 'onedrive_access', 'microsoft_account_created', 'gmail_account', 'skype_id', 'system_configuration', 'email_account', 'upwork_account_add_to_team', 'upwork_account_add_account')
        

class ExitResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    details = fields.Field(column_name='details', attribute='details', widget=ForeignKeyWidget(Detail_types, 'type_name'))
    employee_name = fields.Field(saves_null_values=False, column_name='employee_name', attribute='employee_name', widget=CharRequiredWidget())
    email_account = fields.Field(saves_null_values=False, column_name='email_account', attribute='email_account', widget=CharRequiredWidget())
    upwork_account_remove_from_team = fields.Field(saves_null_values=False, column_name='upwork_account_remove_from_team', attribute='upwork_account_remove_from_team', widget=CharRequiredWidget())
    upwork_account_close_account = fields.Field(saves_null_values=False, column_name='upwork_account_close_account', attribute='upwork_account_close_account', widget=CharRequiredWidget())
    nda_signed = fields.Field(saves_null_values=False, column_name='nda_signed', attribute='nda_signed', widget=CharRequiredWidget())
    relieving_letter = fields.Field(saves_null_values=False, column_name='relieving_letter', attribute='relieving_letter', widget=CharRequiredWidget())
    experience_letter = fields.Field(saves_null_values=False, column_name='experience_letter', attribute='experience_letter', widget=CharRequiredWidget())
    laptop_charger = fields.Field(saves_null_values=False, column_name='laptop_charger', attribute='laptop_charger', widget=CharRequiredWidget())
    mouse_mousepad = fields.Field(saves_null_values=False, column_name='mouse_mousepad', attribute='mouse_mousepad', widget=CharRequiredWidget())
    bag = fields.Field(saves_null_values=False, column_name='bag', attribute='bag', widget=CharRequiredWidget())
    id_card = fields.Field(saves_null_values=False, column_name='id_card', attribute='id_card', widget=CharRequiredWidget())
    remove_from_skype_group = fields.Field(saves_null_values=False, column_name='remove_from_skype_group', attribute='remove_from_skype_group', widget=CharRequiredWidget())
    remove_from_whatsapp_group = fields.Field(saves_null_values=False, column_name='remove_from_whatsapp_group', attribute='remove_from_whatsapp_group', widget=CharRequiredWidget())
    onedrive_access = fields.Field(saves_null_values=False, column_name='onedrive_access', attribute='onedrive_access', widget=CharRequiredWidget())
    microsoft_account_deleted = fields.Field(saves_null_values=False, column_name='microsoft_account_deleted', attribute='microsoft_account_deleted', widget=CharRequiredWidget())
    gmail_account = fields.Field(saves_null_values=False, column_name='gmail_account', attribute='gmail_account', widget=CharRequiredWidget())
    skype_id = fields.Field(saves_null_values=False, column_name='skype_id', attribute='skype_id', widget=CharRequiredWidget())
    class Meta:
        model = engagementJoining
        fields = ('employee_name', 'details', 'nda_signed', 'relieving_letter', 'experience_letter', 'laptop_charger', 'mouse_mousepad', 'bag', 'id_card', 'remove_from_skype_group', 'remove_from_whatsapp_group', 'onedrive_access', 'microsoft_account_deleted', 'gmail_account', 'skype_id', 'system_format', 'email_account', 'upwork_account_remove_from_team', 'upwork_account_close_account')
        clean_model_instances=True

class VendorResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    def before_import_row(self, row, row_number=None, **kwargs):
        self.vendor_name = row["vendor_name"]
        self.service = row["service"]
        query = vendorContactList.objects.filter(vendor_name=self.vendor_name, service=self.service).values('vendor_name')
        if query:
            raise ValidationError({'Vendor Name':'Vendor Name already exist.'})


    service = fields.Field(saves_null_values=False, column_name='service', attribute='service', widget=CharRequiredWidget())
    vendor_name = fields.Field(saves_null_values=False, column_name='vendor_name', attribute='vendor_name', widget=CharRequiredWidget())
    contact_no = fields.Field(saves_null_values=False, column_name='contact_no', attribute='contact_no', widget=CharRequiredWidget())
    class Meta:
        model = vendorContactList
        clean_model_instances=True

class TshirtResource(resources.ModelResource):
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    def before_import_row(self, row, row_number=None, **kwargs):
        self.order_date = row["order_date"]
        self.size = row["size"]
        datedata = t_shirt_inventory.objects.filter(order_date=self.order_date, size=self.size).values_list('order_date')
        if datedata:
            raise ValidationError({'Order Date':'Order date already exist.'})

    order_date = fields.Field(saves_null_values=False, column_name='order_date', attribute='order_date', widget=CharRequiredWidget())
    size = fields.Field(saves_null_values=False, column_name='size', attribute='size', widget=CharRequiredWidget())
    previous_stock = fields.Field(saves_null_values=False, column_name='previous_stock', attribute='previous_stock', widget=CharRequiredWidget())
    ordered_quantity = fields.Field(saves_null_values=False, column_name='ordered_quantity', attribute='ordered_quantity', widget=CharRequiredWidget())
    received_quantity = fields.Field(saves_null_values=False, column_name='received_quantity', attribute='received_quantity', widget=CharRequiredWidget())
    total_quantity = fields.Field(saves_null_values=False, column_name='total_quantity', attribute='total_quantity', widget=CharRequiredWidget())
    allotted = fields.Field(saves_null_values=False, column_name='allotted', attribute='allotted', widget=CharRequiredWidget())
    remaining = fields.Field(saves_null_values=False, column_name='remaining', attribute='remaining', widget=CharRequiredWidget())
    paid_by = fields.Field(saves_null_values=False, column_name='paid_by', attribute='paid_by', widget=CharRequiredWidget())
    user_name = fields.Field(saves_null_values=False, column_name='user_name', attribute='user_name', widget=CharRequiredWidget())

    class Meta:
        model = t_shirt_inventory
        clean_model_instances=True

class officeEventsResource(resources.ModelResource):
    date = fields.Field(saves_null_values=False, column_name='date', attribute='date', widget=CharRequiredWidget())
    event_name = fields.Field(saves_null_values=False, column_name='event_name', attribute='event_name', widget=CharRequiredWidget())
        
    class Meta:
        model = officeEvents
        clean_model_instances=True
    
    

