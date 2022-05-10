"""
This is the urls.py file for the Admin_portal app.
"""

from django.contrib import admin
from django.urls import path, re_path
from django.urls.conf import include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponseRedirect

urlpatterns = [
    re_path(r'^webpush/', include('webpush.urls')),
    path('admin/', admin.site.urls),
    path("",lambda request:HttpResponseRedirect('/home/')),
    path('auth/', include('authentication.urls')),
    path('home/', include('home.urls')),
    path('operations/', include('operations.urls')),
    path('IT_Infra/', include('IT_Infra.urls')),
    path("select2/", include("django_select2.urls")),
    path("suggestions/", include("suggestions.urls")),
    path('bills_and_reimbursement/', include('bills_and_reimbursement.urls')),
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'home.views.error_404_view'   # pylint: disable=invalid-name
