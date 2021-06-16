from django.contrib import auth
from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
# from authentication.forms import LoginForm

app_name = 'authentication'
urlpatterns = [
    # path('login/', auth_views.LoginView.as_view(template_name="authentication/login1.html", 
    #         authentication_form=LoginForm), {'redirect_if_logged_in': '/home'}, name='user_login'),
    path('login/', views.user_login, name='user_login'),
    path('logout/', auth_views.LogoutView.as_view(), name="logout"),
    # path('password-reset/', auth_views.PasswordResetView.as_view(form_class=views.EmailValidationForm), name='password_reset'),
    # path('password-reset/done/', auth_views.PasswordResetDoneView.as_view(), name="password_reset_done"),
    # path('password-set-confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name="password_reset_confirm"),
    # path('reset/done/', auth_views.PasswordResetCompleteView.as_view(), name="password_reset_complete"),
]