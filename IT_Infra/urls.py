from django.urls import path
from . import views

app_name = 'IT_Infra'

urlpatterns = [
    path('', views.it_infra_view, name="it_infra"),
    path('inventory/', views.it_inventory_view, name="it_inventory")
]