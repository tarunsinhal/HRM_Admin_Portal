
from django.core.exceptions import RequestAborted
from django.db.models import fields
from django.forms.utils import pretty_name
from django.forms.widgets import DateInput
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from rest_framework.serializers import Serializer
from .models import FoodInventory, Product_type, recurringItems, AdhocItems, t_shirt_inventory, vendorContactList, repairServices, engagementJoining
from django.http import JsonResponse
from .serializers import ProductSerializer, editProductSerializer, tshirtSerializer, editTshirtSerializer, AdhocItemSerializer, EditAdhocItemSerializer, vendorSerializer, editVendorSerializer, repairServicesSerializer, editRepairServicesSerializer, joiningSerializer, editJoiningSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from .forms import AddProducts, EditProducts, addTshirtForm, editTshirtForm, AddAdhocItemsForm, EditAdhocItemsForm, AddVendorForm, EditVendorForm, AddRepairServicesForm, EditRepairServicesForm, AddJoiningForm, EditJoiningForm
from django.urls import reverse
from home.models import notifications
from django.contrib.auth.models import User
from django.forms import formset_factory, modelformset_factory
from itertools import chain


# from .utils import specific_user_access, test_func
# Create your views here.

@login_required(login_url='/auth/login')
def operations_view(request):
    return redirect(reverse('operations:inventory_view'))


@login_required(login_url='/auth/login')
def inventory_view(request):
    return render(request, 'operations/inventory.html')


# @specific_user_access
@login_required(login_url='/auth/login')
def mro_view(request):
    return render(request, 'operations/mro.html')


@login_required(login_url='/auth/login')
def engagements_view(request):
    return render(request, 'operations/engagements.html')


@login_required(login_url='/auth/login')
def engagements_onboarding_view(request):

    editTshirt = editTshirtForm(auto_id=True)

    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    initial = []

    for i in sizes:
        data = {'size': i}
        remaining = list(t_shirt_inventory.objects.filter(size=i).order_by('-receiving_date').values('remaining'))
        if remaining:
            data['previous_stock'] = remaining[0]['remaining']
            data['total_quantity'] = remaining[0]['remaining']
        else:
            data['previous_stock'] = 0
            data['total_quantity'] = 0
        initial.append(data)

    addTshirtFormset = modelformset_factory(t_shirt_inventory, fields="__all__", form=addTshirtForm,extra=6, max_num=6)
    tshirt_formset = addTshirtFormset(initial=initial, queryset=t_shirt_inventory.objects.none())

    qs = t_shirt_inventory.objects.all()
    serializer = tshirtSerializer(qs, many=True)

    return render(request, 'operations/onBoarding.html', {'addTshirtFormSet': tshirt_formset, 'tshirtData': serializer.data, 'editTshirtForm': editTshirt})


@api_view(['POST'])
def addTshirt(request):
    request.POST._mutable = True
    
    request.POST['form-0-total_quantity'] = int(request.POST['form-0-previous_stock']) + int(request.POST['form-0-received_quantity'])
    request.POST['form-0-remaining'] = int(request.POST['form-0-total_quantity']) - int(request.POST['form-0-allotted'])
    request.POST['form-0-user_name'] = request.user
    print(request.user)
    for i in range(1,6):
        form_id = 'form-' + str(i)
        request.POST[form_id+'-user_name'] = request.user
        request.POST[form_id+'-order_date'] = request.POST['form-0-order_date']
        request.POST[form_id+'-receiving_date'] = request.POST['form-0-receiving_date']
        request.POST[form_id+'-total_quantity'] = int(request.POST[form_id+'-previous_stock']) + int(request.POST[form_id+'-received_quantity'])
        request.POST[form_id+'-remaining'] = int(request.POST[form_id+'-total_quantity']) - int(request.POST[form_id+'-allotted'])
        request.POST[form_id+'-paid_by'] = request.POST['form-0-paid_by']
        request.POST[form_id+'-additional'] = request.POST['form-0-additional']

    request.POST._mutable = False
    addTshirtFormset = modelformset_factory(t_shirt_inventory, fields="__all__")
    formset = addTshirtFormset(request.POST)

    if formset.is_valid():
        for form in formset:
            form.save()
        return Response({}, status=201)
    print(formset.errors)
    return Response({'error':formset.errors}, status=201)
    # return render(request, 'operations/inventory.html')

