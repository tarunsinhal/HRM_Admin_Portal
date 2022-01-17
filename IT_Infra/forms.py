from django import forms
import django
from django.forms import fields, forms, ModelForm, BooleanField, CharField, HiddenInput, ImageField
from django.forms import widgets
from .models import it_inventory, it_allotment, it_inventory_item, hardware_allotted_items, software_allotted_items, damage_images
from django.forms.widgets import NumberInput, PasswordInput, Select, TextInput, ChoiceWidget, Textarea, ClearableFileInput, CheckboxInput, DateInput
from django_select2 import forms as s2forms
from django.core.validators import FileExtensionValidator


item_choices = [('Laptop', 'Laptop'), ('Mouse', 'Mouse'), ('Bag', 'Bag')]


# import form
class ImportForm(forms.Form):
    import_file = forms.FileField(allow_empty_file=False,validators=[FileExtensionValidator(allowed_extensions=['csv', 'xls', 'xlsx'])], label="")


class it_inventory_add_form(ModelForm):
    new_item = CharField(max_length=50, widget=HiddenInput(attrs={'type': 'hidden', 'class': "required form-control", "placeholder": "Enter product"}))
    class Meta:
        model = it_inventory
        fields = ('type', 'item', 'new_item', 'details', 'name', 'validity_start_date', 'validity_end_date',  'system_names', 'purchase_type', 'remarks')

        widgets = {
            'type': Select(attrs={'type':'text', 'class':"chk required form-select"}),
            'item': Select(attrs={'type':'text', 'class':"chk required form-select"}),
            'details': TextInput(attrs={'type':'text', 'class':"chk required form-control"}),
            'name': TextInput(attrs={'type':'text', 'class':"chk required form-control"}),
            'validity_start_date': DateInput(attrs={'type':'date', 'class':"chk required form-control"}),
            'validity_end_date': DateInput(attrs={'type':'date', 'class':"chk form-control"}),
            'remarks': Textarea(attrs={'type':'textarea', 'class':"chk form-control"}),
            'purchase_type': TextInput(attrs={'type': 'text', 'class':"chk form-control"})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['item'].queryset = it_inventory_item.objects.none()


class it_inventory_edit_form(it_inventory_add_form, ModelForm):
    class Meta(it_inventory_add_form.Meta):
        fields = ('item', 'details', 'name', 'validity_start_date', 'validity_end_date',  'system_names', 'status', 'purchase_type', 'remarks')
        widgets = {
            'type': Select(attrs={'type':'text', 'class':"chk required form-select"}),
            'item': Select(attrs={'type':'text', 'class':"chk required form-select"}),
            'details': TextInput(attrs={'type':'text', 'class':"chk required form-control"}),
            'name': TextInput(attrs={'type':'text', 'class':"chk required form-control"}),
            'validity_start_date': DateInput(attrs={'type':'date', 'class':"chk required form-control"}),
            'validity_end_date': DateInput(attrs={'type':'date', 'class':"chk form-control"}),
            'remarks': Textarea(attrs={'type':'textarea', 'class':"chk form-control"}),
            'purchase_type': TextInput(attrs={'type': 'text', 'class':"chk form-control"}),
            'status': Select(attrs={'type':'text', 'class':"chk required form-select"})
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['item'].queryset = it_inventory_item.objects.none()


class it_allotment_add_form(ModelForm):
    class Meta:
        model = it_allotment
        fields = "__all__"

        # labels = {
        #     "laptop_purchase_type": "Purchase Type",
        #     "mouse_purchase_type": "Purchase Type",
        #     "bag_purchase_type": "Purchase Type"
        # }
        widgets = {
            'employee_id': Select(attrs={'type': 'text', 'required': True, 'class': "required form-select fieldlabels"}),
            'employee_name': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'laptop': CheckboxInput(attrs={'type': 'checkbox', 'class': "required checkbox"}),
            # 'mouse': Select(attrs={'type': 'checkbox', 'class': "required checkbox"}),
            # 'bag': TextInput(attrs={'type': 'checkbox', 'class': "required"}),
            # 'mcAfee': TextInput(attrs={'type': 'checkbox', 'class': "required"}),
            # 'laptop_number': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'laptop_details': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'laptop_purchase_type': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'laptop_RAM': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'mouse_number': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'mouse_details': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'mouse_purchase_type': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'bag_number': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'bag_details': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'bag_purchase_type': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'mcAfee_validity': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'purchase_type': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'office_365_id': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'official_email': TextInput(attrs={'type': 'email', 'class': "required form-control", 'aria-describedby': "basic-addon2"}),
            'microsoft_email': TextInput(attrs={'type': 'email', 'class': "required form-control"}),
            'microsoft_email_password': PasswordInput(attrs={'class': "required form-control", 'data-toggle': 'password'}),
            'skype_email': TextInput(attrs={'type': 'email', 'class': "required form-control"}),
            'skype_email_password': PasswordInput(attrs={'class': "required form-control"}),
            # 'past_allottee': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'damage': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            # 'images_for_damage': ClearableFileInput(attrs={'class': "required", 'multiple': True}),
            'remarks': Textarea(attrs={'type': 'textarea', 'class': "form-control"})
        }


class it_allotment_edit_form(it_allotment_add_form):
    class Meta(it_allotment_add_form.Meta):
         widgets = {
            'employee_id': TextInput(attrs={'type': 'text', 'required': True, 'readOnly': True, 'class': "required form-control fieldlabels"}),
            'employee_name': TextInput(attrs={'type': 'text', 'readOnly': True, 'class': "required form-control"}),
            'office_365_id': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'official_email': TextInput(attrs={'type': 'email', 'class': "required form-control", 'aria-describedby': "basic-addon2"}),
            'microsoft_email': TextInput(attrs={'type': 'email', 'class': "required form-control"}),
            'microsoft_email_password': PasswordInput(attrs={'class': "required form-control", 'data-toggle': 'password'}),
            'skype_email': TextInput(attrs={'type': 'email', 'class': "required form-control"}),
            'skype_email_password': PasswordInput(attrs={'class': "required form-control"}),
            'damage': TextInput(attrs={'type': 'text', 'class': "required form-control"}),
            'remarks': Textarea(attrs={'type': 'textarea', 'class': "form-control"})
        }


class hardware_allotted_add_form(ModelForm):
    class Meta:
        model = hardware_allotted_items
        fields = "__all__"

        widgets = {
            # 'item': CheckboxInput(attrs={'class': "form-check-input", 'label': 'Laptop'}),
            'item_name': Select(attrs={'type': 'text', 'disabled': True, 'class': "item_names form-select"}),
            'details': TextInput(attrs={'type': 'text', 'readOnly': True, 'class': "form-control"}),
            'additional': TextInput(attrs={'type': 'text', 'class': "form-control"})
        }

    # def __init__(self, *args, **kwargs):
    #     super(hardware_allotted_add_form, self).__init__(*args, **kwargs)
    #     self.fields['item_name'].widget = TextInput()


class software_allotted_add_form(ModelForm):
    class Meta:
        model = software_allotted_items
        fields = "__all__"

        widgets = {
            'item_name': Select(attrs={'type': 'text', 'disabled': True, 'class': "item_names form-select"}),
            'details': TextInput(attrs={'type': 'text', 'readOnly': True, 'class': "form-control"}),
            'validity_start_date': DateInput(attrs={'type':'date', 'readOnly': True, 'class':"chk form-control"}),
            'validity_end_date': DateInput(attrs={'type':'date', 'readOnly': True, 'class':"chk form-control"}),
            'additional': TextInput(attrs={'type': 'text', 'class': "form-control"}),
            # 'item': TextInput(attrs={'type': 'text', 'class': "form-control"})
        }


class ImageForm(forms.Form):
    image = ImageField(label='image')
    
    class Meta:
        model = damage_images
        fields = ('images_for_damage',)       
            

class it_allotment_full_add_form(it_allotment_add_form):
    images = forms.FileField(widget=ClearableFileInput(attrs={'multiple': True}))

    # class Meta(it_allotment_add_form.Meta):
    #     fields = it_allotment_add_form.Meta.fields + ['images',]
