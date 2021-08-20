from django.contrib import admin
from .models import notifications, notification_templates

# Register your models here.
admin.site.register(notifications)
admin.site.register(notification_templates)