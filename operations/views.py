from django.forms.widgets import DateInput
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from rest_framework.serializers import Serializer
from .models import FoodInventory, Product_type, recurringItems, AdhocItems, dailyWeeklyItems, vendorContactList, repairServices
from django.http import JsonResponse
from .serializers import ProductSerializer, editProductSerializer, AdhocItemSerializer, EditAdhocItemSerializer, ItemSerializer, editItemSerializer, vendorSerializer, editVendorSerializer, repairServicesSerializer, editRepairServicesSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests 
from .forms import AddProducts, EditProducts, AddAdhocItemsForm, EditAdhocItemsForm, AddItems, EditItems, AddVendor, EditVendor, AddRepairServices, EditRepairServices
from django.urls import reverse
from django.views import generic
from home.models import notifications
from django.contrib.auth.models import User
# from .utils import specific_user_access, test_func
# from django.contrib.auth.decorators import user_passes_test
# from users.views import specific_user_access

# from .permissons import check_func
# from rest_framework.views import APIView


# Create your views here.


@login_required(login_url='/auth/login')
def operations_view(request):
    return redirect(reverse('operations:pantry_view'))


@login_required(login_url='/auth/login')
def pantry_view(request):
    return render(request, 'operations/pantry.html')


# @specific_user_access
@login_required(login_url='/auth/login')
def mro_view(request):
    return render(request, 'operations/mro_supplies.html')


@login_required(login_url='/auth/login')
def engagements_view(request):
    return render(request, 'operations/pantry.html')


# @specific_user_access(test_func)
@login_required(login_url='/auth/login')
def pantry_recurring_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    # callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    # results = callApi.json()

    if request.method == 'GET':
        qs = recurringItems.objects.all()
        serializer = ProductSerializer(qs, many=True)

    return render(request, 'operations/food_inventory.html',
                  {'products': serializer.data, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})


@api_view(['POST'])
def addProducts(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    # print(request.POST)
    serializer = ProductSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
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
def pantry_adhoc_view(request):
    addAdhocProductsForm = AddAdhocItemsForm()
    editAdhocProductsForm = EditAdhocItemsForm(auto_id=True)
    if request.method == 'GET':
        qs = AdhocItems.objects.all()
        serializer = AdhocItemSerializer(qs, many=True)
        users = User.objects.all()

    return render(request, 'operations/food_inventory_adhoc.html',
                  {'products': serializer.data, 'addAdhocProductsForm': addAdhocProductsForm,
                   'users': users,
                   'editAdhocProductsForm': editAdhocProductsForm})
                   

def pantry_dailyWeekly_view(request):
    addItemsForm = AddItems()
    editItemsForm = EditItems(auto_id=True)
    # callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    # results = callApi.json()

    if request.method == 'GET':
        qs = dailyWeeklyItems.objects.all()
        serializer = ItemSerializer(qs, many=True)

    return render(request, 'operations/dailyWeekly_inventory.html', {'products': serializer.data, 'addItemsForm': addItemsForm, 'editItemsForm': editItemsForm})


@api_view(['POST'])
def addItems(request):
    print(request.META.get('HTTP_REFERER', '/'))
    print(request.POST)
    serializer = ItemSerializer(data=request.POST)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editItems(request, pk):
    product = dailyWeeklyItems.objects.get(id=pk)
    serializer = editItemSerializer(instance=product, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteItems(request, pk):
    product = dailyWeeklyItems.objects.get(id=pk)
    product.delete()
    return Response({}, status=201)

    
def load_purchase_date_only(request):
    product = request.GET.get('product')
    try:
        date = dailyWeeklyItems.objects.filter(product=product).order_by('-purchase_date').values('purchase_date')[0]['purchase_date']
        return JsonResponse({'data':date.strftime('%Y-%m-%d')})
    except:
        return JsonResponse({'data': ''})


@login_required(login_url='/auth/login')
def mro_maintenance_vendor(request):
    addVendorForm = AddVendor()
    editVendorForm = EditVendor(auto_id=True)
    
    if request.method == 'GET':
        vs = vendorContactList.objects.all()
        serializer = vendorSerializer(vs, many=True)
    
    return render(request, 'operations/mro_maintenance_vendor.html', {'vendor':serializer.data, 'addVendorForm': addVendorForm, 'editVendorForm': editVendorForm})


@api_view(['POST'])
def addAdhocProducts(request):
    serializer = AdhocItemSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)

    return Response(serializer.errors, status=400)
    

@api_view(['POST'])
def addVendor(request):
    print(request.META.get('HTTP_REFERER', '/'))
    print(request.POST)
    serializer = vendorSerializer(data=request.POST)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editVendor(request, pk):
    vendor = vendorContactList.objects.get(id=pk)
    print(request.POST)
    print(vendor.id)
    serializer = editVendorSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteVendor(request, pk):
    vendor = vendorContactList.objects.get(id=pk)
    vendor.delete()
    return Response({}, status=201)

@login_required(login_url='/auth/login')
def mro_maintenance_service(request):
    addRepairServicesForm = AddRepairServices()
    editRepairServicesForm = EditRepairServices(auto_id=True)
    
    if request.method == 'GET':
        rs = repairServices.objects.all()
        serializer = repairServicesSerializer(rs, many=True)

    return render(request, 'operations/mro_maintenance_service.html', {'service':serializer.data, 'addRepairServicesForm': addRepairServicesForm, 'editRepairServicesForm': editRepairServicesForm})


@api_view(['POST'])
def addRepairServices(request):
    print(request.META.get('HTTP_REFERER', '/'))
    print(request.POST)
    serializer = repairServicesSerializer(data=request.POST)
    
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
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


@api_view(['POST'])
def editAdhocProducts(request, pk):
    product = AdhocItems.objects.get(id=pk)
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
    # user_id = request.GET.get('User')
    users = User.objects.all()
    return render(request, 'operations/paid_by_dropdown.html', {'users': users})


def load_paid_by(request):
    paid_by = AdhocItems.objects.all().values('paid_by').distinct()

    # serializer = AdhocItemSerializer(qs, many=True)
    # if serializer.is_valid:
    #     serializer.save()
    # print(serializer.data)
    # print(serializer.errors)
    users = User.objects.all()
    return render(request, 'operations/adhoc_paid_by.html',
                  {'products': paid_by, 'users': users})

    # return render(request, 'operations/paid_by_dropdown.html', {'users': users})


# def users(request):
#     if request.method=="GET":
#         users= User.objects.all().values('user__username')
#         return

def maintenance_view(request):
    return render(request, 'operations/maintenance.html')
