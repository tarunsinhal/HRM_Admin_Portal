from datetime import date
from django.db.models import fields
from django.forms import forms, ModelForm, TextInput, MultiWidget, ChoiceField, CharField, IntegerField, ChoiceField, MultiValueField, RegexField
from django.forms.widgets import DateInput, HiddenInput, NumberInput, Select, SelectMultiple, Textarea, Widget
from .models import FoodInventory, Product_type, recurringItems, dailyWeeklyItems, vendorContactList, repairServices

unit_choices = [('gram', 'gm'), ('kilogram', 'kg'), ('centimeter', 'cm'), ('meter', 'm'), ('liter', 'liters'), ('mililiters', 'ml')]
paid_by_choices = [('shreya', 'Shreya'), ('pankaj', 'Pankaj'), ('company', 'Company'), ('others', 'Others')]
payment_mode_choices = [('cash', 'Cash'), ('digital', 'Digital'), ('company_account', 'Company_Account'), ('others', 'Others')]


class UnitWidget(MultiWidget):
    def __init__(self, *args, **kwargs):
        self.widgets = [NumberInput({'type': 'number', 'class': "required form-control"}),
                        Select(choices=unit_choices, attrs={'type': 'select', 'class': "form-select"})]
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
    new_product = CharField(max_length=50, widget=HiddenInput(
        attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter product"}))
    unit = UnitField()

    class Meta:
        model = recurringItems
        fields = (
            'type', 'product', 'new_product', 'quantity', 'unit', 'price', 'discount', 'amount', 'paid_by',
            'purchase_date',
            'next_order_date')
        widgets = {
            'type': Select(attrs={'type':'text', 'class':"required form-select"}),
            'product': Select(attrs={'type':'text', 'class':"required form-select"}),
            'quantity': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'price': NumberInput(attrs={'type':'number', 'class':"required form-control", "aria-describedby":"inputGroupPrepend"}),
            'discount': NumberInput(attrs={'type':'number', 'class':"required form-control", "aria-describedby":"inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'paid_by': Select(attrs={'type':'select', 'class':"required form-select"}),
            'purchase_date': DateInput(attrs={'type':'date', 'class':"required form-control"}),
            'next_order_date': DateInput(attrs={'type':'date', 'class':"required form-control"})
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
    class Meta(AddProducts.Meta):
        exclude = ['type']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()


class AddAdhocItemsForm(ModelForm):
    add_user = CharField(max_length=50, widget=HiddenInput(
        attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter user"}))

    class Meta:
        model = AdhocItems
        fields = ('product', 'quantity', 'unit','price', 'amount',
                  'paid_by', 'add_user', 'purchase_date', 'additional_info')
        widgets = {
            'purchase_date': DateInput(attrs={'type': 'date', 'class': "required form-control"}),
            'product': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'quantity': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'unit': Select(choices=unit_choices_adhoc_items, attrs={'type': 'select', 'class': "form-select"}),

            'price': NumberInput(
                attrs={'type': 'number', 'class': "required form-control", "aria-describedby": "inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'paid_by':  Select(choices=paid_by, attrs={'type': 'select', 'class': "form-select"}),
            'addition_info': TextInput(attrs={'type': 'text', 'class': "required form-control"}),

        }



class EditAdhocItemsForm(AddAdhocItemsForm, ModelForm):
    class Meta(AddAdhocItemsForm.Meta):
        fields = ['purchase_date', 'product', 'quantity', 'unit','price', 'amount',
                  'paid_by', 'additional_info']
class AddItems(ModelForm):
    class Meta:
        model = dailyWeeklyItems
        fields = ('type', 'purchase_date', 'product', 'quantity', 'unit', 'amount', 'aditional_info')
        widgets = {
            'type': Select(attrs={'type':'text', 'class':"required form-select"}),
            'purchase_date': DateInput(attrs={'type':'date', 'class':"required form-control"}),
            'product': TextInput(attrs={'type':'text', 'class':"required form-control"}),
            'quantity': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'unit': Select(attrs={'type':'text', 'class':"required form-select"}),
            'amount': NumberInput(attrs={'type':'number', 'class':"required form-control", "aria-describedby":"inputGroupPrepend"}),
            'aditional_info': Textarea(attrs={'type':'textarea', 'class':"form-control"})
        }
    
class EditItems(AddItems, ModelForm):
    class Meta(AddItems.Meta):
        exclude = ['type']


class AddVendor(ModelForm):
    class Meta:
        model = vendorContactList
        fields = '__all__'
        widgets = {
            'service': TextInput(attrs={'type':'text', 'class':"required form-control chk"}),
            'vendor_name': TextInput(attrs={'type':'text', 'class':"required form-control chk"}),
            'contact_no': TextInput(attrs={'type':'text', 'class':"required form-control chk"}),
            'alternate_no': TextInput(attrs={'type':'text', 'class':"form-control chk"}),
            'nominal_charges': NumberInput(attrs={'type':'number', 'class':"form-control chk", "aria-describedby":"inputGroupPrepend"}),
            'aditional_info': Textarea(attrs={'type':'textarea', 'class':"form-control chk"})
        }

class EditVendor(AddVendor, ModelForm):
    class Meta(AddVendor.Meta):
        fields = '__all__'

class AddRepairServices(ModelForm):
    class Meta:
        model = repairServices
        fields = ('service_date', 'service_of','service_type', 'charges', 'vendor_name', 'contact_no', 'paid_by', 'payment_mode', 'next_service_date', 'aditional_info')
        widgets = {
            'service_date': TextInput(attrs={'type':'date', 'class':"required form-control"}),
            'service_of':Select(attrs={'type':'text', 'class':"required form-select", 'options_value':''}),
            'service_type': TextInput(attrs={'type':'text', 'class':"required form-control"}),
            'charges': NumberInput(attrs={'type':'number', 'class':"required form-control", "aria-describedby":"inputGroupPrepend"}),
            'vendor_name': Select(attrs={'type':'text', 'class':"required form-select"}),
            'contact_no': TextInput(attrs={'type':'text', 'class':"required form-control"}),
            'paid_by': Select(choices=paid_by_choices, attrs={'type':'select', 'class':"form-select"}),
            'payment_mode': Select(choices=payment_mode_choices, attrs={'type':'select', 'class':"required form-select"}),
            'next_service_date': TextInput(attrs={'type':'date', 'class':"required form-control"}),
            'aditional_info': Textarea(attrs={'type':'textarea', 'class':"form-control"})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['service_of'].queryset = vendorContactList.objects.values('service').distinct()
        self.fields['service_of'].queryset = vendorContactList.objects.values_list('service',  flat=True).distinct()


class EditRepairServices(AddRepairServices, ModelForm):
    class Meta(AddRepairServices.Meta):
        fields = '__all__'
