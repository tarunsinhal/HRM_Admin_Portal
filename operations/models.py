"""
This file contains the models for the operations app.
"""
# from email.policy import default
from django.db import models
from django.core.validators import RegexValidator
from simple_history.models import HistoricalRecords

freq_choices = [
                    ('Daily', 'Daily'),
                    ('Weekly', 'Weekly'),
                    ('Bimonthly', 'Bimonthly'),
                    ('Monthly', 'Monthly')
                ]
unit_choices = [
                    ('Gm', 'gram'),
                    ('Kg', 'kilogram'),
                    ('No.s', 'number'),
                    ('Dozen', 'dozen'),
                    ('Liter', 'liter'),
                    ('Ml', 'mililiter')
                ]
payment_mode_choices = [
                            ('cash', 'Cash'),
                            ('digital', 'Digital'),
                            ('company_account', 'Company_Account'),
                            ('others', 'Others')
                        ]
t_shirt_sizes = [
                    ('XS', 'Extra-Small'),
                    ('S', 'Small'),
                    ('M', 'Medium'),
                    ('L', 'Large'),
                    ('XL', 'Extra-Large'),
                    ('XXL', 'XXL')
                ]
adhoc_product_types = [('1', 'Pantry'), ('2', 'Non-Pantry')]

# Create models for item_types
class Item_types(models.Model):
    """
    This class is used to create a model for the item type.
    """
    type_name = models.CharField(max_length=50)
    type_id = models.IntegerField(primary_key=True)

    def __str__(self):
        return str(self.type_name)

# Create models for product_types
class Product_type(models.Model):
    """
    This class is used to create a model for the product type.
    """
    product_type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=50)

    def __str__(self):
        return str(self.product_name)

