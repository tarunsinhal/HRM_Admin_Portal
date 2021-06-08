from django.urls import path
from . import views

app_name = 'operations'
urlpatterns = [
    path('', views.operations_view, name='operations_view'),
    path('food/', views.food_view, name='food')
]