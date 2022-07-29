"""
This file contains the views for the operations app.
"""
from itertools import chain
from datetime import datetime
import csv
import pandas as pd
from tablib import Dataset
from django.forms.utils import pretty_name
from django.contrib.auth.decorators import permission_required
from django.views import View
from django.core.exceptions import ValidationError
from django.http.response import HttpResponse
from django.http import JsonResponse
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.urls import reverse
from django.contrib.auth.models import User
from django.forms import formset_factory, modelformset_factory
from rest_framework.response import Response
from rest_framework.decorators import api_view
from home.models import notifications
from operations.utils import (
                                load_previous_history, import_func,
                                paid_by_list
                            )
from .models import (
                        Item_types, Product_type, recurringItems,
                        AdhocItems, t_shirt_inventory, vendorContactList,
                        repairServices, engagementJoining, officeEvents
                    )
from .serializers import (
                            ProductSerializer, editProductSerializer,
                            tshirtSerializer, editTshirtSerializer,
                            AdhocItemSerializer, EditAdhocItemSerializer,
                            vendorSerializer, editVendorSerializer,
                            repairServicesSerializer,
                            editRepairServicesSerializer,
                            joiningSerializer, editJoiningSerializer,
                            EventSerializer, EditEventSerializer
                        )
from .forms import (
                        AddProducts, EditProducts, addTshirtForm,
                        editTshirtForm, AddAdhocItemsForm, ImportForm,
                        EditAdhocItemsForm, AddVendorForm,
                        EditVendorForm, AddRepairServicesForm,
                        EditRepairServicesForm, AddJoiningForm,
                        EditJoiningForm, AddEventForm, EditEventForm
                    )

from .resources import (
                            RecurringResource, AdhocResource,
                            JoiningResource, ExitResource,
                            VendorResource, TshirtResource,
                            officeEventsResource
                        )


@login_required(login_url='/auth/login')
def operations_view(request):
    """
    This function is used for the operations module.
    """
    return redirect(reverse('operations:inventory_view'))

@login_required(login_url='/auth/login')
def inventory_view(request):
    """
    This function is used for the inventory module.
    """
    return render(request, 'operations/inventory.html')

@login_required(login_url='/auth/login')
def mro_view(request):
    """
    This function is used for the mro module.
    """
    return render(request, 'operations/mro.html')

@login_required(login_url='/auth/login')
def engagements_view(request):
    """
    This function is used for the engagement module.
    """
    return render(request, 'operations/engagements.html')


@login_required(login_url='/auth/login')
def engagements_Tshirt_view(request):
    """
    This function is used for the tshirt inventory module.
    """

    editTshirt = editTshirtForm(auto_id=True)

    sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    initial = []

    for i in sizes:
        data = {'size': i}

        # Getting the list of remainig tshirts of all sizes based-on
        # receiving date and then fetching the latest values
        remaining = list(t_shirt_inventory.objects.filter(size=i).order_by(
                        '-receiving_date').values('remaining'))
        if remaining:
            data['previous_stock'] = remaining[0]['remaining']
            data['total_quantity'] = remaining[0]['remaining']
        else:
            data['previous_stock'] = 0
            data['total_quantity'] = 0

        # appending the values in the initial list to display the initial data in the form
        initial.append(data)

    # creating model formset factory object for creating multiple forms in tshirt inventory
    addTshirtFormset = modelformset_factory(
                            t_shirt_inventory,
                            fields="__all__",
                            form=addTshirtForm,
                            extra=6,
                            max_num=6
                        )
    tshirt_formset = addTshirtFormset(
                        initial=initial,
                        queryset=t_shirt_inventory.objects.none()
                    )

    qs = t_shirt_inventory.objects.all().order_by("-id")
    serializer = tshirtSerializer(qs, many=True)

    importForm = ImportForm()

    return render(
                    request,
                    'operations/tshirt_inventory.html',
                    {
                        'addTshirtFormSet': tshirt_formset,
                        'tshirtData': serializer.data,
                        'editTshirtForm': editTshirt,
                        'importForm': importForm
                    }
                )


