from django.urls import path
from . import views

app_name = 'IT_Infra'

urlpatterns = [
    path('', views.it_infra_view, name="it_infra"),
    path('inventory/', views.it_inventory_view, name="it_inventory"),
    path('allotment/', views.it_allotment_view, name="it_allotment"),
    path('allotment/add', views.it_allotment_add_view, name="addAllotment"),
    path('inventory/add', views.add_inventory, name="addInventory"),
    path('inventory/edit/<str:pk>', views.edit_inventory, name="editInventory"),
    path('inventory/delete/<str:pk>', views.delete_inventory, name="deleteInventory"),
    path('inventory/history', views.inventory_history, name="inventoryHistory"),
    path('ajax/load-previous-history-data', views.load_previous_inventory_history, name="ajax_load_previous_history"),
    path('ajax/load_data', views.load_data, name="ajax_load_data"),
    path('ajax/load_employee_code', views.load_employee_code, name="ajax_load_employee_code"),
    # path('ajax/load_employee_data', views.load_employee_data, name="ajax_load_employee_data"),
    path('ajax/load_item_data', views.load_item_data, name="ajax_load_item_data"),
    path('ajax/load_item_name', views.load_item_name, name="ajax_load_item_name"),
    path('ajax/load_item_detials', views.load_item_details, name="ajax_load_item_details"),
    path('ajax/load_allotted_items', views.load_allotted_items, name='ajax_load_allotted_items'),
    path('ajax/load_edit_allotment_details', views.load_edit_allotment_details, name='ajax_edit_allotment_details')
]