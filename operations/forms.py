from datetime import date
from django.db.models import fields
from django.forms import forms, ModelForm, TextInput
from django.forms.widgets import DateInput, HiddenInput, NumberInput, Select, SelectMultiple
from .models import FoodInventory


class AddProducts(ModelForm):
    class Meta:
        model = FoodInventory
        fields = "__all__"
        widgets = {
            'type': Select(attrs={'type':'text', 'class':"form-select"}),
            'product': TextInput(attrs={'type':'text', 'class':"form-control"}),
            'quantity': NumberInput(attrs={'type':'text', 'class':"form-control"}),
            'price': NumberInput(attrs={'type':'text', 'class':"form-control"}),
            'amount': HiddenInput(attrs={'class':"form-control"}),
            'last_order_date': DateInput(attrs={'type':'date', 'class':"form-control"}),
            'expected_order_date': TextInput(attrs={'type':'date', 'class':"form-control"})
        }
    
    def clean_content(self):
        last_order_date = self.cleaned_data.get("last_order_date")
        expected_order_date = self.cleaned_data.get("expected_order_date")
        if expected_order_date > last_order_date:
            raise forms.ValidationError("This Tweet is too long!!!")
        return  last_order_date, expected_order_date


class EditProducts(AddProducts, ModelForm):
    class Meta(AddProducts.Meta):
        exclude = ['type']
    

