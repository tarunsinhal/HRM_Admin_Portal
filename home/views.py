from operations.models import t_shirt_inventory, recurringItems, engagementJoining
from django.http.response import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control, never_cache
from datetime import datetime, timedelta, date
from .models import notifications
from .serializers import UpdateUserSerializer, UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .forms import UpdateUserForm
from django.db.models import Q
from django.urls import resolve
from django.contrib.auth.models import Permission


@login_required(login_url='/auth/login')
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def home_view(request):
    return render(request, 'home/dashboard.html')


# To fetch the notifications from differnt modules depending on certain conditions
@login_required(login_url='/auth/login')
def get_noitications(request):
    
    # print('url_name:-', resolve(request.path_info))

    time_threshold = date.today() + timedelta(days=1)
    n = list(notifications.objects.values('item_id', 'notification_type'))
    item_ids = [(i['item_id'], i['notification_type']) for i in n]

    # filtering from the DB where next order date is less than or equal to time threshold
    q = recurringItems.objects.filter(next_order_date__lte=time_threshold.strftime('%Y-%m-%d')).values('id', 'product__product_name', 'next_order_date')  
    
    # creating the list of notifications objects and if that notification is already in notification table or not
    notification_json = [notifications(product=i['product__product_name'], item_id=i['id'], notification_date=(i['next_order_date']-timedelta(days=1)).strftime('%Y-%m-%d'),
                        is_visited=False, notification_type=1) for i in q if (i['id'], 1) not in item_ids]

    try:
        # getting the latest record's receiving date from the tshirt inventory model
        tshirt_qs = t_shirt_inventory.objects.values_list().order_by('-receiving_date').values('receiving_date')[0]

        # filering the records based on conditions from the tshirt inventory model
        qs = t_shirt_inventory.objects.filter(receiving_date=tshirt_qs['receiving_date'].strftime('%Y-%m-%d'), remaining__lte=2).values('id', 'size', 'remaining')
        for i in qs:
            if (i['id'], 2) not in item_ids:
                notification_json.append(notifications(product='T-shirt'+'-'+ i['size'], item_id=i['id'], notification_date=date.today(),
                is_visited=False, notification_type=2))
    except:
        pass

    try:
        time_threshold_2 = date.today() - timedelta(days=7)
        # filering the records based on conditions from the tshirt inventory model
        egmtjoin = engagementJoining.objects.filter(joining_date=time_threshold_2.strftime('%Y-%m-%d')).values('id', 'employee_name', 'details__detail_name')
       
        for i in range(len(egmtjoin)):
            empData = engagementJoining.objects.filter(Q(offer_letter='')|Q(joining_letter='')|Q(joining_documents='')|Q(joining_hamper='')|Q(id_card='')|Q(induction='')|Q(loi='')|Q(add_to_skype_group='')|Q(add_to_whatsapp_group='')|Q(system_configuration='')|Q(add_upwork_account_to_team='')|Q(add_upwork_account=''), id=egmtjoin[i]['id']).values('offer_letter', 'joining_letter', 'joining_documents', 'joining_hamper', 'id_card', 'induction', 'loi', 'add_to_skype_group', 'add_to_whatsapp_group', 'system_configuration', 'add_upwork_account_to_team', 'add_upwork_account')
            if empData:
                if (egmtjoin[i]['id'], 3) not in item_ids:
                    notification_json.append(notifications(product=(egmtjoin[i]['details__detail_name'] +' of '+ egmtjoin[i]['employee_name']), item_id=egmtjoin[i]['id'], notification_date=(date.today()),
                    is_visited=False, notification_type=3))

        egmtexit = engagementJoining.objects.filter(last_working_date=time_threshold_2.strftime('%Y-%m-%d')).values('id', 'employee_name', 'details__detail_name')
       
        for i in range(len(egmtexit)):
            empData = engagementJoining.objects.filter(Q(relieving_letter='')|Q(experience_letter='')|Q(id_card='')|Q(remove_from_skype_group='')|Q(remove_from_whatsapp_group='')|Q(fnf='')|Q(system_format='')|Q(remove_upwork_account_from_team='')|Q(close_upwork_account=''), id=egmtexit[i]['id']).values('relieving_letter', 'experience_letter', 'id_card', 'remove_from_skype_group', 'remove_from_whatsapp_group', 'fnf', 'system_format', 'remove_upwork_account_from_team', 'close_upwork_account')
            if empData:
                if (egmtexit[i]['id'], 3) not in item_ids:
                    notification_json.append(notifications(product=(egmtexit[i]['details__detail_name'] +' of '+ egmtexit[i]['employee_name']), item_id=egmtexit[i]['id'], notification_date=(date.today()),
                    is_visited=False, notification_type=3))
    except:
        pass
    
    # bulk creating notifications from notification json in notifications table
    entries = notifications.objects.bulk_create(notification_json)
    return JsonResponse(notification_json, safe=False)


# To get the active notifications count from notification table
@login_required(login_url='/auth/login')
def get_active_notifications(request):

    # filtering the data from notifications table which has not been visited to get the active notifications count
    n = list(notifications.objects.filter(is_visited=False))

    if len(n) > 0 and len(n) <= 9:
        return JsonResponse({'notification_count': len(n)})
    elif len(n) > 9:
        return JsonResponse({'notification_count': '9+'})
    else:
        return JsonResponse({'notification_count': ''})


# For showing the last 7 days notifications on the notification page 
@login_required(login_url='/auth/login') 
def notifications_view(request):

    time_threshold = date.today() - timedelta(days=7)

    # creating list of last 7 days notifications from notification table to display on notifications page
    n = list(notifications.objects.filter(Q(is_visited=False)|Q(notification_date__gte=time_threshold.strftime('%Y-%m-%d'))))

    selectionQuery = notifications.objects.filter(is_visited=False)

    # updating the is_visited parameter of notifications to True when the user visits the notification page
    selectionQuery.update(is_visited=True)
    return render(request, 'home/notifications.html', {'notifications': n})


# For showing all the notification that has been received till date
@login_required(login_url='/auth/login')
def all_notifications(request):
    # ordering all the notifications based on the notification date
    n = notifications.objects.all().order_by('-notification_date').values()
    return render(request, 'home/all_notifications.html', {'notifications': n})


@login_required(login_url='/auth/login')
def profile(request):
    updateUserForm = UpdateUserForm()
    serializer = UserSerializer
    if request.method == "GET":
        all_users = User.objects.all()
        serializer = UserSerializer(all_users, many=True)
    return render(request, 'home/manage_users.html', {
        'all_users': serializer.data, 'updateUserForm': updateUserForm})


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


# def send_email(request):
#     email_form = SendEmail()
#     if request.method == "POST":
#         email_form = SendEmail(request.POST)
#         recipient = [str(email_form['email'].value())]
#         subject = str(email_form['subject'].value())
#         message = str(email_form['message'].value())
#         send_mail(subject,message,EMAIL_HOST_USER,[recipient],fail_silently=False)
#         return render(request, 'home/success_email.html', {'recipient': recipient})
#     return render(request, 'home/email_form.html', {'form':email_form})
