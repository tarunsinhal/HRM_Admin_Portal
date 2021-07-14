from django.db import models

#Create your models here.
class notifications(models.Model):
    product = models.CharField(max_length=500)
    item_id = models.IntegerField()
    notification_date = models.DateField()
    is_visited = models.BooleanField()

    class Meta:
        ordering = ['-notification_date']