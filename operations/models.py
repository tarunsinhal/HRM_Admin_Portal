from django.db import models
from django.db.models.fields import DateField

choices = [('Snacks', 'Snacks'), ('Beverages', 'Beverages'), ('Others', 'Others')]
paid_by = [('Shreya', 'Shreya'), ('Pankaj', 'Pankaj'), ('Company', 'Company'), ('Others', 'Others')]
unit_choices_adhoc_items = [('Set', 'Set'), ('Number', 'Number')]


# Create your models here.
class Item_types(models.Model):
    type_name = models.CharField(max_length=50)
    type_id = models.IntegerField(primary_key=True)

    def __str__(self):
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


class recurringItems(models.Model):
    type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    product = models.ForeignKey(Product_type, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=50)
    price = models.PositiveIntegerField()
    discount = models.PositiveIntegerField(default=0)
    amount = models.PositiveIntegerField(null=True)
    paid_by = models.CharField(max_length=50)
    purchase_date = models.DateField()
    next_order_date = models.DateField()

    def __str__(self):
        return str(self.product)


class AdhocItems(models.Model):
    product = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=50, choices=unit_choices_adhoc_items)
    price = models.PositiveIntegerField()
    amount = models.PositiveIntegerField()
    paid_by = models.CharField(max_length=50, choices=paid_by)
    purchase_date = models.DateField()
    additional_info = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return str(self.product)
