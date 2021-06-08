from django.db import models

# Create your models here.
class CommonInfo(models.Model):
    type = models.CharField()
    product = models.CharField()
    item = models.CharField()
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    last_order_date = models.DateField()
    expected_order_date = models.DateField()

    class Meta:
        abstract = True

