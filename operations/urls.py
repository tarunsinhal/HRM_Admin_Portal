from django.urls import path
from . import views
from django.contrib.auth.decorators import permission_required

app_name = 'operations'
urlpatterns = [
    path('', views.operations_view, name='operations_view'),
    path('inventory/', views.inventory_view, name='inventory_view'),
    path('inventory/recurring/', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.inventory_recurring_view), name='inventory_recurring'),
    path('inventory/recurring/history', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.inventory_recurring_history), name='inventory_recurring_history'),
    path('inventory/recurring/addProducts', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.addProducts), name='addProducts'),
    path('inventory/recurring/edit/<str:pk>', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.editProducts), name='editProducts'),
    path('inventory/recurring/delete/<str:pk>', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.deleteProducts), name='deleteProducts'),
    path('inventory/recurring/import', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.ImportrecurringView.as_view()), name='import_recurring'),
    path('ajax/load-products/', views.load_products, name='ajax_load_products'),
    # path('ajax/inventory/recurring/addProducts', views.addProducts, name='addProducts'),
    path('ajax/load_purchase_date', views.load_purchase_date, name="ajax_load_purchase_date"),
    path('ajax/load-recurring-users/', views.load_recurring_users, name='ajax_load_recurring_users'),
    path('ajax/load-previous-recurring-data', views.load_previous_recurring_history, name="ajax_load_previous_recurring_history"),
    path('ajax/load-recurring-row-data', views.recurring_row_history, name='recurring_row_history'),
    path('inventory/adhoc/', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.inventory_adhoc_view), name='inventory_adhoc'),
    path('inventory/adhoc/history', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.inventory_adhoc_history), name='inventory_adhoc_history'),
    path('inventory/adhoc/add/', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.addAdhocProducts), name='add_adhoc_products'),
    path('inventory/adhoc/edit/<str:pk>', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.editAdhocProducts), name='edit_adhoc_products'),
    path('inventory/adhoc/delete/<str:pk>', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.deleteAdhocProducts), name='delete_adhoc_products'),
    path('inventory/adhoc/import', permission_required('operations.view_item_types', login_url='/home/access_denied')(views.ImportadhocView.as_view()), name='import_adhoc'),
    path('ajax/load-adhoc-users/', views.load_adhoc_users, name='ajax_load_adhoc_users'),
    path('ajax/load-previous-adhoc-data', views.load_previous_adhoc_history, name="ajax_load_previous_adhoc_history"),
    path('ajax/load-adhoc-row-data', views.adhoc_row_history, name='adhoc_row_history'),
    path('MRO/', views.mro_view, name='mro_view'),
    path('ajax/load-mro-users/', views.load_mro_users, name='ajax_load_mro_users'),
    path('MRO/maintenance_vendor/', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.mro_maintenance_vendor), name="mro_maintenance_vendor"),
    path('MRO/maintenance_vendor/history', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.mro_vendor_history), name="mro_vendor_history"),
    path('MRO/maintenance_vendor/addVendor', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.addVendor), name="addVendor"),
    path('MRO/maintenance_vendor/edit/<str:pk>', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.editVendor), name="editVendor"),
    path('MRO/maintenance_vendor/delete/<str:pk>', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.deleteVendor), name="deleteVendor"),
    path('MRO/maintenance_vendor/import', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.ImportvendorView.as_view()), name='import_vendor'),
    path('ajax/load-vendor/', views.load_vendor, name='ajax_load_vendor'),
    path('ajax/load-vendor-no/', views.load_vendor_no, name='ajax_load_vendor_no'),
    path('ajax/load-previous-vendor-data', views.load_previous_vendor_history, name="ajax_load_previous_vendor_history"),
    path('ajax/load-vendor-row-data', views.vendor_row_history, name='vendor_row_history'),
    path('MRO/maintenance_service/', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.mro_maintenance_service), name="mro_maintenance_service"),
    path('MRO/maintenance_service/history', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.mro_service_history), name="mro_service_history"),
    path('MRO/maintenance_service/addRepairServices', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.addRepairServices), name="addRepairServices"),
    path('MRO/maintenance_service/edit/<str:pk>', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.editRepairServices), name="editRepairServices"),
    path('MRO/maintenance_service/delete/<str:pk>', permission_required('operations.view_vendorcontactlist', login_url='/home/access_denied')(views.deleteRepairServices), name="deleteRepairServices"),
    path('ajax/load-previous-service-data', (views.load_previous_service_history), name="ajax_load_previous_service_history"),
    path('ajax/load-service-row-data', views.service_row_history, name='service_row_history'),
    path('engagements/',views.engagements_view, name='engagements_view'),
    path('engagements/tshirt_inventory',permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.engagements_Tshirt_view), name='tshirt_inventory'),
    path('engagements/tshirt_inventory/addTshirt', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.addTshirt), name='addTshirts'),
    path('engagements/tshirt_inventory/edit', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.editTshirt), name='editTshirts'),
    path('engagements/tshirt_inventory/delete', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.deleteTshirt), name='deleteTshirts'),
    path('engagements/tshirt_inventory/history', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.tshirt_history), name='tshirt_history'),
    path('engagements/tshirt_inventory/import', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.ImportTshirtView.as_view()), name='import_tshirt'),
    path('ajax/load-tshirt-data', views.load_tshirt_edit_data, name="ajax_load_tshirtData"),
    path('ajax/load-previous-history-data', views.load_previous_tshirt_history, name="ajax_load_previous_tshirt_history"),
    path('ajax/load-tshirt-inventory-users/', views.load_tshirt_inventory_users, name='ajax_load_tshirt_inventory_users'),
    path('ajax/load-tshirt-row-data', views.tshirt_row_history, name='tshirt_row_history'),
    path('ajax/load-tshirt-row-deleted-data', views.tshirt_row_deleted_history, name='tshirt_row_deleted_history'),
    path('engagements/Boarding', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.engagements_on_off_boarding_view), name='Boarding'),
    path('engagements/Boarding/history', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.enagagements_boarding_history), name='Boarding_history'),
    path('engagements/Boarding/addJoining', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.addJoining), name='addJoining'),
    path('engagements/Boarding/edit/<str:pk>', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.editJoining), name='editJoining'),
    path('engagements/Boarding/delete/<str:pk>', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.deleteJoining), name='deleteJoining'),
    path('engagements/Boarding/import-joining', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.ImportJoiningView.as_view()), name='import_joining'),
    path('engagements/Boarding/import-exit', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.ImportExitView.as_view()), name='import_exit'),
    path('ajax/load-previous-engagements-data', views.load_previous_engagements_history, name="ajax_load_previous_engagements_history"),
    path('ajax/load-boarding-row-data', views.boarding_row_history, name='boarding_row_history'),
    path('engagements/officeEvents', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.office_events_view), name="officeEvents"),
    path('ajax/load-officeEvents-users/', views.load_officeEvents_users, name='ajax_load_officeEvents_users'),
    path('engagements/officeEvents/addOfficeEvents', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.addOfficeEvents), name='addOfficeEvents'),
    path('engagements/officeEvents/edit/<str:pk>', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.editOfficeEvents), name="editOfficeEvents"),
    path('engagements/officeEvents/delete/<str:pk>', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.deleteOfficeEvents), name="deleteOfficeEvents"),
    path('engagements/officeEvents/import', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.ImportOfficeEventsView.as_view()), name='import_officeEvents'),
    path('engagements/officeEvents/export', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.export_csv), name='export_csv'),
    path('engagements/officeEvents/history', permission_required('operations.add_t_shirt_inventory', login_url='/home/access_denied')(views.enagagements_officeEvents_history), name='officeEvents_history'),
    path('ajax/load-events-name', views.load_events_name, name="ajax_load_eventsName"),
    path('ajax/load-previous-officeEvents-data', views.load_previous_officeEvents_history, name="ajax_load_previous_officeEvents_history"),
    path('ajax/load-officeEvents-row-data', views.officeEvents_row_history, name="officeEvents_row_history"),
]