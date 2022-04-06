"""
This file builds the models for the authentication app.
"""
from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class UserProfile(models.Model):
    """
    This class is the model for the UserProfile model.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=100, blank=True)
    position = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    