@api_view(['POST'])
def addTshirt(request):
    """
    This function is used For Adding tshirt data in tshirt inventory table.
    """
    t_shirt_inventory._history_date = datetime.now()
    request.POST._mutable = True

    request.POST['form-0-total_quantity'] = int(
                                                request.POST['form-0-previous_stock']
                                            ) + int(
                                                request.POST['form-0-received_quantity']
                                            )
    request.POST['form-0-remaining'] = int(
                                            request.POST['form-0-total_quantity']
                                        ) - int(
                                            request.POST['form-0-allotted']
                                        )
    request.POST['form-0-user_name'] = request.user
    for i in range(1,6):
        form_id = 'form-' + str(i)
        request.POST[form_id+'-user_name'] = request.user
        request.POST[form_id+'-order_date'] = request.POST['form-0-order_date']
        request.POST[form_id+'-receiving_date'] = request.POST['form-0-receiving_date']
        request.POST[form_id+'-total_quantity'] = int(
                                                        request.POST[form_id+'-previous_stock']
                                                    ) + int(
                                                        request.POST[form_id+'-received_quantity']
                                                    )
        request.POST[form_id+'-remaining'] = int(
                                                    request.POST[form_id+'-total_quantity']
                                                ) - int(
                                                    request.POST[form_id+'-allotted']
                                                )
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
            serializer = tshirtSerializer(data=form.cleaned_data)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=400)
        return Response({}, status=201)
    return Response({'error':formset.errors}, status=201)



@api_view(['POST'])
def editTshirt(request):
    """
    This function is used For Editing the tshirt data on clicking update button.
    """
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


@api_view(['POST'])
def deleteTshirt(request):
    """
    This function is used for Deleting the tshirt data on clicking delete button.
    """
    for i in request.GET:
        tshirt_id = t_shirt_inventory.objects.get(id=int(request.GET.get(i)))
        tshirt_id._history_date = datetime.now()
        tshirt_id.save()
        tshirt_id.delete()
    return Response({}, status=201)


def load_tshirt_edit_data(request):
    """
    This function is used for loading tshirt on clicking the edit button.
    """
    orderDate = request.GET.get('order_date')
    data = t_shirt_inventory.objects.filter(order_date=orderDate).values()

    res = {}
    for i in data:
        d = {
                'id': i['id'],'previous_stock':i['previous_stock'],
                'ordered_quantity': i['ordered_quantity'],
                'received_quantity': i['received_quantity'],
                'allotted': i['allotted'], 'total_quantity': i['total_quantity'],
                'error_message': i['error_message']
            }
        res[i['size']] = d
        res['amount'] = i['amount']
        res['paid_by'] = i['paid_by']
        res['additional'] = i['additional']
        res['order_date'] = i['order_date']
        if i['receiving_date']:
            res['receiving_date'] = i['receiving_date'].strftime('%Y-%m-%d')
    return JsonResponse({'data':res})


@login_required(login_url='/auth/login')
def tshirt_history(request):
    """
    This function is used for tshirt version history module.
    """
    history = t_shirt_inventory.history.filter(
                history_type="-").all().order_by('-history_date')
    return render(
                    request,
                    'operations/tshirt_history.html',
                    {'tshirt_history': history}
                )


