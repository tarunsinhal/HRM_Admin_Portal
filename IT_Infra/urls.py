from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import permission_required
app_name = 'IT_Infra'

urlpatterns = [
    path('', views.it_infra_view, name="it_infra"),
    path('inventory/', permission_required('IT_Infra.view_it_inventory', login_url='/home/access_denied/')(views.it_inventory_view), name="it_inventory"),
    path('allotment/', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.it_allotment_view), name="it_allotment"),
    path('allotment/add', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.it_allotment_add_view), name="addAllotment"),
    path('inventory/add', permission_required('IT_Infra.view_it_inventory', login_url='/home/access_denied/')(views.add_inventory), name="addInventory"),
    path('inventory/edit/<str:pk>', permission_required('IT_Infra.view_it_inventory', login_url='/home/access_denied/')(views.edit_inventory), name="editInventory"),
    path('allotment/edit/<str:pk>', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.it_allotment_edit_view), name="editAllotment"),
    path('inventory/delete/<str:pk>', permission_required('IT_Infra.view_it_inventory', login_url='/home/access_denied/')(views.delete_inventory), name="deleteInventory"),
    path('allotment/delete/<str:pk>', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.delete_allotment), name="deleteAllotment"),
    # path('inventory/history', views.inventory_history, name="inventoryHistory"),
    path('ajax/load-previous-inventoryHistory-data', permission_required('IT_Infra.view_it_inventory', login_url='/home/access_denied/')(views.load_previous_inventory_history), name="ajax_load_previous_inventory_history"),
    path('ajax/load-inventory-row-data', permission_required('IT_Infra.view_it_inventory', login_url='/home/access_denied/')(views.inventory_row_history), name='inventory_row_history'),
    path('ajax/load-previous-allotmentHistory-data', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.load_previous_allotment_history), name="ajax_load_previous_allotment_history"),
    path('ajax/load-allotment-row-data', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.allotment_row_history), name='allotment_row_history'),
    path('ajax/load-allotted-item-row-data', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.allotted_items_row_history), name="allotted_item_row_history"),
    path('ajax/load-previous-hardwareAllottedItem-row-data', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.load_previous_hardwareAllotted_item_history), name="ajax_load_hardwareAllotted_item_row_history"),
    path('ajax/load-previous-softwareAllottedItem-row-data', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.load_previous_softwareAllotted_item_history), name="ajax_load_softwareAllotted_item_row_history"),
    path('ajax/load_data', views.load_data, name="ajax_load_data"),
    path('ajax/load_employee_names', views.load_employee_names, name="ajax_load_employee_names"),
    # path('ajax/load_employee_data', views.load_employee_data, name="ajax_load_employee_data"),
    path('ajax/load_item_data', views.load_item_data, name="ajax_load_item_data"),
    path('ajax/load_item_name', views.load_item_name, name="ajax_load_item_name"),
    path('ajax/load_item_detials', views.load_item_details, name="ajax_load_item_details"),
    path('ajax/load_allotted_items', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.load_allotted_items), name='ajax_load_allotted_items'),
    path('ajax/load_edit_allotment_details', permission_required('IT_Infra.view_it_allotment', login_url='/home/access_denied/')(views.load_edit_allotment_details), name='ajax_edit_allotment_details'),
    path('ajax/load_edit_damage_images', views.load_edit_images, name='ajax_edit_damage_images')
] 


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
