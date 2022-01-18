from datetime import date
from itertools import chain
from django.db.models import fields
from django.forms import forms, ModelForm, TextInput, MultiWidget,  CharField, IntegerField, ChoiceField, MultiValueField, RegexField, ComboField
from django.forms.widgets import DateInput, HiddenInput, NumberInput, Select, SelectMultiple, Widget, Textarea, RadioSelect
from rest_framework import serializers
from .models import Product_type, recurringItems, t_shirt_inventory, AdhocItems, vendorContactList, repairServices, engagementJoining, officeEvents
from django.contrib.auth.models import User
from django import forms
from django.core.validators import FileExtensionValidator

choices = [(True, 'Yes'), (False, 'No')]
payment_mode_choices = [('cash', 'Cash'), ('digital', 'Digital'), ('company_account', 'Company_Account'), ('others', 'Others')]
unit_choices = [('Gm', 'gram'), ('Kg', 'kilogram'), ('No.s', 'number'), ('Dozen', 'dozen'), ('Liter', 'liter'), ('Ml', 'mililiter'), ('Cm', 'centimeter'), ('M', 'meter')]
quantity_adhoc_choices = [('Set', 'set'),('Gm', 'gram'), ('Kg', 'kilogram'), ('No.s', 'number'), ('Dozen', 'dozen'), ('Liter', 'liter'), ('Ml', 'mililiter'), ('Cm', 'centimeter'), ('M', 'meter')]


class UnitWidget(MultiWidget):
    def __init__(self, *args, **kwargs):
        self.widgets = [NumberInput({'type': 'number', 'class': "required form-control"}), Select(choices=unit_choices, attrs={'type': 'select', 'class': "form-select"})]
        super(UnitWidget, self).__init__(self.widgets, *args, **kwargs)

    def decompress(self, value):
        if value:
            return value.split(' ')
        return [None, None]


class UnitField(MultiValueField):
    widget = UnitWidget

    def __init__(self, *args, **kwargs):
        fields = (IntegerField(), ChoiceField(choices=unit_choices))
        super(UnitField, self).__init__(fields, *args, **kwargs)

    def compress(self, data_list):
        return ' '.join(data_list)


