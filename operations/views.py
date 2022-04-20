from distutils import errors
from django.core.exceptions import RequestAborted, ValidationError
from django.db.models import fields
from django.forms.utils import pretty_name
from django.forms.widgets import DateInput
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from rest_framework import serializers
from rest_framework.serializers import Serializer
from .models import Item_types, Product_type, recurringItems, AdhocItems, t_shirt_inventory, vendorContactList, repairServices, engagementJoining, officeEvents
from django.http import JsonResponse
from .serializers import ProductSerializer, editProductSerializer, tshirtSerializer, editTshirtSerializer, AdhocItemSerializer, EditAdhocItemSerializer, vendorSerializer, editVendorSerializer, repairServicesSerializer, editRepairServicesSerializer, joiningSerializer, editJoiningSerializer, EventSerializer, EditEventSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests
from .forms import AddProducts, EditProducts, addTshirtForm, editTshirtForm, AddAdhocItemsForm, EditAdhocItemsForm, AddVendorForm, EditVendorForm, AddRepairServicesForm, EditRepairServicesForm, AddJoiningForm, EditJoiningForm, ImportForm, AddEventForm, EditEventForm, addTshirtForm
from django.urls import reverse
from home.models import notifications
from django.contrib.auth.models import User
from django.forms import formset_factory, modelformset_factory
from itertools import chain
from django.contrib import messages
from django.views import View
from .resources import RecurringResource, AdhocResource, JoiningResource, ExitResource, VendorResource, TshirtResource, officeEventsResource
import pandas as pd
from tablib import Dataset
import json
import csv
from datetime import datetime
from django.utils import timezone
from django.contrib.auth.decorators import permission_required

@login_required(login_url='/auth/login')
def operations_view(request):
    return redirect(reverse('operations:inventory_view'))

@login_required(login_url='/auth/login')
def inventory_view(request):
    return render(request, 'operations/inventory.html')

@login_required(login_url='/auth/login')
def mro_view(request):
    return render(request, 'operations/mro.html')

@login_required(login_url='/auth/login')
def engagements_view(request):
    return render(request, 'operations/engagements.html')

# view for the tshirt inventory module
@login_required(login_url='/auth/login')
def engagements_Tshirt_view(request):

    editTshirt = editTshirtForm(auto_id=True)

    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    initial = []

    for i in sizes:
        data = {'size': i}

        # getting the list of remainig tshirts of all sizes basedon receiving date and then fetching the latest values
        remaining = list(t_shirt_inventory.objects.filter(size=i).order_by('-receiving_date').values('remaining'))
        if remaining:
            data['previous_stock'] = remaining[0]['remaining']
            data['total_quantity'] = remaining[0]['remaining']
        else:
            data['previous_stock'] = 0
            data['total_quantity'] = 0
        
        # appending the values in the initial list to display the initial data in the form 
        initial.append(data)

    # creating model formset factory object for creating multiple forms in tshirt inventory
    addTshirtFormset = modelformset_factory(t_shirt_inventory, fields="__all__", form=addTshirtForm, extra=6, max_num=6)
    tshirt_formset = addTshirtFormset(initial=initial, queryset=t_shirt_inventory.objects.none())

    qs = t_shirt_inventory.objects.all().order_by("-id")
    serializer = tshirtSerializer(qs, many=True)

    importForm = ImportForm()

    return render(request, 'operations/tshirt_inventory.html', {'addTshirtFormSet': tshirt_formset, 'tshirtData': serializer.data, 'editTshirtForm': editTshirt, 'importForm': importForm})

