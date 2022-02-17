from django.urls import path
from . import views

app_name = 'suggestion123'

urlpatterns = [
    path('',views.suggestion,name='suggestion'),
    path('all/',views.suggestion_list,name='suggestionall'),
]