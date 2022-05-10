from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth.decorators import permission_required

app_name = 'bills_and_reimbursement'

urlpatterns = [
    path('', permission_required('bills_and_reimbursement.view_bills_reimburse', login_url='/home/access_denied/')(views.bills_and_reimbursement_view), name="bills_and_reimbursement_view"),
    path('user_bills_details/<str:user>', views.user_bills_details_view, name="user_bills_details_view"),
    path('ajax/load-data/', views.load_module_data, name='ajax_load_data'),
    path('ajax/images-data/', views.get_images, name='ajax_images_data'),
    path('user_bills_details/addStatus/<str:user>/<str:dateVal>/<str:startDate>/<str:endDate>', views.add_status_form, name="add_status_form"),
    path('user_bills_details/addImages/<str:user>/<str:dateVal>/<str:startDate>/<str:endDate>', views.add_images_form, name="add_images_form")
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)