# for adding tshirt data in tshirt inventory table
@api_view(['POST'])
def addTshirt(request):
    t_shirt_inventory._history_date = datetime.now()
    request.POST._mutable = True
    
    request.POST['form-0-total_quantity'] = int(request.POST['form-0-previous_stock']) + int(request.POST['form-0-received_quantity'])
    request.POST['form-0-remaining'] = int(request.POST['form-0-total_quantity']) - int(request.POST['form-0-allotted'])
    request.POST['form-0-user_name'] = request.user
    for i in range(1,6):
        form_id = 'form-' + str(i)
        request.POST[form_id+'-user_name'] = request.user
        request.POST[form_id+'-order_date'] = request.POST['form-0-order_date']
        request.POST[form_id+'-receiving_date'] = request.POST['form-0-receiving_date']
        request.POST[form_id+'-total_quantity'] = int(request.POST[form_id+'-previous_stock']) + int(request.POST[form_id+'-received_quantity'])
        request.POST[form_id+'-remaining'] = int(request.POST[form_id+'-total_quantity']) - int(request.POST[form_id+'-allotted'])
        request.POST[form_id+'-amount'] = request.POST['form-0-amount']
        request.POST[form_id+'-paid_by'] = request.POST['form-0-paid_by']
        if request.POST['form-0-add_name']:
            request.POST[form_id+'-paid_by'] = request.POST['form-0-add_name']
        request.POST[form_id+'-additional'] = request.POST['form-0-additional']

    request.POST._mutable = False
    addTshirtFormset = modelformset_factory(t_shirt_inventory, fields="__all__")
    formset = addTshirtFormset(request.POST)

    # checking if the formset is valid or not and then saving that form
    if formset.is_valid():
        for form in formset:
            # print(form.cleaned_data)
            serializer = tshirtSerializer(data=form.cleaned_data) 
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=400)
        return Response({}, status=201)
    print(formset.errors)
    return Response({'error':formset.errors}, status=201)


# for editing the tshirt data on clicking update button
@api_view(['POST'])
def editTshirt(request):
    request.POST._mutable = True

    # looping over the number of tsirt sizes for creating data for each size
    for i in range(0,6):
        res = {}
        i = str(i)
        res['size'] = request.POST['form-' + i + '-size']
        res['order_date'] = request.POST['form-0-order_date']
        if request.POST['form-0-receiving_date']:
            res['receiving_date'] = request.POST['form-0-receiving_date']
        else:
            res['receiving_date'] = None
        res['previous_stock'] = request.POST['form-' + i + '-previous_stock']
        res['ordered_quantity'] = request.POST['form-' + i + '-ordered_quantity']
        res['received_quantity'] = request.POST['form-' + i + '-received_quantity']
        res['total_quantity'] = request.POST['form-' + i + '-total_quantity']
        res['allotted'] = request.POST['form-' + i + '-allotted']
        res['remaining'] = int(res['total_quantity']) - int(res['allotted'])
        res['amount'] = request.POST['form-0-amount']
        res['paid_by'] = request.POST['form-0-paid_by']
        if request.POST['form-0-add_name']:
            res['paid_by'] = request.POST['form-0-add_name']
        res['additional'] = request.POST['form-0-additional']
        res['user_name'] = request.user.username

        tshirt_id = t_shirt_inventory.objects.get(id=int(request.GET.get(res['size'])))
        tshirt_id._history_date = datetime.now()
        serializer = editTshirtSerializer(instance=tshirt_id, data=res)

        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=400)
    return Response({}, status=201)

# deleting the tshirt data on clicking delete button
@api_view(['POST'])
def deleteTshirt(request):
    for i in request.GET:
        tshirt_id = t_shirt_inventory.objects.get(id=int(request.GET.get(i)))
        tshirt_id._history_date = datetime.now()
        tshirt_id.save()
        tshirt_id.delete()
    return Response({}, status=201)

# view for loading tshirt on clicking the edit button
def load_tshirt_edit_data(request):
    orderDate = request.GET.get('order_date')
    data = t_shirt_inventory.objects.filter(order_date=orderDate).values()

    res = {}
    for i in data:
        d = {'id': i['id'],'previous_stock':i['previous_stock'], 'ordered_quantity': i['ordered_quantity'],
            'received_quantity': i['received_quantity'], 'allotted': i['allotted'], 'total_quantity': i['total_quantity'],
            'error_message': i['error_message']}
        res[i['size']] = d
        res['amount'] = i['amount']
        res['paid_by'] = i['paid_by']
        res['additional'] = i['additional']
        res['order_date'] = i['order_date']
        if i['receiving_date']:
            res['receiving_date'] = i['receiving_date'].strftime('%Y-%m-%d')
    return JsonResponse({'data':res})

