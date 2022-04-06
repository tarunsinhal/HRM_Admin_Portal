"""
This file contains the forms for the authentication app.
"""
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm

class RegistrationForm(UserCreationForm):
    """
    This class is the registration form.
    """
    password1 = forms.CharField(label='Password',
                                widget=forms.PasswordInput(attrs={'class': 'form-control'}),
                                label_suffix='',required=False)
    password2 = forms.CharField(label='Password Confirmation',
                                label_suffix="",
                                widget=forms.PasswordInput(attrs={'class': 'form-control'}),
                                required=False)
    email = forms.EmailField(label='Email',
                             widget=forms.EmailInput(attrs={'class': 'form-control'}),
                             label_suffix='')
    username = forms.CharField(label='Username',
                               widget=forms.TextInput(attrs={'class': 'form-control'}),
                               label_suffix='')
    class Meta: #  pylint: disable=too-few-public-methods
        """
        This class is allows the user to create a new user.
        """
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        def save(self, commit=True):
            """
            This method is used to save the form.
            """
            user = super(RegistrationForm, self).save(commit=False) # pylint: disable=bad-super-call
            default_password = User.objects.make_random_password()
            user.set_password(default_password)
            if commit:
                user.save()
            return user


# login form for user login
class LoginForm(forms.Form):
    """
    This class is the form for the login page.
    """
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'input100',}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={ 'class':'input100', }))
