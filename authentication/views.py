from email import message
from django.contrib.auth import authenticate
from django.http import HttpResponseRedirect
from .forms import LoginForm , RegistrationForm
from django.contrib.auth import login
from django.contrib.auth.forms import PasswordResetForm
from django.core.exceptions import ValidationError
from django.contrib import messages
from django.contrib.auth.models import User
from django.views.decorators.cache import cache_control
from django.db.models import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.template.loader import render_to_string
from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm
from django.core.mail import BadHeaderError, send_mail
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.utils.http import urlsafe_base64_encode
# Create your views here.




# function for authenicating the user login and then redirecting it to the homepage
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
    # send error message if email does not exist in the database
    def clean_email(self):
        error_messages = {
        'not_registered': 'Email ID is not Registered',
        }
    
        email = self.cleaned_data['email']
        print(email)
        if not User.objects.filter(email__iexact=email, is_active=True).exists():
            messages.error(self.request, error_messages['not_registered'])
            raise ValidationError(error_messages['not_registered'], code='not_registered')
        return email



def password_reset_request(request):
    if request.method == 'POST':
        domain = request.headers['Host']
        password_reset_form = PasswordResetForm(request.POST)
        if password_reset_form.is_valid():
            data = password_reset_form.cleaned_data['email']
            associated_user = User.objects.filter(Q(email=data))
            if associated_user.exists():
                for user in associated_user:
                    subject = "Password Reset Request"
                    email_template_name = 'authentication/password_reset_subject.txt'
                    c = {
                        "email": user.email,
                        'domain': domain,
                        'site_name': 'admin_portal',
                        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                        "user": user,
                        'token': default_token_generator.make_token(user),
                        'protocol': 'http',
                    }
                    email = render_to_string(email_template_name, c)
                    try:
                        send_mail(subject, email, settings.EMAIL_HOST_USER, [user.email],fail_silently=True)
                    except BadHeaderError:
                        return HttpResponse('Invalid header found.')
                    return redirect("/auth/password-reset/done/")
            else:
                messages.error(request, 'Email ID is not Registered')
    password_reset_form = PasswordResetForm()
    return render(request=request, template_name="authentication/password_reset.html",
                  context={"password_reset_form": password_reset_form})