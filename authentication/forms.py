from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
# from django.contrib.auth.forms import AuthenticationForm


class RegistrationForm(UserCreationForm):
    email = forms.EmailField()
    class Meta:
        model= User
        fields = ('username','email')

    def clean(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already registered !")
        return self.cleaned_data


# login form for user login
class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'fadeIn second input-field', 'placeholder': 'Enter your email'}))
    password = forms.CharField(widget=forms.TextInput(attrs={'type':'password', 'class':'fadeIn third input-field', 'placeholder': 'Enter your password'}))


