"""Models for Home app"""
from django.db import models

#Create your models here.

class notification_templates(models.Model):
    """Notification templates model"""
    section = models.CharField(max_length=50)
    description = models.CharField(max_length=500)


class notifications(models.Model):
    """Notifications model"""
    product = models.CharField(max_length=500)
    item_id = models.IntegerField()
    notification_date = models.DateField()
    is_visited = models.BooleanField()
    notification_type = models.ForeignKey(notification_templates, on_delete=models.CASCADE)

    class Meta:
        """Meta class"""
        ordering = ['-notification_date']
