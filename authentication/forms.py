from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
# import password reset form
from django.contrib.auth.forms import PasswordResetForm


class RegistrationForm(UserCreationForm):
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput(attrs={'class': 'form-control'}),label_suffix='',required=False)
    password2 = forms.CharField(label='Password Confirmation',label_suffix="", widget=forms.PasswordInput(attrs={'class': 'form-control'}),required=False)
    email = forms.EmailField(label='Email', widget=forms.EmailInput(attrs={'class': 'form-control'}),label_suffix='')
    username = forms.CharField(label='Username', widget=forms.TextInput(attrs={'class': 'form-control'}),label_suffix='')
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        
        def save(self, commit=True):
            user = super(RegistrationForm, self).save(commit=False)
            default_password = User.objects.make_random_password()
            user.set_password(default_password)
            if commit:
                user.save()
            return user


# login form for user login
class LoginForm(forms.Form):
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'input100',}))
    password = forms.CharField(widget=forms.PasswordInput(attrs={ 'class':'input100', }))




class EmailValidationOnForgotPassword(PasswordResetForm):
    def clean_email(self):
        email = self.cleaned_data['email']
        if not User.objects.filter(email__iexact=email, is_active=True).exists():
            msg = ("There is no user registered with the specified E-mail address.")
            print(msg)
            self.add_error('email', msg)
        return email


