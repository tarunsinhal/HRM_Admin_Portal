"""
This file contains the app configuration for the operations app.
"""
from django.apps import AppConfig


class OperationsConfig(AppConfig):
    """
    This class is used to register the operations app.
    """
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'operations'