class recurringItems(models.Model):
    """
    This class is used to create a model for the recurring items.
    """
    frequency = models.CharField(max_length=10, choices=freq_choices, default='Daily')
    type = models.ForeignKey(Item_types, on_delete=models.CASCADE)
    product = models.ForeignKey(Product_type, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    unit = models.CharField(max_length=50)
    price = models.PositiveIntegerField(blank=True, null=True)
    discount = models.PositiveIntegerField(blank=True, default=0)
    amount = models.PositiveIntegerField(default=0)
    paid_by = models.CharField(max_length=50)
    purchase_date = models.DateField()
    next_order_date = models.DateField(null=True, blank=True)
    history = HistoricalRecords()
    additional_info = models.CharField(max_length=200, blank=True)

    def __str__(self):
        return str(self.product)

class Adhoc_types(models.Model):
    """
    This class is used to create a model for the adhoc types.
    """
    item_name = models.CharField(max_length=50)
    item_id = models.IntegerField(primary_key=True)

    def __str__(self):
        return str(self.item_name)

class AdhocItems(models.Model):
    """
    This class is used to create a model for the adhoc items.
    """
    type = models.ForeignKey(Adhoc_types, on_delete=models.CASCADE)
    product = models.CharField(max_length=50)
    quantity = models.CharField(max_length=50)
    price = models.PositiveIntegerField(blank=True, null=True)
    amount = models.PositiveIntegerField()
    paid_by = models.CharField(max_length=100)
    purchase_date = models.DateField()
    advance_pay = models.PositiveIntegerField(blank=True, default=0)
    balance_amount = models.PositiveIntegerField(blank=True, default=0)
    received_date = models.DateField(blank=True, null=True)
    additional_info = models.CharField(max_length=200, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.product)

class vendorContactList(models.Model):
    """
    This class is used to create a model for the vendor contact list.
    """
    phone_regex = RegexValidator(
                    regex=r'^\d{10}$',
                    message="Phone number must be positive intergers.Up to 10 digits allowed."
                )
    service = models.CharField(max_length=50)
    vendor_name = models.CharField(max_length=100)
    contact_no = models.CharField(validators=[phone_regex], max_length=10)
    alternate_no = models.CharField(validators=[phone_regex],
                                    max_length=10,
                                    blank=True,
                                    null=True
                                    )
    nominal_charges = models.PositiveIntegerField(null=True, blank=True)
    aditional_info = models.CharField(max_length=200, blank=True, null=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.service)


class repairServices(models.Model):
    """
    This class is used to create a model for the repair service.
    """
    service_date = models.DateField()
    service_of = models.ForeignKey(vendorContactList, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=50)
    charges = models.PositiveIntegerField()
    vendor_name = models.CharField(max_length=50)
    contact_no = models.CharField(max_length=10)
    paid_by = models.CharField(max_length=50)
    payment_mode = models.CharField(max_length=50, choices=payment_mode_choices)
    next_service_date = models.DateField()
    aditional_info = models.CharField(max_length=200, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.service_of)


class t_shirt_inventory(models.Model):
    """
    This class is used to create a model for the t-short inventory.
    """
    order_date = models.DateField()
    receiving_date = models.DateField(blank=True, null=True)
    size = models.CharField(max_length=50, choices=t_shirt_sizes)
    previous_stock = models.PositiveIntegerField()
    ordered_quantity = models.PositiveIntegerField(default=0)
    received_quantity = models.PositiveIntegerField(default=0)
    error_message = models.CharField(max_length=500, blank=True, null=True, default=None)
    total_quantity = models.PositiveIntegerField()
    allotted = models.PositiveIntegerField(default=0)
    remaining = models.PositiveIntegerField()
    amount = models.PositiveIntegerField()
    paid_by = models.CharField(max_length=50)
    additional = models.CharField(max_length=500, blank=True, null=True)
    user_name = models.CharField(max_length=50, default="Admin")
    history = HistoricalRecords()

    class Meta:
        """
        This class is used to create a meta class for the model..
        """
        ordering = ['-receiving_date']

class Detail_types(models.Model):
    """
    This class is used to create a model for the detail types.
    """
    detail_name = models.CharField(max_length=50)
    detail_id = models.IntegerField(primary_key=True)

    def __str__(self):
        return str(self.detail_name)

class engagementJoining(models.Model):
    """
    This class is used to create a model for the engagement joining.
    """
    employee_name = models.CharField(max_length=50)
    details = models.ForeignKey(Detail_types, on_delete=models.CASCADE)
    joining_date = models.DateField(blank=True, null=True)
    last_working_date = models.DateField(blank=True, null=True)
    loi = models.CharField(max_length=100, blank=True)
    offer_letter = models.CharField(max_length=100, blank=True)
    nda_signed = models.CharField(max_length=100)
    joining_letter = models.CharField(max_length=100, blank=True)
    joining_documents = models.CharField(max_length=100, blank=True)
    joining_hamper = models.CharField(max_length=100, blank=True)
    relieving_letter = models.CharField(max_length=100, blank=True)
    experience_letter = models.CharField(max_length=100, blank=True)
    laptop_charger = models.CharField(max_length=100)
    mouse_mousepad = models.CharField(max_length=100)
    bag = models.CharField(max_length=100)
    id_card = models.CharField(max_length=100, blank=True)
    induction = models.CharField(max_length=100, blank=True)
    add_to_cliq_channels = models.CharField(max_length=100, blank=True)
    add_to_whatsapp_group = models.CharField(max_length=100, blank=True)
    remove_from_cliq_channels = models.CharField(max_length=100, blank=True)
    remove_from_whatsapp_group = models.CharField(max_length=100, blank=True)
    onedrive_access = models.CharField(max_length=100)
    microsoft_account_created = models.CharField(max_length=100, blank=True)
    microsoft_account_deleted = models.CharField(max_length=100, blank=True)
    gmail_account = models.CharField(max_length=100)
    cliq_id = models.CharField(max_length=100)
    system_configuration = models.CharField(max_length=100, blank=True)
    system_format = models.CharField(max_length=100, blank=True)
    email_account = models.CharField(max_length=100)
    add_upwork_account_to_team = models.CharField(max_length=100, blank=True)
    add_upwork_account = models.CharField(max_length=100, blank=True)
    remove_upwork_account_from_team = models.CharField(max_length=100, blank=True)
    close_upwork_account = models.CharField(max_length=100, blank=True)
    fnf = models.CharField(max_length=100, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.employee_name)


class officeEvents(models.Model):
    """
    This class is used to create a model for the office events.
    """
    date = models.DateField()
    event_name = models.CharField(max_length=100)
    activity_planned = models.CharField(max_length=100, blank=True)
    item = models.JSONField(max_length=100, blank=True, null=True)
    food = models.JSONField(max_length=100, blank=True, null=True)
    paid_by = models.CharField(max_length=50)
    remarks = models.CharField(max_length=200, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.event_name)
