from django.http.response import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control, never_cache
from datetime import datetime, timedelta, date
from .models import notifications
from operations.models import recurringItems

# Create your views here.

@login_required(login_url='/auth/login')
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def home_view(request):
    time_threshold = date.today() + timedelta(days=1)
    print(time_threshold)
    # recurringItems.objects.filter(next_order_date=time_threshold)
    return render(request, 'home/dashboard.html')


def get_noitications(request):
    
    time_threshold = date.today() + timedelta(days=1)
    n = list(notifications.objects.values('item_id'))
    print(n)
    item_ids = [i['item_id'] for i in n]
    print(item_ids)
    q = recurringItems.objects.filter(next_order_date=time_threshold.strftime('%Y-%m-%d')).values('id', 'product__product_name')  
    notification_json = [notifications(product=i['product__product_name'], item_id=i['id'], notification_date=date.today().strftime('%Y-%m-%d'),
                        is_visited=False) for i in q if i['id'] not in item_ids]
    entries = notifications.objects.bulk_create(notification_json)
    return JsonResponse(notification_json, safe=False)


def get_active_notifications(request):
    n = list(notifications.objects.filter(is_visited=False))

    if len(n) > 0 and len(n) <= 9 :
        return JsonResponse({'notification_count': len(n)})
    elif len(n) > 9:
        return JsonResponse({'notification_count': '9+'})
    else:
        return JsonResponse({'notification_count': ''})

def notifications_view(request):
    n = list(notifications.objects.values())

    selectionQuery = notifications.objects.filter(is_visited=False)
    selectionQuery.update(is_visited=True)
    return render(request, 'home/notifications.html', {'notifications': n})