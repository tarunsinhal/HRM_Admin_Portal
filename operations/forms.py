from datetime import date
from django.db.models import fields
from django.forms import forms, ModelForm, TextInput
from django.forms.widgets import DateInput, NumberInput, Select, SelectMultiple
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
            'last_order_date': DateInput(attrs={'type':'date', 'class':"form-control"}),
            'expected_order_date': TextInput(attrs={'type':'date', 'class':"form-control"})
        }


class EditProducts(AddProducts, ModelForm):
    class Meta(AddProducts.Meta):
        exclude = ['type']
    

