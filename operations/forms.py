from datetime import date
from django.forms import forms, ModelForm, TextInput, MultiWidget, CharField, IntegerField, ChoiceField, \
    MultiValueField, RegexField
from django.forms.widgets import DateInput, HiddenInput, NumberInput, Select, SelectMultiple, Widget, Textarea
from .models import FoodInventory, Product_type, recurringItems, AdhocItems, dailyWeeklyItems, vendorContactList, \
    repairServices, t_shirt_inventory
from django.contrib.auth.models import User
from itertools import chain

unit_choices = [('gram', 'gm'), ('kilogram', 'kg'), ('centimeter', 'cm'), ('meter', 'm'), ('liter', 'liters'),
                ('mililiters', 'ml')]

quantity_adhoc_choices = [('Set', 'Set'), ('Number', 'Number'), ('gram', 'gm'), ('kilogram', 'kg'),
                          ('centimeter', 'cm'), ('meter', 'm'), ('liter', 'liters'),
                          ('mililiters', 'ml')]
paid_by_choices = [('shreya', 'Shreya'), ('pankaj', 'Pankaj'), ('company', 'Company'), ('others', 'Others')]
payment_mode_choices = [('cash', 'Cash'), ('digital', 'Digital'), ('company_account', 'Company_Account'),
                        ('others', 'Others')]


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
            'type': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'product': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'quantity': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'price': NumberInput(
                attrs={'type': 'number', 'class': "required form-control", "aria-describedby": "inputGroupPrepend"}),
            'discount': NumberInput(
                attrs={'type': 'number', 'class': "required form-control", "aria-describedby": "inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'paid_by': Select(attrs={'type': 'select', 'class': "required form-select"}),
            'purchase_date': DateInput(attrs={'type': 'date', 'class': "required form-control"}),
            'next_order_date': DateInput(attrs={'type': 'date', 'class': "required form-control"})
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


class QuantityWidgetAdhoc(MultiWidget):
    def __init__(self, *args, **kwargs):
        self.widgets = [NumberInput({'type': 'number', 'class': "required form-control"}),
                        Select(choices=quantity_adhoc_choices, attrs={'type': 'select', 'class': "form-select"})]
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
    add_name = CharField(max_length=50, widget=HiddenInput(
        attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))

    quantity = QuantityFieldAdhoc()

    class Meta:
        model = AdhocItems
        fields = ('type', 'product', 'quantity', 'price', 'amount', 'advance_pay', 'balance_amount',
                  'paid_by', 'add_name', 'purchase_date', 'received_date', 'additional_info')
        # ('purchase_date','received_date', 'product', 'quantity', 'price',
        #           'amount', 'advance_pay','paid_by','add_name', 'additional_info')

        widgets = {
            'type': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'product': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'price': NumberInput(
                attrs={'type': 'number', 'class': " form-control", "aria-describedby": "inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'advance_pay': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'balance_amount': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'paid_by': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'purchase_date': DateInput(attrs={'type': 'date', 'class': "required form-control"}),
            'received_date': DateInput(attrs={'type': 'date', 'class': "required form-control"}),
            'additional_info': Textarea(attrs={'type': 'text', 'class': "required form-control"}), }

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     paid_by_dropdown = self.fields['paid_by']
    #     # paid_by.choices = list(paid_by.choices)
    #     paid_by_dropdown.append(tuple(('Other', 'Other')))


class EditAdhocItemsForm(AddAdhocItemsForm, ModelForm):
    # add_name = CharField(max_length=50, widget=HiddenInput(
    #     attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter name"}))

    def __init__(self, *args, **kwargs):
        super(EditAdhocItemsForm, self).__init__(*args, **kwargs)
        super().__init__()
        self.fields['advance_pay'].widget.attrs['readonly'] = True

    class Meta(AddAdhocItemsForm.Meta):
        fields = ('purchase_date', 'received_date', 'product', 'quantity', 'price',
                  'amount', 'advance_pay', 'balance_amount', 'paid_by', 'add_name', 'additional_info')


class AddItems(ModelForm):
    class Meta:
        model = dailyWeeklyItems
        fields = ('type', 'purchase_date', 'product', 'quantity', 'unit', 'amount', 'aditional_info')
        widgets = {
            'type': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'purchase_date': DateInput(attrs={'type': 'date', 'class': "required form-control"}),
            'product': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'quantity': NumberInput(attrs={'type': 'number', 'class': "required form-control"}),
            'unit': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'amount': NumberInput(
                attrs={'type': 'number', 'class': "required form-control", "aria-describedby": "inputGroupPrepend"}),
            'aditional_info': Textarea(attrs={'type': 'textarea', 'class': "form-control"})
        }


class EditItems(AddItems, ModelForm):
    class Meta(AddItems.Meta):
        exclude = ['type']


class AddVendor(ModelForm):
    class Meta:
        model = vendorContactList
        fields = '__all__'
        widgets = {
            'service': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'vendor_name': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'contact_no': TextInput(attrs={'type': 'text', 'class': "required form-control chk"}),
            'alternate_no': TextInput(attrs={'type': 'text', 'class': "form-control chk"}),
            'nominal_charges': NumberInput(
                attrs={'type': 'number', 'class': "form-control chk", "aria-describedby": "inputGroupPrepend"}),
            'aditional_info': Textarea(attrs={'type': 'textarea', 'class': "form-control chk"})
        }


class EditVendor(AddVendor, ModelForm):
    class Meta(AddVendor.Meta):
        fields = '__all__'


class AddRepairServices(ModelForm):
    class Meta:
        model = repairServices
        fields = (
            'service_date', 'service_of', 'service_type', 'charges', 'vendor_name', 'contact_no', 'paid_by',
            'payment_mode',
            'next_service_date', 'aditional_info')
        widgets = {
            'service_date': TextInput(attrs={'type': 'date', 'class': "required form-control"}),
            'service_of': Select(attrs={'type': 'text', 'class': "required form-select", 'options_value': ''}),
            'service_type': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'charges': NumberInput(
                attrs={'type': 'number', 'class': "required form-control", "aria-describedby": "inputGroupPrepend"}),
            'vendor_name': Select(attrs={'type': 'text', 'class': "required form-select"}),
            'contact_no': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'paid_by': Select(choices=paid_by_choices, attrs={'type': 'select', 'class': "form-select"}),
            'payment_mode': Select(choices=payment_mode_choices,
                                   attrs={'type': 'select', 'class': "required form-select"}),
            'next_service_date': TextInput(attrs={'type': 'date', 'class': "required form-control"}),
            'aditional_info': Textarea(attrs={'type': 'textarea', 'class': "form-control"})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.fields['service_of'].queryset = vendorContactList.objects.values('service').distinct()
        self.fields['service_of'].queryset = vendorContactList.objects.values_list('service', flat=True).distinct()


class EditRepairServices(AddRepairServices, ModelForm):
    class Meta(AddRepairServices.Meta):
        fields = '__all__'


class addTshirtForm(ModelForm):
    class Meta:
        model = t_shirt_inventory
        fields = ('order_date', 'receiving_date', 'size', 'previous_stock', 'ordered_quantity', 'allotted',
                  'paid_by', 'additional')
        widgets = {
            'order_date': DateInput(attrs={'type': 'date', 'required': True, 'class': "required form-control"}),
            'receiving_date': DateInput(attrs={'type': 'date', 'required': True, 'class': "required form-control"}),
            'size': Select(attrs={'type': 'text', 'required': True, 'class': "form-control"}),
            'previous_stock': NumberInput(
                attrs={'type': 'number', 'required': True, 'readOnly': True, 'class': "required form-control"}),
            'ordered_quantity': NumberInput(
                attrs={'type': 'number', 'required': True, 'class': "required form-control"}),
            'allotted': NumberInput(attrs={'type': 'number', 'required': True, 'class': "required form-control"}),
            'paid_by': TextInput(
                attrs={'type': 'text', 'required': True, 'spellcheck': 'true', 'class': "required form-control"}),
            'additional': Textarea(attrs={'type': 'text', 'class': "required form-control"}),
            'total_quantity': HiddenInput(attrs={'type': 'hidden', 'required': True, 'class': "required form-control"}),
            'remaining': HiddenInput(attrs={'type': 'hidden', 'required': True, 'class': "required form-control"})
        }


class editTshirtForm(addTshirtForm, ModelForm):
    class Meta(addTshirtForm.Meta):
        fields = (
        'size', 'receiving_date', 'previous_stock', 'ordered_quantity', 'total_quantity', 'allotted', 'remaining',
        'paid_by', 'additional')
