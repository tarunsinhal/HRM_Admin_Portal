from django.urls import path
from . import views

app_name = 'operations'
urlpatterns = [
    path('', views.operations_view, name='operations_view'),
    path('pantry/', views.pantry_view, name='pantry_view'),
    path('pantry/recurring/', views.pantry_recurring_view, name='pantry_recurring'),
    path('pantry/adhoc/', views.pantry_adhoc_view, name='pantry_adhoc'),
    path('pantry/adhoc/add/', views.addAdhocProducts, name='add_adhoc_products'),
    path('pantry/adhoc/edit/<str:pk>', views.editAdhocProducts, name='edit_adhoc_products'),
    path('pantry/adhoc/delete/<str:pk>', views.deleteAdhocProducts, name='delete_adhoc_products'),

    # ------------------------------------------------------------------------------------
    path('pantry/dailyWeekly/', views.pantry_dailyWeekly_view, name='pantry_dailyWeekly'),
    path('pantry/dailyWeekly/addItems', views.addItems, name='addItems'),
    path('pantry/dailyWeekly/edit/<str:pk>', views.editItems, name='editItems'),
    path('pantry/dailyWeekly/delete/<str:pk>', views.deleteItems, name='deleteItems'),
    path('ajax/pantry/dailyWeekly/addItems', views.addItems, name='addItems'),
    path('ajax/load_purchase_date_only', views.load_purchase_date_only, name="ajax_load_purchase_date_only"),
    # ------------------------------------------------------------------------------------
    # path('food/', views.IndexView.as_view(), name='food'),
    path('MRO/', views.mro_view, name='mro_view'),
    path('MRO/recurring/', views.pantry_recurring_view, name='pantry_recurring'),
    path('engagements/', views.engagements_view, name='engagements_view'),
    path('MRO/maintenance_vendor/', views.mro_maintenance_vendor, name="mro_maintenance_vendor"),
    path('MRO/maintenance_vendor/addVendor', views.addVendor, name="addVendor"),
    path('MRO/maintenance_vendor/edit/<str:pk>', views.editVendor, name="editVendor"),
    path('MRO/maintenance_vendor/delete/<str:pk>', views.deleteVendor, name="deleteVendor"),
    path('MRO/maintenance_service/', views.mro_maintenance_service, name="mro_maintenance_service"),
    path('MRO/maintenance_service/addRepairServices', views.addRepairServices, name="addRepairServices"),
    path('MRO/maintenance_service/edit/<str:pk>', views.editRepairServices, name="editRepairServices"),
    path('MRO/maintenance_service/delete/<str:pk>', views.deleteRepairServices, name="deleteRepairServices"),
    path('ajax/load-vendor/', views.load_vendor, name='ajax_load_vendor'),
    path('ajax/load-vendor-no/', views.load_vendor_no, name='ajax_load_vendor_no'),
    # path('food/getProducts', views.getProducts, name='getProducts'),
    path('food/addProducts', views.addProducts, name='addProducts'),
    path('food/edit/<str:pk>', views.editProducts, name='editProducts'),
    path('food/delete/<str:pk>', views.deleteProducts, name='deleteProducts'),
    path('ajax/load-products/', views.load_products, name='ajax_load_products'),
    path('ajax/food/addProducts', views.addProducts, name='addProducts'),
    path('ajax/load_purchase_date', views.load_purchase_date, name="ajax_load_purchase_date"),
    path('ajax/load-users/', views.load_users, name='ajax_load_users'),
    path('ajax/load-paidby/', views.load_paid_by, name='ajax_load_paidby'),

]