def load_previous_tshirt_history(request):
    """
    This function is used for checking if there is any changes from the
    previous values in version history of tshirt inventory.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = t_shirt_inventory
    data = load_previous_history(model_name, recent_id, history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})


@login_required(login_url='/auth/login')
def tshirt_row_history(request):
    """"
    This function is used for each row version history module of tshirt inventory section.
    """
    order_date = request.GET.get('order_date')
    tshirt_row_history = t_shirt_inventory.history.filter(
                                order_date=order_date, history_type="+"
                            ).all() | t_shirt_inventory.history.filter(
                                order_date=order_date, history_type="~"
                            ).all()
    return render(
                    request,
                    'operations/tshirt_row_history.html',
                    {'tshirt_row_history': tshirt_row_history}
                )


@login_required(login_url='/auth/login')
def tshirt_row_deleted_history(request):
    """
    This function is used for each row version history module of tshirt
    inventory deleted history section.
    """
    row_id = request.GET.get('order_date')
    tshirt_row_history = t_shirt_inventory.history.filter(
                            id=row_id, history_type="+" and "~").all()
    return render(
                    request,
                    'operations/tshirt_row_history.html',
                    {'tshirt_row_history': tshirt_row_history}
                )


class ImportTshirtView(View):
    """
    This class is used for Import functionality of Tshirt_inventory.
    """
    context = {}

    def get(self,request):
        """This fucntion is used for get request."""
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This fucntion is used for post request."""
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = TshirtResource()
            data = data_set.load(file.read().decode('utf-8'), format=extension)
            try:
                result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


def load_tshirt_inventory_users(request):
    """
    This function is used for loading paid by users in tshirt inventory module.
    """
    PAID_BY = paid_by_list(t_shirt_inventory)
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})



@login_required(login_url='/auth/login')
def inventory_recurring_view(request):
    """
    This function is used for recurring module.
    """
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        qs = recurringItems.objects.all().order_by("-id")
        serializer = ProductSerializer(qs, many=True)
    return render(
                    request,
                    'operations/inventory_recurring.html',
                    {
                        'products': serializer.data,
                        'addProductsForm': addProductsForm,
                        'editProductsForm': editProducts,
                        'importForm': importForm
                    }
                )


@api_view(['POST'])
def addProducts(request):
    """
    This function is used for Adding the products in recurring module.
    """
    recurringItems._history_date = datetime.now()
    serializer = ProductSerializer(data=request.POST)

    if serializer.is_valid():
        # serializer._history_date = datetime.now()
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editProducts(request, pk):
    """
    This function is used for Editing the products in recurring module.
    """
    product = recurringItems.objects.get(id=pk)
    product._history_date = datetime.now()

    if product.next_order_date != request.POST['next_order_date']:
        # Deleting the previous record of that id from the notifications
        # table when next order date is getting updated
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
    """
    This function is used for deleting the products in recurring module.
    """
    product = recurringItems.objects.get(id=pk)
    product._history_date = datetime.now()
    product.save()
    product.delete()
    return Response({}, status=201)


def load_products(request):
    """
    This function is used for loading the products based on slected type using AJAX.
    """
    item_id = request.GET.get('Type')
    products = Product_type.objects.filter(product_type_id=item_id).order_by('product_name')
    return render(request, 'operations/product_options.html', {'products': products})


def load_purchase_date(request):
    """
    This function is used for loading the purchase date based on the selected product.
    """
    product = request.GET.get('product')
    try:
        date = recurringItems.objects.filter(
                    product=product).order_by('-next_order_date').values(
                        'next_order_date')[0]['next_order_date']
        return JsonResponse({'data': date.strftime('%Y-%m-%d')})
    except:
        return JsonResponse({'data': ''})


class ImportrecurringView(View):
    """
    This function is used for Import functionality of recurring inventory.
    """
    context = {}

    def get(self,request):
        """This function is used for get request."""
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This function is used for post request."""
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = RecurringResource()

            data = data_set.load(file.read().decode('utf-8'), format=extension)
            print(data)

            if "Type" in data:
                print("enter in if")
                for x in range(len(data)):
                    type_id = Item_types.objects.filter(
                                type_name=data['type'][x]).values('type_id')[0]['type_id']
                    try:
                        p = Product_type.objects.get(
                                product_type_id=type_id, product_name=data['product'][x])
                    except:
                        p = Product_type.objects.create(
                                product_type_id=type_id, product_name=data['product'][x])
                        p.save()
            try:
                result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)

        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


def load_recurring_users(request):
    """
    This function is used for loading paid by users in recurring module.
    """
    PAID_BY = paid_by_list(recurringItems)
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})


@login_required(login_url='/auth/login')
def inventory_recurring_history(request):
    """
    This function is used for version history module of recurring section.
    """
    recurring_history = recurringItems.history.filter(history_type="-").all()
    return render(
                    request,
                    'operations/recurring_history.html',
                    {'recurring_history': recurring_history}
                )


def load_previous_recurring_history(request):
    """
    This function is used for checking if there is any change from the previous
    values in version history part of recurring module.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = recurringItems
    data = load_previous_history(model_name, recent_id, history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})


