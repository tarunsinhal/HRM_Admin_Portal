from django.contrib import admin
from authentication.models import UserProfile
# Register your models here.

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'position', 'birth_date')
    search_fields = ('user', 'department', 'position', 'birth_date')