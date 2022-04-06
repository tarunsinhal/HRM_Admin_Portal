"""
This file contains the configuration for the authentication app.
"""
from django.apps import AppConfig


class AuthenticationConfig(AppConfig):
    """
    This class is the configuration for the authentication app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authentication'