@login_required(login_url='/auth/login')
def recurring_row_history(request):
    """
    This function is used for each row version history module of recurring section.
    """
    row_id = request.GET.get('id')
    recurring_row_history = recurringItems.history.filter(
                                    id=row_id, history_type="+"
                                ).all() | recurringItems.history.filter(
                                    id=row_id, history_type="~"
                                ).all()
    return render(
                    request,
                    'operations/recurring_row_history.html',
                    {'recurring_row_history': recurring_row_history}
                )


@login_required(login_url='/auth/login')
def inventory_adhoc_view(request):
    """This function is used for adhoc module."""
    addAdhocProductsForm = AddAdhocItemsForm(auto_id=True)
    editAdhocProductsForm = EditAdhocItemsForm()
    importForm = ImportForm()

    if request.method == 'GET':
        qs = AdhocItems.objects.all().order_by("-id")
        serializer = AdhocItemSerializer(qs, many=True)
    return render(
                    request,
                    'operations/inventory_adhoc.html',
                    {
                        'products': serializer.data,
                        'addAdhocProductsForm': addAdhocProductsForm,
                        'editAdhocProductsForm': editAdhocProductsForm,
                        'importForm': importForm
                    }
                )


@api_view(['POST'])
def addAdhocProducts(request):
    """
    This function is used for adding products in adhoc module.
    """
    AdhocItems._history_date = datetime.now()
    serializer = AdhocItemSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editAdhocProducts(request, pk):
    """
    This function is used for editing the data in adhoc module.
    """
    product = AdhocItems.objects.get(id=pk)
    product._history_date = datetime.now()
    serializer = EditAdhocItemSerializer(instance=product, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteAdhocProducts(request, pk):
    """
    This function is used for deleting the row in adhoc module.
    """
    product = AdhocItems.objects.get(id=pk)
    product._history_date = datetime.now()
    product.save()
    product.delete()
    return Response({}, status=201)


class ImportadhocView(View):
    """
    This function is used for Import functionality of adhoc inventory.
    """
    context = {}

    def get(self,request):
        """This function is used for get request."""
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This function is used for post request."""
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = AdhocResource()
            data = data_set.load(file.read().decode('utf-8'), format=extension)
            try:
                result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


def load_adhoc_users(request):
    """
    This function is used for loading paid by users in adhoc module.
    """
    PAID_BY = paid_by_list(AdhocItems)
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})


def inventory_adhoc_history(request):
    """
    This function is used for version history module of recurring section.
    """
    adhoc_history = AdhocItems.history.filter(history_type="-").all()
    return render(request, 'operations/adhoc_history.html', {'adhoc_history': adhoc_history})


def load_previous_adhoc_history(request):
    """
    This function is used for checking if there is any change from the previous
    values in version history part of adhoc module.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = AdhocItems
    data = load_previous_history(model_name, recent_id, history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})


@login_required(login_url='/auth/login')
def adhoc_row_history(request):
    """
    This function is used for each row version history module of adhoc section.
    """
    row_id = request.GET.get('id')
    adhoc_row_history = AdhocItems.history.filter(
                                id=row_id, history_type="+"
                            ).all() | AdhocItems.history.filter(
                                id=row_id, history_type="~"
                            ).all()
    return render(
                    request,
                    'operations/adhoc_row_history.html',
                    {'adhoc_row_history': adhoc_row_history}
                )



