from django.contrib import admin
from .models import FoodInventory, Item_types

# Register your models here.
admin.site.register(FoodInventory)
admin.site.register(Item_types)