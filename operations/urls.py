from django.urls import path
from . import views

app_name = 'operations'
urlpatterns = [
    path('', views.operations_view, name='operations_view'),
    path('food/', views.food_view, name='food'),
    # path('food/', views.IndexView.as_view(), name='food'),
    path('maintenance/', views.maintenance_view, name="maintenance"),
    path('food/getProducts', views.getProducts, name='getProducts'),
    path('food/addProducts', views.addProducts, name='addProducts'),
    path('food/edit/<str:pk>', views.editProducts, name='editProducts'),
    path('food/delete/<str:pk>', views.deleteProducts, name='deleteProducts'),
    path('ajax/load-products/', views.load_products, name='ajax_load_products'),
    # path('ajax/food/addProducts', views.addProducts, name='addProducts'),

]