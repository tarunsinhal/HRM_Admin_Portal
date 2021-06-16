from django.db import models

choices = [('Snacks', 'Snacks'), ('Beverages', 'Beverages'), ('Others', 'Others')]


# Create your models here.
class FoodInventory(models.Model):
    type = models.CharField(max_length=50, choices=choices, default='Snacks')
    product = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    last_order_date = models.DateField()
    expected_order_date = models.DateField()

    def __str__(self):
        return self.product