# view for tshirt version history module
@login_required(login_url='/auth/login')
def tshirt_history(request):
    history = t_shirt_inventory.history.filter(history_type="-").all().order_by('-history_date')
    return render(request, 'operations/tshirt_history.html', {'tshirt_history': history})

# view for checking if there is any change from the previous values in version history part of tshirt inventory
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

# view for each row version history module of tshirt inventory section
@login_required(login_url='/auth/login')
def tshirt_row_history(request):
    order_date = request.GET.get('order_date')
    tshirt_row_history = t_shirt_inventory.history.filter(order_date=order_date, history_type="+").all() | t_shirt_inventory.history.filter(order_date=order_date, history_type="~").all()
    return render(request, 'operations/tshirt_row_history.html', {'tshirt_row_history': tshirt_row_history})

# view for each row version history module of tshirt inventory deleted history section
@login_required(login_url='/auth/login')
def tshirt_row_deleted_history(request):
    row_id = request.GET.get('order_date')
    tshirt_row_history = t_shirt_inventory.history.filter(id=row_id, history_type="+" and "~").all()
    return render(request, 'operations/tshirt_row_history.html', {'tshirt_row_history': tshirt_row_history})

# import function for Tshirt_inventory
class ImportTshirtView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = TshirtResource()

            data = data_set.load(file.read().decode('utf-8'), format=extension)
            #result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
            try:
                result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
            
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# view for loading paid by users in tshirt inventory module
def load_tshirt_inventory_users(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = t_shirt_inventory.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})


# view for recurring module
@login_required(login_url='/auth/login')
def inventory_recurring_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        qs = recurringItems.objects.all().order_by("-id")
        serializer = ProductSerializer(qs, many=True)
    return render(request, 'operations/inventory_recurring.html', {'products': serializer.data, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts, 'importForm': importForm})

# for adding the products in recurring module
@api_view(['POST'])
def addProducts(request):
    recurringItems._history_date = datetime.now()
    serializer = ProductSerializer(data=request.POST)

    if serializer.is_valid():
        # serializer._history_date = datetime.now()
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# for editing the products in recurring module
@api_view(['POST'])
def editProducts(request, pk):
    product = recurringItems.objects.get(id=pk)
    product._history_date = datetime.now()

    # deleting the previous record of that id from the notifications table when next order date is getting updated
    if product.next_order_date != request.POST['next_order_date']:
        notification = notifications.objects.filter(item_id=pk)
        if notification:
            notification.delete()
    
    print(request.POST)

    serializer = editProductSerializer(instance=product, data=request.POST)
    
    if serializer.is_valid():
        print(serializer.validated_data)
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for deleting the products in recurring module
@api_view(['POST'])
def deleteProducts(request, pk):
    product = recurringItems.objects.get(id=pk)
    product._history_date = datetime.now()
    product.save()
    product.delete()
    return Response({}, status=201)

# ajax view for loading the products based on slected type
def load_products(request):
    item_id = request.GET.get('Type')
    products = Product_type.objects.filter(product_type_id=item_id).order_by('product_name')
    return render(request, 'operations/product_options.html', {'products': products})

# view for loading the purchase date based on the selected product
def load_purchase_date(request):
    product = request.GET.get('product')
    try:
        date = recurringItems.objects.filter(product=product).order_by('-next_order_date').values('next_order_date')[0][
            'next_order_date']
        return JsonResponse({'data': date.strftime('%Y-%m-%d')})
    except:
        return JsonResponse({'data': ''})

# import-export function for recurring inventory 
class ImportrecurringView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = RecurringResource()
            
            data = data_set.load(file.read().decode('utf-8'), format=extension)

            if 'type' in data:
                for x in range(len(data)):
                    type_id = Item_types.objects.filter(type_name=data['type'][x]).values('type_id')[0]['type_id']
                    try:
                        p = Product_type.objects.get(product_type_id=type_id, product_name=data['product'][x])
                    except:
                        p = Product_type.objects.create(product_type_id=type_id, product_name=data['product'][x])
                        p.save()
            try:
                result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# view for loading paid by users in recurring module
def load_recurring_users(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = recurringItems.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})