@login_required(login_url='/auth/login')
def mro_maintenance_vendor(request):
    """
    This function is used for vendor section in MRO module.
    """
    addVendorForm = AddVendorForm()
    editVendorForm = EditVendorForm(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        vs = vendorContactList.objects.all().order_by("-id")
        serializer = vendorSerializer(vs, many=True)

    return render(
                    request,
                    'operations/mro_maintenance_vendor.html',
                    {
                        'vendor':serializer.data,
                        'addVendorForm': addVendorForm,
                        'editVendorForm': editVendorForm,
                        'importForm': importForm
                    }
                )


@api_view(['POST'])
def addVendor(request):
    """
    This function is used for adding vendor details in vendor section in MRO module.
    """
    vendorContactList._history_date = datetime.now()
    serializer = vendorSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editVendor(request, pk):
    """
    This function is used for editing vendor details in vendor section in MRO module.
    """
    vendor = vendorContactList.objects.get(id=pk)
    vendor._history_date = datetime.now()
    serializer = editVendorSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteVendor(request, pk):
    """
    This function is used for deleting vendor details in vendor section in MRO module.
    """
    vendor = vendorContactList.objects.get(id=pk)
    vendor._history_date = datetime.now()
    vendor.save()
    vendor.delete()
    return Response({}, status=201)


def load_vendor(request):
    """
    This function is used for loading vendor details based on the service selected.
    """
    service_of = request.GET.get('service_of')
    vendor_name = vendorContactList.objects.filter(
                    service=service_of).values('vendor_name')
    return render(
                    request,
                    'operations/vendor_options.html',
                    {'vendor_name': vendor_name}
                )


def load_vendor_no(request):
    """
    This function is used for loading vendor number based on the
    vendor name and the service selected.
    """
    vendor_name = request.GET.get('vendor_name')
    service_name = request.GET.get('service_name')
    try:
        contact_no = vendorContactList.objects.filter(
                        vendor_name=vendor_name, service=service_name
                    ).values('contact_no')[0]['contact_no']
        return JsonResponse({'contact_no': contact_no})
    except:
        return JsonResponse({'contact_no': ''})


class ImportvendorView(View):
    """
    This function is used Import functionality of vendor details.
    """
    context = {}

    def get(self,request):
        """This function is used for get request."""
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This function is used for post request."""
        form = ImportForm(request.POST, request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = VendorResource()
            data = data_set.load(file.read().decode('utf-8'), format=extension)
            try:
                result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


def mro_vendor_history(request):
    """
    This function is used for loading vendor history in MRO module.
    """
    vendor_history = vendorContactList.history.filter(history_type="-").all()
    return render(request, 'operations/vendor_history.html', {'vendor_history': vendor_history})

def load_previous_vendor_history(request):
    """
    This function is used for checking if there is any change from the previous
    values in version history part of vendor section.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = vendorContactList
    data = load_previous_history(model_name, recent_id, history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})


@login_required(login_url='/auth/login')
def vendor_row_history(request):
    """
    This function is used for each row version history module of adhoc section.
    """
    row_id = request.GET.get('id')
    vendor_row_history = vendorContactList.history.filter(
                                id=row_id, history_type="+"
                            ).all() | vendorContactList.history.filter(
                                id=row_id, history_type="~"
                            ).all()
    return render(
                    request,
                    'operations/vendor_row_history.html',
                    {'vendor_row_history': vendor_row_history}
                )



