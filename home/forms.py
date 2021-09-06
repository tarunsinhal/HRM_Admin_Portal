from django.forms import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.forms.fields import EmailField, CharField
from django.forms.widgets import Textarea, TextInput, EmailInput


class UpdateUserForm(ModelForm):
    email = EmailField(required=False)

    class Meta:
        model = User
        fields = ['username', 'email']


# class SendEmail(forms.Form):
#     email = EmailField(
#         widget=EmailInput(attrs={'class': 'fadeIn second input-field', 'placeholder': 'Enter email address'}))
#     subject = CharField(max_length=250,
#                         widget=TextInput(attrs={'class': 'fadeIn second input-field', 'placeholder': 'Subject'}))
#     message = CharField(max_length=250,
#                         widget=Textarea(attrs={'class': 'fadeIn second input-field', 'placeholder': 'Email Message'}))


