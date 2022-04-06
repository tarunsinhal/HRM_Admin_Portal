"""
This file contains the app configuration for the suggestions app.
"""
from django.apps import AppConfig


class SuggestionsConfig(AppConfig):
    """
    This class is used to register the suggestions app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'suggestions'
