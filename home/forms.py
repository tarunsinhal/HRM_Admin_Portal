"""Forms file for the home app"""
from django.contrib.auth.models import User
from django import forms
from django.forms import ModelForm

class UpdateUserForm(ModelForm):
    """Form for updating the user's profile."""
    class Meta:
        """Meta class for the UpdateUserForm."""
        model = User
        fields = ['username', 'email']
        widgets = {
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'email': forms.EmailInput(attrs={'class': 'form-control'}),
        }
