from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
# import password reset form
from django.contrib.auth.forms import PasswordResetForm


class RegistrationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
        widgets = {
            'username': forms.TextInput(),
            'email': forms.EmailInput(),
            'password1': forms.PasswordInput(),
            'password2': forms.PasswordInput(),
        }
        


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


