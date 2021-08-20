from django.db import models

#Create your models here.
class notifications(models.Model):
    product = models.CharField(max_length=500)
    item_id = models.IntegerField()
    notification_date = models.DateField()
    is_visited = models.BooleanField()
    notification_type = models.IntegerField(default=1)

    class Meta:
        ordering = ['-notification_date']


class notification_templates(models.Model):
    section = models.CharField(max_length=50)
    description = models.CharField(max_length=500)