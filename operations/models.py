from django.db import models

choices = [('Snacks', 'Snacks'), ('Beverages', 'Beverages'), ('Others', 'Others')]


# Create your models here.
class Item_types(models.Model):
    type_name = models.CharField(max_length=50)
    type_id = models.IntegerField(primary_key=True)

    def __str__(self) :
        return self.type_name


class FoodInventory(models.Model):
    type = models.CharField(max_length=50, choices=choices, default='Snacks')
    # type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    product = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    amount = models.PositiveIntegerField(null=True)
    last_order_date = models.DateField()
    expected_order_date = models.DateField()

    def __str__(self):
        return self.product