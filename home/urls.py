from django.urls import path
from . import views

app_name = 'home'
urlpatterns = [
    path('', views.home_view, name='home_view'),
    path('notifications/', views.notifications_view, name='notifications'),
    path('ajax/get_notifications', views.get_noitications, name="get_notifications"),
    path('ajax/get_notifications_count', views.get_active_notifications, name="active_notifications"),

    path('profile/', views.profile, name='profile'),
    path('profile/update/<str:pk>', views.profile_update, name='user_update'),

    path('profile/delete/<str:pk>', views.delete_user, name='user_delete'),
    path('user/permissions', views.add_permission, name='add_permissions'),

]