from django.forms import forms
from django.contrib.auth.models import User
from django.forms import ModelForm
from django.forms.fields import EmailField


class UpdateUserForm(ModelForm):
    email = EmailField()

    class Meta:
        model = User
        fields = ['username','email']