# view for version history module of recurring section
@login_required(login_url='/auth/login')
def inventory_recurring_history(request):
    recurring_history = recurringItems.history.filter(history_type="-").all()
    return render(request, 'operations/recurring_history.html', {'recurring_history': recurring_history})


# view for checking if there is any change from the previous values in version history part of recurring module
def load_previous_recurring_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(recurringItems.history.filter(id=recent_id).order_by('-history_id').values())
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

# view for each row version history module of recurring section
@login_required(login_url='/auth/login')
def recurring_row_history(request):
    row_id = request.GET.get('id')
    recurring_row_history = recurringItems.history.filter(id=row_id, history_type="+").all() | recurringItems.history.filter(id=row_id, history_type="~").all()
    return render(request, 'operations/recurring_row_history.html', {'recurring_row_history': recurring_row_history})

# view for adhoc module
@login_required(login_url='/auth/login')
def inventory_adhoc_view(request):
    addAdhocProductsForm = AddAdhocItemsForm(auto_id=True)
    editAdhocProductsForm = EditAdhocItemsForm()
    importForm = ImportForm()

    if request.method == 'GET':
        qs = AdhocItems.objects.all().order_by("-id")
        serializer = AdhocItemSerializer(qs, many=True)
    return render(request, 'operations/inventory_adhoc.html', {'products': serializer.data, 'addAdhocProductsForm': addAdhocProductsForm, 'editAdhocProductsForm': editAdhocProductsForm, 'importForm': importForm})

# view for adding products in adhoc module
@api_view(['POST'])
def addAdhocProducts(request):
    AdhocItems._history_date = datetime.now()
    serializer = AdhocItemSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for editing the data in adhoc module
@api_view(['POST'])
def editAdhocProducts(request, pk):
    product = AdhocItems.objects.get(id=pk)
    product._history_date = datetime.now()
    serializer = EditAdhocItemSerializer(instance=product, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for deleting the row in adhoc module
@api_view(['POST'])
def deleteAdhocProducts(request, pk):
    product = AdhocItems.objects.get(id=pk)
    product._history_date = datetime.now()
    product.save()
    product.delete()
    return Response({}, status=201)

# import-export function for adhoc inventory
class ImportadhocView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = AdhocResource()

            data = data_set.load(file.read().decode('utf-8'), format=extension)
            try:
                result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# view for loading paid by users in adhoc module
def load_adhoc_users(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = AdhocItems.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})

# view for version history module of recurring section
def inventory_adhoc_history(request):
    adhoc_history = AdhocItems.history.filter(history_type="-").all()
    return render(request, 'operations/adhoc_history.html', {'adhoc_history': adhoc_history})

# view for checking if there is any change from the previous values in version history part of adhoc module
def load_previous_adhoc_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(AdhocItems.history.filter(id=recent_id).order_by('-history_id').values())
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

# view for each row version history module of adhoc section
@login_required(login_url='/auth/login')
def adhoc_row_history(request):
    row_id = request.GET.get('id')
    adhoc_row_history = AdhocItems.history.filter(id=row_id, history_type="+").all() | AdhocItems.history.filter(id=row_id, history_type="~").all()
    return render(request, 'operations/adhoc_row_history.html', {'adhoc_row_history': adhoc_row_history})


# view for vendor section in MRO module
@login_required(login_url='/auth/login')
def mro_maintenance_vendor(request):
    addVendorForm = AddVendorForm()
    editVendorForm = EditVendorForm(auto_id=True)
    importForm = ImportForm()
    
    if request.method == 'GET':
        vs = vendorContactList.objects.all().order_by("-id")
        serializer = vendorSerializer(vs, many=True)
    
    return render(request, 'operations/mro_maintenance_vendor.html', {'vendor':serializer.data, 'addVendorForm': addVendorForm, 'editVendorForm': editVendorForm, 'importForm': importForm})

# view for adding vendor details in vendor section in MRO module
@api_view(['POST'])
def addVendor(request):
    vendorContactList._history_date = datetime.now()
    serializer = vendorSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for editing vendor details in vendor section in MRO module
@api_view(['POST'])
def editVendor(request, pk):
    vendor = vendorContactList.objects.get(id=pk)
    vendor._history_date = datetime.now()
    serializer = editVendorSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for deleting vendor details in vendor section in MRO module
