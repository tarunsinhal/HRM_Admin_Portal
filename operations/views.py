from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

from .forms import AddProducts, EditProducts, addTshirtForm, editTshirtForm, AddAdhocItemsForm, EditAdhocItemsForm, AddItems, EditItems, AddVendor, EditVendor, AddRepairServices, EditRepairServices
from .models import FoodInventory, Product_type, recurringItems, AdhocItems, dailyWeeklyItems, vendorContactList, \
    repairServices,t_shirt_inventory
from django.http import JsonResponse
from .serializers import ProductSerializer, editProductSerializer, AdhocItemSerializer, EditAdhocItemSerializer, \
    ItemSerializer, editItemSerializer, vendorSerializer, editVendorSerializer, repairServicesSerializer, \
    editRepairServicesSerializer, tshirtSerializer, editTshirtSerializer
from rest_framework.response import Response
from .forms import AddProducts, EditProducts, AddAdhocItemsForm, EditAdhocItemsForm, AddItems, EditItems, AddVendor, \
    EditVendor, AddRepairServices, EditRepairServices
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
        else:
            data['previous_stock'] = 0
        initial.append(data)

    addTshirtFormset = modelformset_factory(t_shirt_inventory, fields="__all__", form=addTshirtForm,extra=6, max_num=6)
    tshirt_formset = addTshirtFormset(initial=initial, queryset=t_shirt_inventory.objects.none())

    qs = t_shirt_inventory.objects.all()
    serializer = tshirtSerializer(qs, many=True)

    return render(request, 'operations/onBoarding.html', {'addTshirtFormSet': tshirt_formset, 
    'tshirtData': serializer.data, 'editTshirtForm': editTshirt})


@api_view(['POST'])
def addTshirt(request):
    request.POST._mutable = True
    
    request.POST['form-0-total_quantity'] = int(request.POST['form-0-previous_stock']) + int(request.POST['form-0-ordered_quantity'])
    request.POST['form-0-remaining'] = int(request.POST['form-0-total_quantity']) - int(request.POST['form-0-allotted'])
    request.POST['form-0-user'] = request.user

    for i in range(1,6):
        form_id = 'form-' + str(i)
        request.POST[form_id+'-user'] = request.user
        request.POST[form_id+'-order_date'] = request.POST['form-0-order_date']
        request.POST[form_id+'-receiving_date'] = request.POST['form-0-receiving_date']
        request.POST[form_id+'-total_quantity'] = int(request.POST[form_id+'-previous_stock']) + int(request.POST[form_id+'-ordered_quantity'])
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

    return render(request, 'operations/inventory_recurring.html',
                  {'products': serializer.data, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})


@login_required(login_url='/auth/login')
def mro_recurring_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)

    if request.method == 'GET':
        qs = recurringItems.objects.filter(type_id__in=(4,5,6))
        serializer = ProductSerializer(qs, many=True)

    return render(request, 'operations/mro_recurring.html', {'products': serializer.data, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})


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
def deleteProducts(request, pk):
    product = recurringItems.objects.get(id=pk)
    product.delete()
    return Response({}, status=201)


@api_view(['POST'])
def deleteTshirt(request, pk):
    tshirt_id = t_shirt_inventory.objects.get(id=pk)
    tshirt_id.delete()
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
    addAdhocProductsForm = AddAdhocItemsForm()
    editAdhocProductsForm = EditAdhocItemsForm(auto_id=True)

    if request.method == 'GET':
        qs = AdhocItems.objects.all()
        serializer = AdhocItemSerializer(qs, many=True)

    return render(request, 'operations/inventory_adhoc.html',
                  {'products': serializer.data, 'addAdhocProductsForm': addAdhocProductsForm,
                   'editAdhocProductsForm': editAdhocProductsForm})


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
    #     print(value)
    #     PAID_BY.append(tuple((value, value)))
    #
    # PAID_BY.append(tuple(('Other', 'Other')))
    # print(PAID_BY)

    return render(request, 'operations/adhoc_paid_by.html',
                  { 'paid_by': PAID_BY})

def inventory_dailyWeekly_view(request):
    addItemsForm = AddItems()
    editItemsForm = EditItems(auto_id=True)
    # callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    # results = callApi.json()

    if request.method == 'GET':
        qs = dailyWeeklyItems.objects.all()
        serializer = ItemSerializer(qs, many=True)

    return render(request, 'operations/dailyWeekly_inventory.html',
                  {'products': serializer.data, 'addItemsForm': addItemsForm, 'editItemsForm': editItemsForm})


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
        date = dailyWeeklyItems.objects.filter(product=product).order_by('-purchase_date').values('purchase_date')[0][
            'purchase_date']
        return JsonResponse({'data': date.strftime('%Y-%m-%d')})
    except:
        return JsonResponse({'data': ''})


@login_required(login_url='/auth/login')
def mro_maintenance_vendor(request):
    addVendorForm = AddVendor()
    editVendorForm = EditVendor(auto_id=True)

    if request.method == 'GET':
        vs = vendorContactList.objects.all()
        serializer = vendorSerializer(vs, many=True)

    return render(request, 'operations/mro_maintenance_vendor.html',
                  {'vendor': serializer.data, 'addVendorForm': addVendorForm,
                   'editVendorForm': editVendorForm})


@api_view(['POST'])
def addVendor(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    # print(request.POST)
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

    return render(request, 'operations/mro_maintenance_service.html',
                  {'service': serializer.data, 'addRepairServicesForm': addRepairServicesForm,
                   'editRepairServicesForm': editRepairServicesForm})


@api_view(['POST'])
def addRepairServices(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    # print(request.POST)
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
        contact_no = \
            vendorContactList.objects.filter(vendor_name=vendor_name, service=service_name).values('contact_no')[0][
                'contact_no']
        return JsonResponse({'contact_no': contact_no})
    except:
        return JsonResponse({'contact_no': ''})


def maintenance_view(request):
    return render(request, 'operations/maintenance.html')


@login_required(login_url='/auth/login')
def tshirt_history(request):
    print(request.user)
    history = t_shirt_inventory.history.all().order_by('-history_date')
    # print(history)
    # serializer = tshirtHistorySerializer(history, many=True)
    # print(serializer.data)
    return render(request, 'operations/tshirt_history.html', {'tshirt_history': history})
