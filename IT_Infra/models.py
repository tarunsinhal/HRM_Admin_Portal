from distutils.command.upload import upload
import re
from django.db import models
from django.db.models.base import Model
from pandas.core.algorithms import mode
from simple_history.models import HistoricalRecords
from django.db import connection
from django.template.defaultfilters import slugify


def custom_sql():
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM (SELECT DISTINCT(employee_code) FROM hrm.employee) AS ed WHERE ed.employee_code NOT IN (SELECt DISTINCT(employee_id) FROM admin_portal.it_infra_it_allotment)")
    row = cursor.fetchall()
    final_row = []
    for i in row:
        final_row.append((i[0], i[0]))
    return final_row


def employee_id_sql():
    cursor = connection.cursor()
    cursor.execute("SELECT DISTINCT(allottee_id) FROM admin_portal.it_infra_it_inventory")
    row = cursor.fetchall()
    final_row = []
    for i in row:
        final_row.append((i[0], i[0]))
    return final_row


class it_inventory_type(models.Model):
    type = models.CharField(max_length=50)
    type_id = models.IntegerField()

    def __str__(self):
        return str(self.type)
    

class it_inventory_item(models.Model):
    item = models.CharField(max_length=100)
    type = models.ForeignKey(it_inventory_type, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.item)


class it_inventory_status(models.Model):
    status = models.CharField(max_length=50)
    status_id = models.IntegerField()

    def __str__(self):
        return str(self.status)


class it_inventory(models.Model):
    type = models.ForeignKey(it_inventory_type, on_delete=models.CASCADE)
    item = models.ForeignKey(it_inventory_item, on_delete=models.CASCADE)
    details = models.CharField(max_length=500)
    name = models.CharField(max_length=50)
    purchase_type = models.CharField(max_length=100)
    status = models.ForeignKey(it_inventory_status, on_delete=models.CASCADE, default=2)
    allottee_id = models.CharField(max_length=50, null=True, blank=True)
    allotte_name = models.CharField(max_length=50, null=True, blank=True)
    remarks = models.CharField(max_length=500, blank=True, null=True)
    system_names = models.CharField(null=True, blank=True, max_length=1000)
    validity_start_date = models.DateField(null=True, blank=True)
    validity_end_date = models.DateField(null=True, blank=True)
    history = HistoricalRecords()

    def __str__(self):
        return str(self.name)
    

class it_allotment(models.Model):
    employee_id = models.CharField(max_length=50)
    employee_name = models.CharField(max_length=50)
    office_365_Id = models.EmailField(max_length=100, null=True, blank=True)
    official_email = models.EmailField(max_length=50, null=True, blank=True)
    microsoft_email = models.EmailField(max_length=50, null=True, blank=True)
    microsoft_email_password = models.CharField(max_length=50, null=True, blank=True)
    skype_email = models.EmailField(max_length=50, null=True, blank=True)
    skype_email_password = models.CharField(max_length=50, null=True, blank=True)
    damage = models.CharField(max_length=500, null=True, blank=True)
    # images_for_damage = models.FileField(upload_to='media/', null=True, blank=True)
    remarks = models.CharField(max_length=500, null=True, blank=True)


class hardware_allotted_items(models.Model):
    item = models.ForeignKey(it_inventory_item, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50)
    employee_name = models.CharField(max_length=50)
    item_name = models.ForeignKey(it_inventory, on_delete=models.CASCADE)
    details = models.CharField(max_length=500)
    additional = models.CharField(max_length=500, null=True, blank=True)
    status = models.ForeignKey(it_inventory_status, on_delete=models.CASCADE)


class software_allotted_items(models.Model):
    item = models.ForeignKey(it_inventory_item, on_delete=models.CASCADE)
    employee_id = models.CharField(max_length=50)
    employee_name = models.CharField(max_length=50)
    item_name = models.ForeignKey(it_inventory, on_delete=models.CASCADE)
    details = models.CharField(max_length=500)
    validity_start_date = models.DateField()
    validity_end_date = models.DateField()
    additional = models.CharField(max_length=500, null=True, blank=True)
    status = models.ForeignKey(it_inventory_status, on_delete=models.CASCADE)


def get_image_filename(instance, filename):
    title = instance.allotment.employee_id
    slug = slugify(title)
    return "post_images/%s-%s" % (slug, filename)  


class damage_images(models.Model):
    allotment = models.ForeignKey(it_allotment, on_delete=models.CASCADE)
    images_for_damage = models.ImageField(upload_to=get_image_filename, null=True, blank=True)

