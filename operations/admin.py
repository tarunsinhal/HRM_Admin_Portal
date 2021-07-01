from django.contrib import admin
from .models import FoodInventory, Item_types, Product_type, recurringItems

# Register your models here.
admin.site.register(FoodInventory)
admin.site.register(Item_types)
admin.site.register(Product_type)
admin.site.register(recurringItems)