@api_view(['POST'])
def deleteVendor(request, pk):
    vendor = vendorContactList.objects.get(id=pk)
    vendor._history_date = datetime.now()
    vendor.save()
    vendor.delete()
    return Response({}, status=201)

# view for loading vendor details based on the service selected
def load_vendor(request):
    service_of = request.GET.get('service_of')
    vendor_name = vendorContactList.objects.filter(service=service_of).values('vendor_name')
    return render(request, 'operations/vendor_options.html', {'vendor_name': vendor_name})

# view for loading vendor number based on the vendor name and the service selected
def load_vendor_no(request):
    vendor_name = request.GET.get('vendor_name')
    service_name = request.GET.get('service_name')
    try:
        contact_no = vendorContactList.objects.filter(vendor_name=vendor_name, service=service_name).values('contact_no')[0]['contact_no']
        return JsonResponse({'contact_no': contact_no})
    except:
        return JsonResponse({'contact_no': ''})

# import-export function for vendor details 
class ImportvendorView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST, request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = VendorResource()
            data = data_set.load(file.read().decode('utf-8'), format=extension)
            # result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)    
            try:
                result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)

        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# view for loading vendor history in MRO module
def mro_vendor_history(request):
    vendor_history = vendorContactList.history.filter(history_type="-").all()
    return render(request, 'operations/vendor_history.html', {'vendor_history': vendor_history})

# view for checking if there is any change from the previous values in version history part of vendor section
def load_previous_vendor_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(vendorContactList.history.filter(id=recent_id).order_by('-history_id').values())
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

# view for each row version history module of adhoc section
@login_required(login_url='/auth/login')
def vendor_row_history(request):
    row_id = request.GET.get('id')
    vendor_row_history = vendorContactList.history.filter(id=row_id, history_type="+").all() | vendorContactList.history.filter(id=row_id, history_type="~").all()
    return render(request, 'operations/vendor_row_history.html', {'vendor_row_history': vendor_row_history})


# view for service section in MRO mmodule
@login_required(login_url='/auth/login')
def mro_maintenance_service(request):
    addRepairServicesForm = AddRepairServicesForm()
    editRepairServicesForm = EditRepairServicesForm(auto_id=True)
    importForm = ImportForm()
    
    if request.method == 'GET':
        rs = repairServices.objects.all().order_by("-id")
        serializer = repairServicesSerializer(rs, many=True)

    return render(request, 'operations/mro_maintenance_service.html', {'service': serializer.data, 'addRepairServicesForm': addRepairServicesForm, 'editRepairServicesForm': editRepairServicesForm, 'importForm': importForm})

# view for adding details in repair services in MRO module
@api_view(['POST'])
def addRepairServices(request):
    repairServices._history_date = datetime.now()
    serializer = repairServicesSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for editing repair services in MRO module
@api_view(['POST'])
def editRepairServices(request, pk):
    vendor = repairServices.objects.get(id=pk)
    vendor._history_date = datetime.now()
    serializer = editRepairServicesSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# view for deleting repair services in MRO module
@api_view(['POST'])
def deleteRepairServices(request, pk):
    vendor = repairServices.objects.get(id=pk)
    vendor._history_date = datetime.now()
    vendor.save()
    vendor.delete()
    return Response({}, status=201)

# view for loading service history in MRO module
def mro_service_history(request):
    service_history = repairServices.history.filter(history_type="-").all()
    return render(request, 'operations/service_history.html', {'service_history': service_history})

# view for checking if there is any change from the previous values in version history part of service section
def load_previous_service_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(repairServices.history.filter(id=recent_id).order_by('-history_id').values())
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

# view for loading paid by users in MRO module
def load_mro_users(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = repairServices.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})

# view for each row version history module of adhoc section
@login_required(login_url='/auth/login')
def service_row_history(request):
    row_id = request.GET.get('id')
    service_row_history = repairServices.history.filter(id=row_id, history_type="+").all() | repairServices.history.filter(id=row_id, history_type="~").all()
    return render(request, 'operations/service_row_history.html', {'service_row_history': service_row_history})