@api_view(['POST'])
def editTshirt(request, pk):
    tshirt_id = t_shirt_inventory.objects.get(id=pk)
    serializer = editTshirtSerializer(instance=tshirt_id, data=request.POST)
    print(serializer)
    if serializer.is_valid():
        print(serializer.validated_data)
        serializer.save()
        return Response({}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteTshirt(request, pk):
    tshirt_id = t_shirt_inventory.objects.get(id=pk)
    tshirt_id.delete()
    return Response({}, status=201)


# @specific_user_access(test_func)
@login_required(login_url='/auth/login')
def inventory_recurring_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    # callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    # results = callApi.json()

    if request.method == 'GET':
        qs = recurringItems.objects.all()
        serializer = ProductSerializer(qs, many=True)

    return render(request, 'operations/inventory_recurring.html', {'products': serializer.data, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})

@api_view(['POST'])
def addProducts(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    serializer = ProductSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editProducts(request, pk):
    product = recurringItems.objects.get(id=pk)
    if product.next_order_date != request.POST['next_order_date']:
        notification = notifications.objects.filter(item_id=pk)
        if notification:
            notification.delete()

    serializer = editProductSerializer(instance=product, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def deleteProducts(request, pk):
    product = recurringItems.objects.get(id=pk)
    product.delete()
    return Response({}, status=201)

def load_products(request):
    item_id = request.GET.get('Type')
    products = Product_type.objects.filter(product_type_id=item_id).order_by('product_name')
    return render(request, 'operations/product_options.html', {'products': products})


def load_purchase_date(request):
    product = request.GET.get('product')
    try:
        date = recurringItems.objects.filter(product=product).order_by('-next_order_date').values('next_order_date')[0][
            'next_order_date']
        return JsonResponse({'data': date.strftime('%Y-%m-%d')})
    except:
        return JsonResponse({'data': ''})


# @specific_user_access(test_func)
@login_required(login_url='/auth/login')
def inventory_adhoc_view(request):
    addAdhocProductsForm = AddAdhocItemsForm(auto_id=True)
    editAdhocProductsForm = EditAdhocItemsForm()

    if request.method == 'GET':
        qs = AdhocItems.objects.all()
        serializer = AdhocItemSerializer(qs, many=True)

    return render(request, 'operations/inventory_adhoc.html', {'products': serializer.data, 'addAdhocProductsForm': addAdhocProductsForm, 'editAdhocProductsForm': editAdhocProductsForm})


@api_view(['POST'])
def addAdhocProducts(request):
    print(request.POST)
    serializer = AdhocItemSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editAdhocProducts(request, pk):
    product = AdhocItems.objects.get(id=pk)
    print(request.POST)
    serializer = EditAdhocItemSerializer(instance=product, data=request.POST)
    print(request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)

    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteAdhocProducts(request, pk):
    product = AdhocItems.objects.get(id=pk)
    product.delete()
    return Response({}, status=201)


def load_users(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = AdhocItems.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return render(request, 'operations/adhoc_paid_by.html', { 'paid_by': PAID_BY})


# def load_paid_by(request):
#     # paid_by = AdhocItems.objects.all().values('paid_by').distinct()
#     users = User.objects.all()
#     return render(request, 'operations/adhoc_paid_by.html', {'users': users})

@login_required(login_url='/auth/login')
def mro_maintenance_vendor(request):
    addVendorForm = AddVendorForm()
    editVendorForm = EditVendorForm(auto_id=True)
    
    if request.method == 'GET':
        vs = vendorContactList.objects.all()
        serializer = vendorSerializer(vs, many=True)
    
    return render(request, 'operations/mro_maintenance_vendor.html', {'vendor':serializer.data, 'addVendorForm': addVendorForm, 'editVendorForm': editVendorForm})

@api_view(['POST'])
def addVendor(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    # print(request.POST)
    serializer = vendorSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editVendor(request, pk):
    vendor = vendorContactList.objects.get(id=pk)
    serializer = editVendorSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteVendor(request, pk):
    vendor = vendorContactList.objects.get(id=pk)
    vendor.delete()
    return Response({}, status=201)


@login_required(login_url='/auth/login')
def mro_maintenance_service(request):
    addRepairServicesForm = AddRepairServicesForm()
    editRepairServicesForm = EditRepairServicesForm(auto_id=True)
    
    if request.method == 'GET':
        rs = repairServices.objects.all()
        serializer = repairServicesSerializer(rs, many=True)

    return render(request, 'operations/mro_maintenance_service.html', {'service': serializer.data, 'addRepairServicesForm': addRepairServicesForm, 'editRepairServicesForm': editRepairServicesForm})


@api_view(['POST'])
def addRepairServices(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    # print(request.POST)
    serializer = repairServicesSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editRepairServices(request, pk):
    vendor = repairServices.objects.get(id=pk)
    serializer = editRepairServicesSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteRepairServices(request, pk):
    vendor = repairServices.objects.get(id=pk)
    vendor.delete()
    return Response({}, status=201)


def load_vendor(request):
    service_of = request.GET.get('service_of')
    vendor_name = vendorContactList.objects.filter(service=service_of).values('vendor_name')
    return render(request, 'operations/vendor_options.html', {'vendor_name': vendor_name})


def load_vendor_no(request):
    vendor_name = request.GET.get('vendor_name')
    service_name = request.GET.get('service_name')
    try:
        contact_no = vendorContactList.objects.filter(vendor_name=vendor_name, service=service_name).values('contact_no')[0]['contact_no']
        return JsonResponse({'contact_no': contact_no})
    except:
        return JsonResponse({'contact_no': ''})


# def users(request):
#     if request.method=="GET":
#         users= User.objects.all().values('user__username')
#         return

def maintenance_view(request):
    return render(request, 'operations/maintenance.html')


@login_required(login_url='/auth/login')
def tshirt_history(request):
    print(request.user)
    history = t_shirt_inventory.history.all().order_by('-history_date')
    return render(request, 'operations/tshirt_history.html', {'tshirt_history': history})

@login_required(login_url='/auth/login')
def engagements_on_off_boarding_view(request):
    addJoiningForm = AddJoiningForm()
    editJoiningForm = EditJoiningForm(auto_id=True)
    
    if request.method == 'GET':
        rs = engagementJoining.objects.all()
        serializer = joiningSerializer(rs, many=True)
    return render(request, 'operations/on_off_boarding.html', {'joiningData': serializer.data, 'addJoiningForm': addJoiningForm, 'editJoiningForm': editJoiningForm})

@api_view(['POST'])
def addJoining(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    # print(request.POST)
    serializer = joiningSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def editJoining(request, pk):
    employee = engagementJoining.objects.get(id=pk)
    serializer = editJoiningSerializer(instance=employee, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteJoining(request, pk):
    employee = engagementJoining.objects.get(id=pk)
    employee.delete()
    return Response({}, status=201)


def load_tshirt_edit_data(request):
    orderDate = request.GET.get('order_date')
    data = t_shirt_inventory.objects.filter(order_date=orderDate).values()

    res = {}
    for i in data:
        d = {'id': i['id'],'previous_stock':i['previous_stock'], 'ordered_quantity': i['ordered_quantity'],
            'received_quantity': i['received_quantity'], 'allotted': i['allotted'], 'total_quantity': i['total_quantity'],
            'error_message': i['error_message']}
        res[i['size']] = d
        res['paid_by'] = i['paid_by']
        res['additional'] = i['additional']
        if i['receiving_date']:
            res['receiving_date'] = i['receiving_date'].strftime('%Y-%m-%d')
    print(res)
    return JsonResponse({'data':res})


def load_previous_tshirt_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(t_shirt_inventory.history.filter(id=recent_id).order_by('-history_id').values())
    a = 0
    current_data = {}
    for i in res:
        if int(i['history_id']) == int(history_id):
            current_data = i
            a = res.index(i)
            break
    try:
        data = {}
        previous_data = res[a+1]
        for i in current_data:
            if i not in ('history_date', 'history_id', 'history_type'):
                if current_data[i] != previous_data[i]:
                    data[i] = {'current': current_data[i], 'previous': previous_data[i]}
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})
