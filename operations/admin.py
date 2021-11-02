from django.contrib import admin
from .models import Item_types, Product_type, recurringItems, AdhocItems, vendorContactList, repairServices

# Register your models here.
# admin.site.register(FoodInventory)
admin.site.register(Item_types)
admin.site.register(Product_type)
admin.site.register(recurringItems)
admin.site.register(AdhocItems)
admin.site.register(vendorContactList)
admin.site.register(repairServices)