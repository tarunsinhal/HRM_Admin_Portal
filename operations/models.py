from django.db import models

choices = [('Snacks', 'Snacks'), ('Beverages', 'Beverages'), ('Others', 'Others')]


# Create your models here.
class Item_types(models.Model):
    type_name = models.CharField(max_length=50)
    type_id = models.IntegerField(primary_key=True)

    def __str__(self) :
        return str(self.type_name)


class Product_type(models.Model):
    product_type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.product_name)


class FoodInventory(models.Model):
    # type = models.CharField(max_length=50, choices=choices, default='Snacks')
    type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    product = models.ForeignKey(Product_type, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    amount = models.PositiveIntegerField(null=True)
    last_order_date = models.DateField()
    expected_order_date = models.DateField()

    def __str__(self):
        return str(self.product)