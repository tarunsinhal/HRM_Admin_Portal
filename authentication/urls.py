from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
# from authentication.forms import LoginForm

app_name = 'authentication'
urlpatterns = [
    # path('login/', auth_views.LoginView.as_view(template_name="authentication/login1.html", 
    #         authentication_form=LoginForm), {'redirect_if_logged_in': '/home'}, name='user_login'),
    path('', views.auth_redirect, name="auth_redirect"),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.user_login, name='user_login'),
    path('auth/logout/', auth_views.LogoutView.as_view(), name="logout"),
   ]