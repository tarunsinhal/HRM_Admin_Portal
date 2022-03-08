import webbrowser
from operations.models import t_shirt_inventory, recurringItems, engagementJoining
from django.http.response import JsonResponse
from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.cache import cache_control
from datetime import  timedelta, date
from .models import notifications
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from .forms import UpdateUserForm
from django.db.models import Q
from authentication.forms import RegistrationForm
from django.contrib import messages
from django.contrib.auth.models import Group
from django.core import serializers
import json
from django.urls import resolve
from django.contrib.auth.models import Permission
import webbrowser
from win10toast_click import ToastNotifier

def open_notification():
    webbrowser.open('http://localhost:8000/home/notifications/')

@login_required(login_url='/auth/login')
def desktop_notification(request):
    toaster = ToastNotifier()
    n = list(notifications.objects.filter(is_visited=False))
    if len(n) > 0:
        toaster.show_toast('Notification for Admin portal!',
            'Click notification and view the notification related to what.',
            icon_path = 'media/logo.svg',
            duration=5,
            threaded=True,
            callback_on_click=open_notification)


@login_required(login_url='/auth/login')
@cache_control(no_cache=True, must_revalidate=True, no_store=True)
def home_view(request):
    app_name = request.resolver_match.app_name
    if request.method == 'POST':
        fm = RegistrationForm(request.POST)
        if fm.is_valid():
            fm.save()
            messages.success(request, 'User added successfully')
            return render(request, 'home/dashboard.html')
        else:
            messages.error(request,'User not added')
            return render(request, 'home/dashboard.html')
    form = RegistrationForm()
    return render(request, 'home/dashboard.html', {'form': form})


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
    # except:
    #     pass

    # try:
        time_threshold_2 = date.today() - timedelta(days=7)
        # filering the records based on conditions from the tshirt inventory model
        egmtjoin = engagementJoining.objects.filter(joining_date=time_threshold_2.strftime('%Y-%m-%d')).values('id', 'employee_name', 'details__detail_name')
        
        for i in range(len(egmtjoin)):
            empDataJoin = engagementJoining.objects.filter(Q(offer_letter='')|Q(joining_letter='')|Q(joining_documents='')|Q(joining_hamper='')|Q(id_card='')|Q(induction='')|Q(loi='')|Q(add_to_skype_group='')|Q(add_to_whatsapp_group='')|Q(system_configuration='')|Q(add_upwork_account_to_team='')|Q(add_upwork_account=''), id=egmtjoin[i]['id']).values('offer_letter', 'joining_letter', 'joining_documents', 'joining_hamper', 'id_card', 'induction', 'loi', 'add_to_skype_group', 'add_to_whatsapp_group', 'system_configuration', 'add_upwork_account_to_team', 'add_upwork_account')
            if empDataJoin:
                if (egmtjoin[i]['id'], 3) not in item_ids:
                    notification_json.append(notifications(product=(egmtjoin[i]['details__detail_name'] +' of '+ egmtjoin[i]['employee_name']), item_id=egmtjoin[i]['id'], notification_date=(date.today()),
                    is_visited=False, notification_type=3))

        egmtexit = engagementJoining.objects.filter(last_working_date=time_threshold_2.strftime('%Y-%m-%d')).values('id', 'employee_name', 'details__detail_name')
        
        for i in range(len(egmtexit)):
            empDataExit = engagementJoining.objects.filter(Q(relieving_letter='')|Q(experience_letter='')|Q(id_card='')|Q(remove_from_skype_group='')|Q(remove_from_whatsapp_group='')|Q(fnf='')|Q(system_format='')|Q(remove_upwork_account_from_team='')|Q(close_upwork_account=''), id=egmtexit[i]['id']).values('relieving_letter', 'experience_letter', 'id_card', 'remove_from_skype_group', 'remove_from_whatsapp_group', 'fnf', 'system_format', 'remove_upwork_account_from_team', 'close_upwork_account')
            if empDataExit:
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
    all_users = User.objects.all()
    updateform = UpdateUserForm()
    return render(request, 'home/manage_users.html', {'all_users': all_users,'updateform':updateform})



def profile_update(request, pk):
    user = User.objects.get(pk=pk)
    if request.method == "POST":
        form = UpdateUserForm(request.POST, instance=user)
        if form.is_valid():
            form.save()
            return redirect('/home/profile/update/'+str(pk))
    else:
        form = UpdateUserForm(instance=user)
    return render(request, 'home/profile_update.html', {'form': form})
    


@api_view(['GET'])
def delete_user(request, pk):
    user = User.objects.get(id=pk)
    user.delete()
    return redirect('home:profile')


def permissions(request,pk):
    if request.method=="POST":
        user = User.objects.get(id=pk)
        data = (json.loads(request.body.decode('utf-8')))
        user.groups.clear() 
        for group in data:
            group = Group.objects.get(name=group)
            user.groups.add(group)
        return redirect('home:profile')
    else:
        all_groups = Group.objects.all()
        assigned_groups = User.objects.get(id=pk).groups.all()
        return JsonResponse({'all_groups': serializers.serialize('json', all_groups),
                                'assigned_groups': serializers.serialize('json', assigned_groups)})
    



def access_denied(request):
    return render(request, 'home/access_denied.html')

def error_404_view(request,exception):
    return render(request, 'home/404.html')