from django import forms
from .models import bills_reimburse
from django.forms import ModelForm
from django.forms.widgets import Select, FileInput

class BillsReimburseForm(ModelForm):
    # image = ImageField(label='image')
    
    class Meta:
        model =  bills_reimburse
        fields = "__all__"       
        
        widgets = {
            'reimburse_status': Select(attrs={'type': 'select', 'class': "form-select"})
        }