# view for onBoarding and offBoarding module in engagements section
@login_required(login_url='/auth/login')
def engagements_on_off_boarding_view(request):
    addJoiningForm = AddJoiningForm()
    editJoiningForm = EditJoiningForm(auto_id=True)
    importForm = ImportForm()
    
    if request.method == 'GET':
        rs = engagementJoining.objects.all().order_by('-details_id')
        serializer = joiningSerializer(rs, many=True)
    return render(request, 'operations/boarding.html', {'joiningData': serializer.data, 'addJoiningForm': addJoiningForm, 'editJoiningForm': editJoiningForm, 'importForm': importForm})

# view for adding the joining details of an employee
@api_view(['POST'])
def addJoining(request):
    engagementJoining._history_date = datetime.now()
    serializer = joiningSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)

# view for editing the joining details of an employee
@api_view(['POST'])
def editJoining(request, pk):
    employee = engagementJoining.objects.get(id=pk)
    employee._history_date = datetime.now()
    serializer = editJoiningSerializer(instance=employee, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201) 
    print(serializer.errors)
    return Response(serializer.errors, status=400)

# view for deleting the joining details of an employee
@api_view(['POST'])
def deleteJoining(request, pk):
    employee = engagementJoining.objects.get(id=pk)
    employee._history_date = datetime.now()
    employee.save()
    employee.delete()
    return Response({}, status=201)

# import-export function for joining-boarding
class ImportJoiningView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] = form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = JoiningResource()

            data = data_set.load(file.read().decode('utf-8'), format=extension)
            # result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
            
            try:
                if data['Joining Date']:
                    result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                    return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# import-export function for joining-boarding
class ImportExitView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = ExitResource()

            data = data_set.load(file.read().decode('utf-8'), format=extension)

            try:
                if data['Last Working Date']:
                    result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                    return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)

        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# view for loading boarding history in engagements module
def enagagements_boarding_history(request):
    boarding_history = engagementJoining.history.filter(history_type="-").all().order_by('-details_id')
    return render(request, 'operations/boarding_history.html', {'boarding_history': boarding_history})

# view for checking if there is any change from the previous values in version history part of engagements section
def load_previous_engagements_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')

    res = list(engagementJoining.history.filter(id=recent_id).order_by('-history_id').values())

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

# view for each row version history module of adhoc section
@login_required(login_url='/auth/login')
def boarding_row_history(request):
    row_id = request.GET.get('id')
    boarding_row_history = engagementJoining.history.filter(id=row_id, history_type="+").all() | engagementJoining.history.filter(id=row_id, history_type="~").all()
    return render(request, 'operations/boarding_row_history.html', {'boarding_row_history': boarding_row_history})


# view for office events module
@login_required(login_url='/auth/login')
def office_events_view(request):
    addEventForm = AddEventForm()
    editEventForm = EditEventForm(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        ev = officeEvents.objects.all().order_by("-id")
        serializer = EventSerializer(ev, many=True)

    return render(request, 'operations/office_events.html',{'officeEvents':serializer.data, 'addEventForm': addEventForm, 'editEventForm': editEventForm, 'importForm': importForm})

# view for loading paid by users in Office-event module
def load_officeEvents_users(request):
    users = User.objects.all().values_list('username', flat=True)
    paid_by_names = officeEvents.objects.all().values_list('paid_by', flat=True)
    distinct_values = set(chain(users, paid_by_names))
    PAID_BY = []
    for value in distinct_values:
        PAID_BY.append(value)
    PAID_BY.append("Other")
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})