class AddProducts(ModelForm):
    new_product = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter product"}))
    add_name = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))
    unit = UnitField()

    class Meta:
        model = recurringItems
        fields = ('frequency', 'type', 'product', 'new_product', 'quantity', 'unit', 'price', 'discount', 'amount', 'paid_by', 'add_name', 'purchase_date', 'next_order_date', 'additional_info')
        widgets = {
            'frequency': Select(attrs={'type':'text', 'class':"required form-select"}),
            'type': Select(attrs={'type':'text', 'class':"required form-select"}),
            'product': Select(attrs={'type':'text', 'class':"required form-select"}),
            'quantity': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'price': NumberInput(attrs={'type':'number', 'class':"form-control", "aria-describedby":"inputGroupPrepend"}),
            'discount': NumberInput(attrs={'type':'number', 'class':"form-control", "aria-describedby":"inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'paid_by': Select(attrs={'type':'select', 'class':"required form-select", 'required':True}),
            'purchase_date': DateInput(attrs={'type':'date', 'class':"required form-control"}),
            'next_order_date': DateInput(attrs={'type':'date', 'class':"form-control"}),
            'additional_info': Textarea(attrs={'type':'textarea', 'class':"form-control"})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()

    def clean_content(self):
        last_order_date = self.cleaned_data.get("purchase_date")
        expected_order_date = self.cleaned_data.get("next_order_date")
        if expected_order_date < last_order_date:
            raise forms.ValidationError("Expected Date is less than last Order date")
        return last_order_date, expected_order_date


class EditProducts(AddProducts, ModelForm):
    add_name = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))
    class Meta(AddProducts.Meta):
        fields = ['frequency', 'product', 'new_product', 'quantity', 'unit', 'price', 'discount', 'amount', 'paid_by', 'add_name', 'purchase_date', 'next_order_date', 'additional_info']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()


class QuantityWidgetAdhoc(MultiWidget):
    def __init__(self, *args, **kwargs):
        self.widgets = [NumberInput({'type': 'number', 'class': "required form-control chk"}), Select(choices=quantity_adhoc_choices, attrs={'type': 'select', 'class': "form-select chk"})]
        super(QuantityWidgetAdhoc, self).__init__(self.widgets, *args, **kwargs)

    def decompress(self, value):
        if value:
            return value.split(' ')
        return [None, None]


class QuantityFieldAdhoc(MultiValueField):
    widget = QuantityWidgetAdhoc

    def __init__(self, *args, **kwargs):
        fields = (IntegerField(), ChoiceField(choices=quantity_adhoc_choices))
        super(QuantityFieldAdhoc, self).__init__(fields, *args, **kwargs)

    def compress(self, data_list):
        return ' '.join(data_list)


class AddAdhocItemsForm(ModelForm):
    add_name = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))
    quantity = QuantityFieldAdhoc()

    class Meta:
        model = AdhocItems
        fields = ('type', 'product', 'quantity', 'price', 'amount', 'advance_pay', 'balance_amount', 'paid_by', 'add_name', 'purchase_date', 'received_date', 'additional_info')
    
        widgets = {
            'type': Select(attrs={'type': 'text', 'class': "required form-select chk"}),
            'product': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'price': NumberInput(attrs={'type': 'number', 'class': "required form-control chk", "aria-describedby": "inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type': 'number', 'class': "required form-control chk"}),
            'advance_pay': NumberInput(attrs={'type': 'number', 'class': "required form-control chk"}),
            'balance_amount': NumberInput(attrs={'type': 'number', 'class': "required form-control chk"}),
            'paid_by': Select(attrs={'type': 'text', 'class': "required form-select chk"}),
            'purchase_date': DateInput(attrs={'type': 'date', 'class': "required form-control chk"}),
            'received_date': DateInput(attrs={'type': 'date', 'class': "form-control chk"}),
            'additional_info': Textarea(attrs={'type': 'text', 'class': "form-control chk"}), }

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     paid_by_dropdown = self.fields['paid_by']
    #     # paid_by.choices = list(paid_by.choices)
    #     paid_by_dropdown.append(tuple(('Other', 'Other')))


class EditAdhocItemsForm(AddAdhocItemsForm, ModelForm):
   
    class Meta(AddAdhocItemsForm.Meta):
        fields = ['purchase_date', 'received_date', 'product', 'quantity', 'price', 'amount', 'advance_pay', 'balance_amount', 'paid_by', 'add_name', 'additional_info']

    def __init__(self, *args, **kwargs):
        super(EditAdhocItemsForm, self).__init__(*args, **kwargs)
        super().__init__()
        self.fields['advance_pay'].widget.attrs['readonly'] = True


class AddVendorForm(ModelForm):
    class Meta:
        model = vendorContactList
        fields = '__all__'
        widgets = {
            'service': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'vendor_name': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'contact_no': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'alternate_no': TextInput(attrs={'type': 'text', 'class': "form-control chk"}),
            'nominal_charges': NumberInput(attrs={'type': 'number', 'class': "form-control chk", "aria-describedby": "inputGroupPrepend"}),
            'aditional_info': Textarea(attrs={'type': 'textarea', 'class': "form-control chk"})
        }


class EditVendorForm(AddVendorForm, ModelForm):
    class Meta(AddVendorForm.Meta):
        fields = '__all__'


class AddRepairServicesForm(ModelForm):
    add_name = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))
    class Meta:
        model = repairServices
        fields = ('service_date', 'service_of', 'service_type', 'charges', 'vendor_name', 'contact_no', 'paid_by', 'add_name', 'payment_mode', 'next_service_date', 'aditional_info')
        widgets = {
            'service_date': TextInput(attrs={'type': 'date', 'class': "required form-control"}),
            'service_of': Select(attrs={'type': 'text', 'class': "required form-select", 'options_value': ''}),
            'service_type': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'charges': NumberInput(attrs={'type': 'number', 'class': "required form-control", "aria-describedby": "inputGroupPrepend"}),
            'vendor_name': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'contact_no': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'paid_by': Select(attrs={'type': 'select', 'class': "required form-select"}),
            'payment_mode': Select(choices=payment_mode_choices, attrs={'type': 'select', 'class': "required form-select"}),
            'next_service_date': TextInput(attrs={'type': 'date', 'class': "required form-control"}),
            'aditional_info': Textarea(attrs={'type': 'textarea', 'class': "form-control"})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['service_of'].queryset = vendorContactList.objects.values('service').distinct()
        self.fields['service_of'].queryset = vendorContactList.objects.values_list('service', flat=True).distinct()
        self.fields['vendor_name'].queryset = vendorContactList.objects.none()


class EditRepairServicesForm(AddRepairServicesForm, ModelForm):
    class Meta(AddRepairServicesForm.Meta):
        fields = ['service_date', 'service_of', 'service_type', 'charges', 'vendor_name', 'contact_no', 'paid_by', 'add_name', 'payment_mode', 'next_service_date', 'aditional_info']


class addTshirtForm(ModelForm):
    add_name = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))
    class Meta:
        model = t_shirt_inventory
        fields = ('id', 'order_date', 'receiving_date', 'size', 'previous_stock', 'ordered_quantity', 'received_quantity', 'error_message', 'allotted', 'paid_by', 'add_name', 'additional')
        widgets = {
            'order_date': DateInput(attrs={'type':'date', 'required':True,  'class':"required form-control"}),
            'receiving_date': DateInput(attrs={'type':'date', 'class':"required form-control"}),
            'size': Select(attrs={'type':'text', 'required':True, 'class':"form-control"}),
            'previous_stock': NumberInput(attrs={'type':'number', 'required':True, 'readOnly': True, 'class':"required form-control"}),
            'ordered_quantity': NumberInput(attrs={'type':'number', 'required':True, 'class':"required form-control"}),
            'received_quantity': NumberInput(attrs={'type':'number', 'required':True, 'class':"required form-control"}),
            'allotted': NumberInput(attrs={'type':'number', 'required':True, 'class':"required form-control"}),
            'paid_by': Select(attrs={'type':'text', 'required':True, 'spellcheck': 'true', 'class':"required form-select"}),
            'additional': Textarea(attrs={'type':'text', 'class':"required form-control"}),
            'error_message': Textarea(attrs={'type':'text', 'class':"required form-control", "rows": 1, "cols": 1}),
            'total_quantity': NumberInput(attrs={'type':'number', 'readOnly': True, 'required':True, 'class':"required form-control"}),
            'remaining': HiddenInput(attrs={'type':'hidden', 'required':True, 'class':"required form-control"})
        }


