from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

app_name = 'IT_Infra'

urlpatterns = [
    path('', views.it_infra_view, name="it_infra"),
    path('inventory/', views.it_inventory_view, name="it_inventory"),
    path('allotment/', views.it_allotment_view, name="it_allotment"),
    path('allotment/add', views.it_allotment_add_view, name="addAllotment"),
    path('inventory/add', views.add_inventory, name="addInventory"),
    path('inventory/edit/<str:pk>', views.edit_inventory, name="editInventory"),
    path('allotment/edit/<str:pk>', views.it_allotment_edit_view, name="editAllotment"),
    path('inventory/delete/<str:pk>', views.delete_inventory, name="deleteInventory"),
    path('allotment/delete/<str:pk>', views.delete_allotment, name="deleteAllotment"),
    # path('inventory/history', views.inventory_history, name="inventoryHistory"),
    path('ajax/load-previous-inventoryHistory-data', views.load_previous_inventory_history, name="ajax_load_previous_inventory_history"),
    path('ajax/load-inventory-row-data', views.inventory_row_history, name='inventory_row_history'),
    path('ajax/load-previous-allotmentHistory-data', views.load_previous_allotment_history, name="ajax_load_previous_allotment_history"),
    path('ajax/load-allotment-row-data', views.allotment_row_history, name='allotment_row_history'),
    path('ajax/load-allotted-item-row-data', views.allotted_items_row_history, name="allotted_item_row_history"),
    path('ajax/load-previous-hardwareAllottedItem-row-data', views.load_previous_hardwareAllotted_item_history, name="ajax_load_hardwareAllotted_item_row_history"),
    path('ajax/load-previous-softwareAllottedItem-row-data', views.load_previous_softwareAllotted_item_history, name="ajax_load_softwareAllotted_item_row_history"),
    path('ajax/load_data', views.load_data, name="ajax_load_data"),
    path('ajax/load_employee_names', views.load_employee_names, name="ajax_load_employee_names"),
    # path('ajax/load_employee_data', views.load_employee_data, name="ajax_load_employee_data"),
    path('ajax/load_item_data', views.load_item_data, name="ajax_load_item_data"),
    path('ajax/load_item_name', views.load_item_name, name="ajax_load_item_name"),
    path('ajax/load_item_detials', views.load_item_details, name="ajax_load_item_details"),
    path('ajax/load_allotted_items', views.load_allotted_items, name='ajax_load_allotted_items'),
    path('ajax/load_edit_allotment_details', views.load_edit_allotment_details, name='ajax_edit_allotment_details'),
    path('ajax/load_edit_damage_images', views.load_edit_images, name='ajax_edit_damage_images')
] 


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
