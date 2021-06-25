from django.contrib.auth import authenticate
from django.http.response import HttpResponse
from django.shortcuts import redirect, render
from django.http import HttpResponseRedirect
from .forms import LoginForm
from django.contrib.auth import login, logout
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.admin import User
from django.core.exceptions import ValidationError
from django.contrib import messages
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_control, never_cache


# Create your views here.


def auth_redirect(request):
    return redirect('auth/login/')


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def user_login(request):
    form = LoginForm()
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            try:
                user = User.objects.get(email=form.cleaned_data['email'])
                user = authenticate(request, username=user, password=form.cleaned_data['password'])
                if user.is_authenticated:
                    login(request, user)
                    return HttpResponseRedirect('/home')
                else:
                    messages.error(request, 'Invalid email or password!')
                    return render(request, 'authentication/login.html', {'form': form})
            except:
                messages.error(request, 'Invalid email or password!')
                return render(request, 'authentication/login.html', {'form': form})
            
    return render(request, 'authentication/login.html', {'form': form})


class EmailValidationForm(PasswordResetForm):
    def clean_email(self):
        error_messages = {
        'not_registered': 'Email ID is not Registered',
        }
        email = self.cleaned_data['email']
        if not User.objects.filter(email__iexact=email, is_active=True).exists():
            raise ValidationError(error_messages['not_registered'], code='not_registered')
        return email


@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def logout_view(request):
    request.session.flush()
    logout(request)
    return HttpResponseRedirect('/login')

