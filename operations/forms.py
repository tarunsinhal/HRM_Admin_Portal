from datetime import date
from django.db.models import fields
from django.forms import forms, ModelForm, TextInput, ChoiceField, CharField
from django.forms.widgets import DateInput, HiddenInput, NumberInput, Select, SelectMultiple
from .models import FoodInventory, Product_type


class AddProducts(ModelForm):
    new_product = CharField(max_length=50, label="New Product", widget=HiddenInput(attrs={'class':"form-control"}))
    class Meta:
        model = FoodInventory
        fields = ('type', 'product', 'new_product', 'quantity', 'price', 'amount', 'last_order_date', 'expected_order_date')
        widgets = {
            'type': Select(attrs={'type':'text', 'class':"form-select"}),
            'product': Select(attrs={'type':'text', 'class':"form-select"}),
            # 'other_product':HiddenInput(attrs={'type':'text', 'class':"form-control"}),
            'quantity': NumberInput(attrs={'type':'text', 'class':"form-control"}),
            'price': NumberInput(attrs={'type':'text', 'class':"form-control"}),
            'amount': HiddenInput(attrs={'class':"form-control"}),
            'last_order_date': DateInput(attrs={'type':'date', 'class':"form-control"}),
            'expected_order_date': TextInput(attrs={'type':'date', 'class':"form-control"})
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()

        print(self.instance.pk)
        # if 'type' in self.data:
        #     try:
        #         type_id = int(self.data.get('type'))
        #         self.fields['product'].queryset = Product_type.objects.filter(product_type_id=type_id).order_by('product_name')
        #     except (ValueError, TypeError):
        #         pass  # invalid input from the client; ignore and fallback to empty Product queryset
        # elif self.instance.pk:
        #     self.fields['product'].queryset = self.instance.type.product_set.order_by('product_name')

    def clean_content(self):
        last_order_date = self.cleaned_data.get("last_order_date")
        expected_order_date = self.cleaned_data.get("expected_order_date")
        if expected_order_date < last_order_date:
            raise forms.ValidationError("Expected Date is less than last Order date")
        return  last_order_date, expected_order_date


class EditProducts(AddProducts, ModelForm):
    class Meta(AddProducts.Meta):
        exclude = ['type']
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['product'].queryset = Product_type.objects.none()


    

