from django.urls import path
from . import views

app_name = 'operations'
urlpatterns = [
    path('', views.operations_view, name='operations_view'),
    path('pantry/', views.pantry_view, name='pantry_view'),
    path('pantry/recurring/', views.pantry_recurring_view, name='pantry_recurring'),
    # path('food/', views.IndexView.as_view(), name='food'),
    path('MRO/', views.mro_view, name='mro_view'),
    path('MRO/recurring/', views.pantry_recurring_view, name='pantry_recurring'),
    path('engagements/', views.engagements_view, name='engagements_view'),
    path('maintenance/', views.maintenance_view, name="maintenance"),
    # path('food/getProducts', views.getProducts, name='getProducts'),
    path('food/addProducts', views.addProducts, name='addProducts'),
    path('food/edit/<str:pk>', views.editProducts, name='editProducts'),
    path('food/delete/<str:pk>', views.deleteProducts, name='deleteProducts'),
    path('ajax/load-products/', views.load_products, name='ajax_load_products'),
    path('ajax/food/addProducts', views.addProducts, name='addProducts'),
    path('ajax/load_purchase_date', views.load_purchase_date, name="ajax_load_purchase_date"),
]