@login_required(login_url='/auth/login')
def mro_maintenance_service(request):
    """
    This function is used for service section in MRO mmodule.
    """
    addRepairServicesForm = AddRepairServicesForm()
    editRepairServicesForm = EditRepairServicesForm(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        rs = repairServices.objects.all().order_by("-id")
        serializer = repairServicesSerializer(rs, many=True)

    return render(
                    request,
                    'operations/mro_maintenance_service.html',
                    {
                        'service': serializer.data,
                        'addRepairServicesForm': addRepairServicesForm,
                        'editRepairServicesForm': editRepairServicesForm,
                        'importForm': importForm
                    }
                )


@api_view(['POST'])
def addRepairServices(request):
    """
    This function is used for adding details in repair services in MRO module.
    """
    repairServices._history_date = datetime.now()
    serializer = repairServicesSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def editRepairServices(request, pk):
    """"
    This function is used for editing repair services in MRO module.
    """
    vendor = repairServices.objects.get(id=pk)
    vendor._history_date = datetime.now()
    serializer = editRepairServicesSerializer(instance=vendor, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteRepairServices(request, pk):
    """
    This function is used for deleting repair services in MRO module.
    """
    vendor = repairServices.objects.get(id=pk)
    vendor._history_date = datetime.now()
    vendor.save()
    vendor.delete()
    return Response({}, status=201)


def mro_service_history(request):
    """
    This function is used for loading service history in MRO module.
    """
    service_history = repairServices.history.filter(history_type="-").all()
    return render(
                    request,
                    'operations/service_history.html',
                    {'service_history': service_history}
                )


def load_previous_service_history(request):
    """
    This function is used for checking if there is any change from the previous
    values in version history part of service section.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = repairServices
    data = load_previous_history(model_name, recent_id, history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})


def load_mro_users(request):
    """
    This function is used for loading paid by users in MRO module.
    """
    PAID_BY = paid_by_list(repairServices)
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})


@login_required(login_url='/auth/login')
def service_row_history(request):
    """
    This function is used for each row version history module of adhoc section.
    """
    row_id = request.GET.get('id')
    service_row_history = repairServices.history.filter(
                                id=row_id, history_type="+"
                            ).all() | repairServices.history.filter(
                                id=row_id, history_type="~"
                            ).all()
    return render(
                    request,
                    'operations/service_row_history.html',
                    {'service_row_history': service_row_history}
                )



@login_required(login_url='/auth/login')
def engagements_on_off_boarding_view(request):
    """
    This function is used for onBoarding and offBoarding module in engagements section.
    """
    addJoiningForm = AddJoiningForm()
    editJoiningForm = EditJoiningForm(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        rs = engagementJoining.objects.all().order_by('-details_id')
        serializer = joiningSerializer(rs, many=True)
    return render(
                    request,
                    'operations/boarding.html',
                    {
                        'joiningData': serializer.data,
                        'addJoiningForm': addJoiningForm,
                        'editJoiningForm': editJoiningForm,
                        'importForm': importForm
                    }
                )


@api_view(['POST'])
def addJoining(request):
    """
    This function is used for adding the joining details of an employee.
    """
    engagementJoining._history_date = datetime.now()
    serializer = joiningSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)



@api_view(['POST'])
def editJoining(request, pk):
    """
    This function is used for editing the joining details of an employee.
    """
    employee = engagementJoining.objects.get(id=pk)
    employee._history_date = datetime.now()
    serializer = editJoiningSerializer(instance=employee, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def deleteJoining(request, pk):
    """
    This function is used for deleting the joining details of an employee.
    """
    employee = engagementJoining.objects.get(id=pk)
    employee._history_date = datetime.now()
    employee.save()
    employee.delete()
    return Response({}, status=201)


class ImportJoiningView(View):
    """
    This class is used for Import functionality of joining-boarding.
    """
    context = {}

    def get(self,request):
        """This function is used for get request."""
        form = ImportForm()
        self.context['form'] = form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This function is used for post request."""
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = JoiningResource()
            data = data_set.load(file.read().decode('utf-8'), format=extension)
            try:
                if data['Joining Date']:
                    result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


class ImportExitView(View):
    """
    This class is used for Import functionality of exit-boarding.
    """
    context = {}

    def get(self,request):
        """This function is used for get request."""
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This function is used for post request."""
        form = ImportForm(request.POST , request.FILES)
        data_set = Dataset()
        if form.is_valid():
            file = request.FILES['import_file']
            extension = file.name.split(".")[-1].lower()
            resource = ExitResource()
            data = data_set.load(file.read().decode('utf-8'), format=extension)
            try:
                if data['Last Working Date']:
                    result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


def enagagements_boarding_history(request):
    """
    This function is used for loading boarding history in engagements module
    """
    boarding_history = engagementJoining.history.filter(
                        history_type="-").all().order_by('-details_id')
    return render(
                    request,
                    'operations/boarding_history.html',
                    {'boarding_history': boarding_history}
                )


def load_previous_engagements_history(request):
    """
    This function is used for checking if there is any change from the previous
    values in version history part of engagements section.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = engagementJoining
    data = load_previous_history(model_name, recent_id,history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})

@login_required(login_url='/auth/login')
def boarding_row_history(request):
    """
    This function is used for each row version history module of adhoc section
    """
    row_id = request.GET.get('id')
    boarding_row_history = engagementJoining.history.filter(
                                    id=row_id, history_type="+"
                                ).all() | engagementJoining.history.filter(
                                    id=row_id, history_type="~"
                                ).all()
    return render(
                    request,
                    'operations/boarding_row_history.html',
                    {'boarding_row_history': boarding_row_history}
                )

@login_required(login_url='/auth/login')
def office_events_view(request):
    """This function is used for office events module."""
    addEventForm = AddEventForm()
    editEventForm = EditEventForm(auto_id=True)
    importForm = ImportForm()

    if request.method == 'GET':
        ev = officeEvents.objects.all().order_by("-id")
        serializer = EventSerializer(ev, many=True)

    return render(
                    request,
                    'operations/office_events.html',
                    {
                        'officeEvents':serializer.data,
                        'addEventForm': addEventForm,
                        'editEventForm': editEventForm,
                        'importForm': importForm
                    }
                )

def load_officeEvents_users(request):
    """
    This function is used for loading paid by users in Office-event module.
    """
    PAID_BY = paid_by_list(officeEvents)
    return render(request, 'operations/paid_by.html', { 'paid_by': PAID_BY})

@api_view(['POST'])
def addOfficeEvents(request):
    """
    This function is used for adding the office events detail.
    """
    # print(request.META.get('HTTP_REFERER', '/'))
    officeEvents._history_date = datetime.now()
    serializer = EventSerializer(data=request.POST)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def editOfficeEvents(request, pk):
    """
    This function is used for editing the office events detail.
    """
    event = officeEvents.objects.get(id=pk)
    event._history_date = datetime.now()
    serializer = EditEventSerializer(instance=event, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def deleteOfficeEvents(request, pk):
    """
    This function is used for deleting the office events detail.
    """
    details = officeEvents.objects.get(id=pk)
    details._history_date = datetime.now()
    details.save()
    details.delete()
    return Response({}, status=201)

def export_csv(request):
    """This function is used for Export functionality of office event."""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] ='attachment; filename=Office Events.csv'
    writer = csv.writer(response)
    writer.writerow([
                        'Date', 'Event Name',
                        'Activity Planned',
                        'Item Name', 'Item Price',
                        'Food Name', 'Food Price',
                        'Remarks'
                    ])
    events = officeEvents.objects.all().values_list(
                'date', 'event_name', 'activity_planned', 'item', 'food', 'remarks')

    for event in events:
        itemlen = len(event[3])
        foodlen = len(event[4])
        if itemlen > foodlen:
            for i in range(itemlen):
                if i < foodlen :
                    writer.writerow([
                                event[0],event[1],event[2],list(event[3].keys())[i],
                                list(event[3].values())[i],list(event[4].keys())[i],
                                list(event[4].values())[i],event[5]
                            ])
                else :
                    writer.writerow([
                                event[0],event[1],event[2],list(event[3].keys())[i],
                                list(event[3].values())[i],"Null","Null",event[5]
                            ])
        else:
            for i in range(foodlen):
                if i < itemlen :
                    writer.writerow([
                                event[0],event[1],event[2],list(event[3].keys())[i],
                                list(event[3].values())[i],list(event[4].keys())[i],
                                list(event[4].values())[i],event[5]
                            ])
                else :
                    writer.writerow([
                                event[0],event[1],event[2],"Null","Null",
                                list(event[4].keys())[i],
                                list(event[4].values())[i],event[5]
                            ])

    return response

class ImportOfficeEventsView(View):
    """This function is used for Import functionality of office events."""
    context = {}

    def get(self,request):
        """This function is used for get request."""
        form = ImportForm()
        self.context['form'] =form
        return JsonResponse({}, status=201)

    def post(self, request):
        """This function is used for post request."""
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
                        return JsonResponse(
                                    {"error":"Incorrect data format, should be YYYY-MM-DD."},
                                    status=400
                                )
                    datedata = officeEvents.objects.filter(date=date).values_list('date')
                    if datedata:
                        return JsonResponse({"error":"Date is already exist."},status=400)
                    else:
                        try:
                            data_list = []
                            item = {}
                            food = {}
                            zip_data = zip(
                                            frame["Event Name"],
                                            frame["Activity Planned"],
                                            frame["Remarks"]
                                        )
                            for event,activity,remark in zip_data:
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
                            return JsonResponse(
                                        # {"error": "{} column does not exist.".format(e.args[0])},
                                        {"error": f'{e.args[0]} column does not exist.'},
                                        status=400
                                    )
                        data_list.extend([date, event_name, activity_name, item, food, remark_name])
                        complete_data.append(data_list)

                df = pd.DataFrame(
                        complete_data,
                        columns=[
                                    'date', 'event_name',
                                    'activity_planned',
                                    'item', 'food',
                                    'remarks'
                                ]
                    )
                data = data_set.load(df)
            try:
                result = import_func(data_set, resource)
                return JsonResponse({}, status=201)
            except ValidationError as e:
                length = len(e.message_dict)
                return JsonResponse({"error": e.message_dict, "length" : length},status=400)
            except Exception:
                return JsonResponse({"error": "Check imported file & try again."},status=400)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({"error":"Invalid file format."},status=400)


def load_events_name(request):
    """
    This function is used for loading event name in office event module.
    """
    events_name = officeEvents.objects.values_list('event_name', flat=True).distinct()
    Events = []
    for value in events_name:
        Events.append(value)
    Events.append("Other")
    return render(request, 'operations/events.html', { 'events': Events})


def enagagements_officeEvents_history(request):
    """
    This function is used for loading officeEvents history in engagements module.
    """
    officeEvents_history = officeEvents.history.filter(history_type="-").all()
    return render(
                    request,
                    'operations/officeEvents_history.html',
                    {'officeEvents_history': officeEvents_history}
                )


def load_previous_officeEvents_history(request):
    """
    This function is used for checking if there is any change from the previous values
    in version history part of officeEvents section.
    """
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    model_name = officeEvents
    data = load_previous_history(model_name, recent_id, history_id)
    try:
        if data:
            return JsonResponse({'data': data})
        return JsonResponse({'data': None})
    except Exception as e:
        return JsonResponse({'data': None})


@login_required(login_url='/auth/login')
def officeEvents_row_history(request):
    """
    This function is used for each row version history module of adhoc section.
    """
    row_id = request.GET.get('id')
    officeEvents_row_history = officeEvents.history.filter(
                                    id=row_id, history_type="+"
                                ).all() | officeEvents.history.filter(
                                    id=row_id, history_type="~"
                                ).all()
    return render(
                    request,
                    'operations/officeEvents_row_history.html',
                    {'officeEvents_row_history': officeEvents_row_history}
                )
