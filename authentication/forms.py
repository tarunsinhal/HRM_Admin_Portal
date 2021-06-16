from django import forms
# from django.contrib.auth.forms import AuthenticationForm


class LoginForm(forms.Form):

    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'fadeIn second input-field', 'placeholder': 'Enter your email'}))
    password = forms.CharField(widget=forms.TextInput(attrs={'type':'password', 'class':'fadeIn third input-field', 'placeholder': 'Enter your password'}))