@api_view(['POST'])
def addOfficeEvents(request):
    # print(request.META.get('HTTP_REFERER', '/'))
    officeEvents._history_date = datetime.now()
    serializer = EventSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    print(serializer.errors)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def editOfficeEvents(request, pk):
    event = officeEvents.objects.get(id=pk)
    event._history_date = datetime.now()
    serializer = EditEventSerializer(instance=event, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def deleteOfficeEvents(request, pk):
    details = officeEvents.objects.get(id=pk)
    details._history_date = datetime.now()
    details.save()
    details.delete()
    return Response({}, status=201)

# export function for office event
def export_csv(request):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] ='attachment; filename=Office Events.csv' 
    writer = csv.writer(response)
    writer.writerow(['Date', 'Event Name', 'Activity Planned', 'Item Name', 'Item Price', 'Food Name', 'Food Price', 'Remarks'])
    events = officeEvents.objects.all().values_list('date', 'event_name', 'activity_planned', 'item', 'food', 'remarks')
    
    for event in events:
        itemlen = len(event[3])
        foodlen = len(event[4])
        if itemlen > foodlen:
            for i in range(itemlen):
                if i < foodlen :
                    writer.writerow([event[0],event[1],event[2],list(event[3].keys())[i],list(event[3].values())[i],list(event[4].keys())[i],list(event[4].values())[i],event[5]])
                else :
                    writer.writerow([event[0],event[1],event[2],list(event[3].keys())[i],list(event[3].values())[i],"Null","Null",event[5]])
        else:
            for i in range(foodlen):
                if i < itemlen :
                    writer.writerow([event[0],event[1],event[2],list(event[3].keys())[i],list(event[3].values())[i],list(event[4].keys())[i],list(event[4].values())[i],event[5]])
                else :
                    writer.writerow([event[0],event[1],event[2],"Null","Null",list(event[4].keys())[i],list(event[4].values())[i],event[5]])
            
    return response

# import function for office events
class ImportOfficeEventsView(View):
    context = {}

    def get(self,request, id):
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = officeEventsResource()
            
            df = pd.read_csv(file)
            if 'Date' in df:
                dfnew = df.groupby('Date')
                complete_data = []
                for date,frame in dfnew :
                    try:
                        datetime.strptime(date, '%Y-%m-%d')
                    except ValueError:
                        return JsonResponse({"error":"Incorrect data format, should be YYYY-MM-DD."},status=400)
                    datedata = officeEvents.objects.filter(date=date).values_list('date')
                    if datedata:
                        return JsonResponse({"error":"Date is already exist."},status=400)
                    else:
                        try:
                            data_list = []
                            item = {}
                            food = {}

                            for event,activity,remark in zip(frame["Event Name"], frame["Activity Planned"], frame["Remarks"]):
                                event_name = event
                                activity_name = activity
                                remark_name = remark
                                
                            for name, price in zip(frame["Item Name"], frame["Item Price"]):
                                if name != "Null":
                                    item[name] = price

                            for name, price in zip(frame["Food Name"], frame["Food Price"]):
                                if name != "Null":
                                    food[name] = price
                        except KeyError as e:
                            return JsonResponse({"error": "{} column does not exist.".format(e.args[0])},status=400)
                        data_list.extend([date, event_name, activity_name, item, food, remark_name])

                        complete_data.append(data_list)
                
                df = pd.DataFrame(complete_data, columns=['date', 'event_name', 'activity_planned', 'item', 'food', 'remarks'])  
                data = data_set.load(df)
            try:
                result = resource.import_data(data_set, dry_run=False, collect_failed_rows=True, raise_errors=True,)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)

# view for loading event name in office event module    
def load_events_name(request):
    events_name = officeEvents.objects.values_list('event_name', flat=True).distinct()
    Events = []
    for value in events_name:
        Events.append(value)
    Events.append("Other")
    return render(request, 'operations/events.html', { 'events': Events})

# view for loading officeEvents history in engagements module
def enagagements_officeEvents_history(request):
    officeEvents_history = officeEvents.history.filter(history_type="-").all()
    return render(request, 'operations/officeEvents_history.html', {'officeEvents_history': officeEvents_history})

# view for checking if there is any change from the previous values in version history part of officeEvents section
def load_previous_officeEvents_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(officeEvents.history.filter(id=recent_id).order_by('-history_id').values())
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

# view for each row version history module of adhoc section
@login_required(login_url='/auth/login')
def officeEvents_row_history(request):
    row_id = request.GET.get('id')
    officeEvents_row_history = officeEvents.history.filter(id=row_id, history_type="+").all() | officeEvents.history.filter(id=row_id, history_type="~").all()
    return render(request, 'operations/officeEvents_row_history.html', {'officeEvents_row_history': officeEvents_row_history})