class editTshirtForm(addTshirtForm, ModelForm):
    class Meta(addTshirtForm.Meta):
        fields = ('size', 'order_date', 'receiving_date', 'previous_stock', 'ordered_quantity', 'received_quantity', 'total_quantity', 'allotted', 'remaining', 'paid_by', 'add_name', 'additional')

    
class AddJoiningForm(ModelForm):
    class Meta:
        model = engagementJoining
        fields = ('employee_name', 'details', 'loi', 'offer_letter', 'nda_signed', 'joining_letter', 'joining_documents', 'joining_hamper', 'relieving_letter', 'experience_letter', 'laptop_charger', 'mouse_mousePad', 'bag', 'id_card', 'induction', 'add_to_skype_group', 'add_to_whatsapp_group', 'remove_from_skype_group', 'remove_from_whatsapp_group', 'onedrive_access', 'microsoft_account_created', 'microsoft_account_deleted', 'gmail_account', 'skype_id', 'system_configration', 'system_format', 'email_account', 'upwork_account_Add_to_team', 'upwork_account_Add_account', 'upwork_account_Remove_from_team', 'upwork_account_Close_account')
        widgets = {
            'employee_name': TextInput(attrs={'type':'text', 'class':"required form-control"}),
            'details': Select(attrs={'type': 'select', 'class': "form-select"}), 
            'loi': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'offer_letter': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'nda_signed': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'joining_letter': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'joining_documents': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'joining_hamper': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'relieving_letter': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'experience_letter': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'laptop_charger': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'mouse_mousepad': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'bag': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'id_card': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'induction': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'add_to_skype_group': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'add_to_whatsapp_group': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'remove_from_skype_group': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'remove_from_whatsapp_group': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'onedrive_access': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'microsoft_account_created': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'microsoft_account_deleted': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'gmail_account': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'skype_id': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'system_configuration': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'system_format': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'email_account': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'add_upwork_account_to_team': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'add_upwork_account': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'remove_upwork_account_from_team': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'close_upwork_account': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'fnf': TextInput(attrs={'type':'text', 'class':"form-control"})
        }

class EditJoiningForm(AddJoiningForm, ModelForm):
    class Meta(AddJoiningForm.Meta):
        exclude = ['details']


# import form
class ImportForm(forms.Form):
    import_file = forms.FileField(allow_empty_file=False,validators=[FileExtensionValidator(allowed_extensions=['csv', 'xls', 'xlsx'])], label="")


class AddEventForm(ModelForm):
    new_event = CharField(max_length=50, widget=TextInput(attrs={'type': 'text', 'class': "form-control", "placeholder": "Enter event"}))
    date = forms.DateField(
        widget=forms.DateInput(format='%d-%m-%Y', attrs={'type':'date', 'class': "required form-select datepicker"}),
        input_formats=('%d-%m-%Y', )
    )
    class Meta:
        model = officeEvents
        fields = ('date', 'event_name', 'new_event', 'activity_planned', 'item', 'food', 'remarks')
        
        widgets = {
            # 'date': DateInput(format='%m-%d-%Y', attrs={'type':'date', 'class': "required form-select"}),
            'event_name': Select(attrs={'type':'select', 'class': "required form-select"}),
            'activity_planned': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'item': Textarea(attrs={'type':'textarea', 'class':"required form-control", 'placeholder':'Enter Item'}),
            'food': Textarea(attrs={'type':'textarea', 'class':"required form-control", 'placeholder':'Enter Food Item'}),
            'remarks': Textarea(attrs={'type':'textarea', 'class':"form-control"})
        }
    


class EditEventForm(AddEventForm, ModelForm):
    class Meta(AddEventForm.Meta):
        fields = '__all__'
