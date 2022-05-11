from calendar import month
from multiprocessing.pool import IMapUnorderedIterator
import os
from .forms import BillsReimburseForm
from django.shortcuts import redirect, render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.decorators import login_required
from .models import bills_reimburse, bills_images
from django.contrib.auth.models import User
from itertools import chain
from operations.models import recurringItems, AdhocItems, t_shirt_inventory, officeEvents, repairServices
from IT_Infra.models import it_inventory
from datetime import datetime, date, timedelta
from django.http import JsonResponse, HttpResponse
from django.db.models import Sum


# view for users bills and reimbursement 
@login_required(login_url='/auth/login')
def bills_and_reimbursement_view(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_recurring = recurringItems.objects.all().values_list('paid_by', flat=True)
    paid_by_adhoc = AdhocItems.objects.all().values_list('paid_by', flat=True)
    paid_by_tshirt = t_shirt_inventory.objects.all().values_list('paid_by', flat=True)
    paid_by_event = officeEvents.objects.all().values_list('paid_by', flat=True)
    paid_by_repair = repairServices.objects.all().values_list('paid_by', flat=True)
    # paid_by_repair = it_inventory.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_recurring, paid_by_adhoc, paid_by_tshirt,paid_by_event, paid_by_repair))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    return render(request, 'bills_and_reimbursement/bills_and_reimbursement.html', {"Users": PAID_BY})


# view for user bills & reimbursement detailed information
@login_required(login_url='/auth/login')
def user_bills_details_view(request, user):
    startDate = request.GET.get('startDate')
    endDate = request.GET.get('endDate')
    bills_reimburse_form = BillsReimburseForm()
    if startDate and endDate:
        newStartDate = datetime.strptime(startDate, "%Y-%m")
        newDate = datetime.strptime(endDate, "%Y-%m")
        newEndDate = newDate + timedelta(days=30)
        resList = []

        recurringRes = recurringItems.objects.filter(purchase_date__gte=newStartDate, purchase_date__lte=newEndDate, paid_by=user).values_list('purchase_date', 'amount')  
        for data in  recurringRes:
            datadict = {}
            newdate = data[0].strftime("%B, %Y")
            datadict["date"] = newdate
            datadict["amount"] = data[1]
            resList.append(datadict)

        adhocRes = AdhocItems.objects.filter(purchase_date__gte=newStartDate, purchase_date__lte=newEndDate, paid_by=user).values_list('purchase_date', 'amount')
        for data in  adhocRes:
            datadict = {}
            newdate = data[0].strftime("%B, %Y")
            datadict["date"] = newdate
            datadict["amount"] = data[1]
            resList.append(datadict)

        mroRes = repairServices.objects.filter(service_date__gte=newStartDate, service_date__lte=newEndDate, paid_by=user).values_list('service_date', 'charges')
        for data in  mroRes:
            datadict = {}
            newdate = data[0].strftime("%B, %Y")
            datadict["date"] = newdate
            datadict["amount"] = data[1]
            resList.append(datadict)

        tshirtRes = t_shirt_inventory.objects.filter(order_date__gte=newStartDate, order_date__lte=newEndDate, paid_by=user).values_list('order_date', 'amount').distinct()
        for data in  tshirtRes:
            datadict = {}
            newdate = data[0].strftime("%B, %Y")
            datadict["date"] = newdate
            datadict["amount"] = data[1]
            resList.append(datadict)

        officeEventRes = officeEvents.objects.filter(date__gte=newStartDate, date__lte=newEndDate, paid_by=user).values_list('date', 'item', 'food')
        for data in  officeEventRes:
            datadict = {}
            itemvalsum = 0
            newdate = data[0].strftime("%B, %Y")
            for itemval in data[1].values():
                itemvalsum += int(itemval)
            for foodval in data[2].values():
                itemvalsum += int(foodval)
            datadict["date"] = newdate
            datadict["amount"] = itemvalsum
            resList.append(datadict)
        
        statusRes = bills_reimburse.objects.filter(date__gte=newStartDate, date__lte=newEndDate, user=user).values_list('date', 'reimburse_status')
        statusdict = {}
        for data in statusRes:
            newdate = data[0].strftime("%B, %Y")
            statusdict[newdate] = data[1]

        # itInventoryRes = it_inventory.objects.filter(purchase_date__gte=newStartDate, purchase_date__lte=newEndDate, paid_by=user).values_list('purchase_date', 'amount')  
        # for data in  itInventoryRes:
        #     datadict = {}
        #     newdate = data[0].strftime("%B, %Y")
        #     datadict["date"] = newdate
        #     datadict["amount"] = data[1]
        #     resList.append(datadict)

        fromDate = newStartDate.strftime("%Y-%m")
        toDate = newDate.strftime("%Y-%m")
        return render(request, 'bills_and_reimbursement/user_bills_details.html', {'resList': resList, 'user': user, 'statusdict': statusdict, 'startDate': startDate, 'endDate': endDate, 'billsReimburseForm': bills_reimburse_form, 'fromDate': fromDate, 'toDate': toDate})
    else: 
        resList = []
        return render(request, 'bills_and_reimbursement/user_bills_details.html', {'resList': resList, 'user': user, 'billsReimburseForm': bills_reimburse_form, 'startDate': startDate, 'endDate': endDate})


# view for fetching details for specific module
@login_required(login_url='/auth/login')
def load_module_data(request):
    moduleName = request.GET.get('moduleName')
    userName = request.GET.get('userName')
    dateData = request.GET.get('dateData')
    newDate = datetime.strptime(dateData, "%B, %Y")
    m = newDate.month 
    y = newDate.year

    if moduleName == "recurring":
        data = recurringItems.objects.filter(purchase_date__month=m, purchase_date__year=y, paid_by=userName).values_list('purchase_date', 'product__product_name', 'amount')
        amountSum = 0
        for val in data:
            amountSum += val[2]

    elif moduleName == "adhoc":
        data = AdhocItems.objects.filter(purchase_date__month=m, purchase_date__year=y, paid_by=userName).values_list('purchase_date', 'product', 'amount')
        amountSum = 0
        for val in data:
            amountSum += val[2]

    elif moduleName == "t-shirt":
        data = t_shirt_inventory.objects.filter(order_date__month=m, order_date__year=y, paid_by=userName).values_list('order_date', 'amount').distinct()
        amountSum = 0
        for val in data:
            amountSum += val[1]

    elif moduleName == "mro-repair/service":
        data = repairServices.objects.filter(service_date__month=m, service_date__year=y, paid_by=userName).values_list('service_date', 'service_of__service', 'charges')
        amountSum = 0
        for val in data:
            amountSum += val[2]
            
    elif moduleName == "office-events":
        data = officeEvents.objects.filter(date__month=m, date__year=y, paid_by=userName).values_list('date', 'item', 'food')
        amountSum = 0
        for dataVal in data:
            for Val in dataVal:
                if type(Val) == dict:
                    for dictVal in Val.values():
                        amountSum += int(dictVal)

    # else:
    #     data = it_inventory.objects.filter(purchase_date__month=m, purchase_date__year=y, paid_by=userName).values_list('purchase_date', 'item__item', 'amount')
    #     amountSum = 0
    #     for val in data:
    #         amountSum += val[2]
    
    return render(request, 'bills_and_reimbursement/moduleData.html' , {'data': data, 'amountSum': amountSum, 'moduleName': moduleName})

@api_view(['POST'])
def add_status_form(request, user, dateVal, startDate, endDate):
    status=request.POST.get('reimburse_status')
    newDate = datetime.strptime(dateVal, "%B, %Y")
    bills_reimburse.objects.update_or_create(defaults={"reimburse_status":status}, user=user, date=newDate) 
    return redirect('/bills_and_reimbursement/user_bills_details/'+user+'?startDate='+startDate+'&endDate='+endDate) 

@api_view(['POST'])
def add_images_form(request, user, dateVal, startDate, endDate):
    newDate = datetime.strptime(dateVal, "%B, %Y")
    stored_images = bills_images.objects.filter(image_date=newDate, image_user=user)

    print(request.POST.getlist('images'))
    for img in stored_images:
        if img.bills_images not in request.POST.getlist('images'):
            os.remove(img.bills_images.path)
            img.delete()

    for img in request.FILES.getlist("file[]"):
        im = bills_images(bills_images=img, image_user=user, image_date=newDate)
        im.save()
     
    return redirect('/bills_and_reimbursement/user_bills_details/'+user+'?startDate='+startDate+'&endDate='+endDate) 

def get_images(request):
    user = request.GET.get('user')
    dateVal = request.GET.get('dateVal')
    newDate = datetime.strptime(dateVal, "%B, %Y")
    imagesRes =list(bills_images.objects.filter(image_date=newDate, image_user=user).values_list('bills_images'))
    print(imagesRes)
    return render(request, 'bills_and_reimbursement/bills_images.html', {'image_list': imagesRes})
    # return JsonResponse({'imagelist': imagesRes})
