from django.urls import path
from . import views

app_name = 'home'
urlpatterns = [
    path('', views.home_view, name='home_view'),
    path("access_denied/", views.access_denied, name="access_denied"),
    path('notifications/', views.notifications_view, name='notifications'),
    path('notifications/all', views.all_notifications, name='all_notifications'),
    path('ajax/get_notifications', views.get_noitications, name="get_notifications"),
    # path('ajax/desktop_notification', views.desktop_notification, name="desktop_notification"),
    path('ajax/get_notifications_count', views.get_active_notifications, name="active_notifications"),

    path('profile/', views.profile, name='profile'),
    path('profile/update/<str:pk>', views.profile_update, name='user_update'),

    path('profile/delete/<str:pk>', views.delete_user, name='user_delete'),
    path('profile/permissions/<str:pk>', views.permissions, name='permissions'),

    path('access_denied/', views.access_denied, name='access_denied'),


]