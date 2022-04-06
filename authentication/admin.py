"""
This file contains the admin class for the authentication app.
"""

from django.contrib import admin
from authentication.models import UserProfile
# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """
    This class is the admin class for the UserProfile model.
    """
    list_display = ('user', 'department', 'position', 'birth_date')
    search_fields = ('user', 'department', 'position', 'birth_date')
