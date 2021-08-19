from django.db import models
from django.db.models.fields import DateField
from django.core.validators import RegexValidator

choices = [('Snacks', 'Snacks'), ('Beverages', 'Beverages'), ('Others', 'Others')]
paid_by = [('Shreya', 'Shreya'), ('Pankaj', 'Pankaj'), ('Company', 'Company'), ('Others', 'Others')]
unit_choices_adhoc_items = [('Set', 'Set'), ('Number', 'Number')]
daily_weekly_choices = [('1', 'Foods'), ('2', 'Beverage'), ('3', 'Others')]
unit_choices = [('Gm', 'gram'), ('Kg', 'kilogram'), ('No.s', 'number'), ('Dozen', 'dozen'), ('Liter', 'liter'),
                ('Ml', 'mililiter')]
paid_by_choices = [('shreya', 'Shreya'), ('pankaj', 'Pankaj'), ('company', 'Company'), ('others', 'Others')]
payment_mode_choices = [('cash', 'Cash'), ('digital', 'Digital'), ('company_account', 'Company_Account'), ('others', 'Others')]


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
    paid_by = models.CharField(max_length=50, choices=paid_by_choices)
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
class dailyWeeklyItems(models.Model):
    # type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    type = models.CharField(max_length=50, choices=daily_weekly_choices)
    product = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=50, choices=unit_choices)
    amount = models.PositiveIntegerField(null=True)
    purchase_date = models.DateField()
    aditional_info = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return str(self.product)

class vendorContactList(models.Model):
    phone_regex = RegexValidator(regex=r'^\d{10}$', message="Phone number must be positive intergers.Up to 10 digits allowed.")
    service = models.CharField(max_length=50)
    vendor_name = models.CharField(max_length=100)
    contact_no = models.CharField(validators=[phone_regex], max_length=10)
    alternate_no = models.CharField(validators=[phone_regex], max_length=10, blank=True, null=True,)
    nominal_charges = models.PositiveIntegerField(null=True, blank=True)
    aditional_info = models.CharField(max_length=200, blank=True, null=True,)

    def __str__(self):
        return str(self.service)


class repairServices(models.Model):
    service_date = models.DateField()
    service_of = models.ForeignKey(vendorContactList, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=50)
    charges = models.PositiveIntegerField()
    vendor_name = models.CharField(max_length=50)
    contact_no = models.CharField(max_length=10)
    paid_by = models.CharField(max_length=50, choices=paid_by_choices)
    payment_mode = models.CharField(max_length=50, choices=payment_mode_choices)
    next_service_date = models.DateField()
    aditional_info = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return str(self.service_of)

