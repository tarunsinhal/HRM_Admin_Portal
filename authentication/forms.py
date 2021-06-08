from django import forms
# from django.contrib.auth.forms import AuthenticationForm


class LoginForm(forms.Form):

    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'fadeIn second', 'placeholder': 'Enter your email'}))
    password = forms.CharField(widget=forms.TextInput(attrs={'type':'password', 'class':'fadeIn third', 'placeholder': 'Enter your password'}))

    