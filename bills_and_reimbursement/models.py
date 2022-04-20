from email.policy import default
from django.db import models
from django.template.defaultfilters import slugify
from datetime import datetime

status = [('Paid', 'Paid'), ('Hold', 'Hold'), ('Unpaid', 'Unpaid'), ('Pending', 'Pending')]

class bills_reimburse(models.Model):
    user = models.CharField(max_length=100)
    date = models.DateField()
    reimburse_status = models.CharField(max_length=100, choices=status)

    class Meta:
        unique_together = (("user", "date"),)

    def __str__(self):
        return str(self.user)

class bills_images(models.Model):
    image_user = models.CharField(max_length=100)
    image_date = models.DateField()
    bills_images = models.ImageField(upload_to="Bills_images", null=True, blank=True)

    def __str__(self):
        return str(self.image_user)



