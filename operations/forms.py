from datetime import date
from django.db.models import fields
from django.forms import forms, ModelForm, TextInput, MultiWidget, ChoiceField, CharField, IntegerField, ChoiceField, MultiValueField
from django.forms.widgets import DateInput, HiddenInput, NumberInput, Select, SelectMultiple, Widget
from .models import FoodInventory, Product_type, recurringItems



unit_choices = [('gram', 'gm'), ('kilogram', 'kg'), ('centimeter', 'cm'), ('meter', 'm'), ('liter', 'liters'),
                ('mililiters', 'ml')]


class UnitWidget(MultiWidget):
    def __init__(self, *args, **kwargs):
        self.widgets = [NumberInput({'type':'number', 'class':"required form-control"}), Select(choices=unit_choices, attrs={'type':'select', 'class':"form-select"})]
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
    new_product = CharField(max_length=50, widget=HiddenInput(attrs={ 'type':'hidden','class':"required form-control", "placeholder":"Enter product"}))
    unit = UnitField()
    class Meta:
        model = recurringItems
        fields = ('type', 'product', 'new_product', 'quantity','unit', 'price', 'discount', 'amount', 'paid_by', 'purchase_date', 'next_order_date')
        widgets = {
            'type': Select(attrs={'type':'text', 'class':"required form-select"}),
            'product': Select(attrs={'type':'text', 'class':"required form-select"}),
            'quantity': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'price': NumberInput(attrs={'type':'number', 'class':"required form-control", "aria-describedby":"inputGroupPrepend"}),
            'discount': NumberInput(attrs={'type':'number', 'class':"required form-control", "aria-describedby":"inputGroupPrepend"}),
            'amount': NumberInput(attrs={'type':'number', 'class':"required form-control"}),
            'paid_by': TextInput(attrs={'type':'text', 'class':"required form-control"}),
            'purchase_date': DateInput(attrs={'type':'date', 'class':"required form-control"}),
            'next_order_date': DateInput(attrs={'type':'date', 'class':"required form-control"})
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()

        # if 'type' in self.data:
        #     try:
        #         type_id = int(self.data.get('type'))
        #         self.fields['product'].queryset = Product_type.objects.filter(product_type_id=type_id).order_by('product_name')
        #     except (ValueError, TypeError):
        #         pass  # invalid input from the client; ignore and fallback to empty Product queryset
        # elif self.instance.pk:
        #     self.fields['product'].queryset = self.instance.type.product_set.order_by('product_name')

    def clean_content(self):
        last_order_date = self.cleaned_data.get("purchase_date")
        expected_order_date = self.cleaned_data.get("next_order_date")
        if expected_order_date < last_order_date:
            raise forms.ValidationError("Expected Date is less than last Order date")
        return  last_order_date, expected_order_date


class EditProducts(AddProducts, ModelForm):
    class Meta(AddProducts.Meta):
        exclude = ['type']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()


    

