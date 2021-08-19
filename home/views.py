from django.http.response import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control, never_cache
from datetime import datetime, timedelta, date
from .models import notifications
from operations.models import recurringItems
from .serializers import UpdateUserSerializer, UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


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
    q = recurringItems.objects.filter(next_order_date=time_threshold.strftime('%Y-%m-%d')).values('id',
                                                                                                  'product__product_name')
    notification_json = [notifications(product=i['product__product_name'], item_id=i['id'],
                                       notification_date=date.today().strftime('%Y-%m-%d'),
                                       is_visited=False) for i in q if i['id'] not in item_ids]
    entries = notifications.objects.bulk_create(notification_json)
    return JsonResponse(notification_json, safe=False)


def get_active_notifications(request):
    n = list(notifications.objects.filter(is_visited=False))

    if len(n) > 0 and len(n) <= 9:
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


@login_required(login_url='/auth/login')
def profile(request):
    serializer = UserSerializer
    if request.method == "GET":
        all_users = User.objects.all()
        serializer = UserSerializer(all_users, many=True)
    return render(request, 'home/manage_users.html', {
        'all_users': serializer.data})


@api_view(['PUT'])
def profile_update(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # u_form = UpdateUserForm(request.POST)
        # p_form = ProfileUpdateForm(request.POST,
        #                            request.FILES,
        #                            instance=request.user.profile)
        # if u_form.is_valid():
        #     u_form.save()
        # p_form.save()
        # messages.success(request, f'Your account has been updated!')
        # return redirect('users:profile')

    # else:
    #     u_form = UpdateUserForm()
    # p_form = ProfileUpdateForm(instance=request.user.profile)

    # context = {
    #     'u_form': u_form,
    # 'p_form': p_form
    # }

    # return render(request, 'users/profile_update.html', context)


@api_view(['POST'])
def delete_user(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return Response({}, status=201)


def add_permission(request):
    return render(request, 'home/add_permissions.html')
