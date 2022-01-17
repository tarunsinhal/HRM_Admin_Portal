from django.db.models import fields
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import serializers
from rest_framework.response import Response
from .serializers import it_inventory_serializer, it_allotment_serializer, it_inventory_edit_serializer, hardware_allotted_add_serializer, software_allotted_add_serializer
from rest_framework.serializers import Serializer
from .forms import ImageForm, it_inventory_add_form, it_inventory_edit_form, it_allotment_add_form, it_allotment_full_add_form, hardware_allotted_add_form, software_allotted_add_form, ImportForm, it_allotment_edit_form
from .models import employee_id_sql, it_allotment, it_inventory, it_inventory_item, hardware_allotted_items, it_inventory_status, software_allotted_items, damage_images
from django.http import JsonResponse
from django.db import connection
from django.contrib.auth.decorators import login_required
from django.views import View
import json
from django.forms import modelformset_factory, inlineformset_factory
from tablib import Dataset
import pandas as pd
from .resources import itInventoryResource
from django.core.files.storage import FileSystemStorage
from django.forms.widgets import Select, TextInput


@login_required(login_url='/auth/login')
def it_infra_view(request):
    return render(request, 'IT_Infra/it_infra.html')


@login_required(login_url='/auth/login')
def it_inventory_view(request):
    add_form = it_inventory_add_form()
    edit_form = it_inventory_edit_form(auto_id=True)
    data = it_inventory.objects.all()
    system_names = it_inventory.objects.filter(item_id=1, status_id=1).values()
    if request.method == 'GET':
        qs = it_inventory.objects.all()
        serializer = it_inventory_serializer(qs, many=True)
    
    importForm = ImportForm()

    return render(request, 'IT_Infra/it_inventory.html', {"addInventoryForm": add_form, "editInventoryForm": edit_form, 'inventory_data': serializer.data, 'system_names': system_names, 'importForm': importForm})


def load_item_data(request):
    type_id = request.GET.get('Type')
    item = it_inventory_item.objects.filter(type_id=type_id).order_by('item')
    return render(request, 'IT_Infra/item_options.html', {'items': item})


@api_view(['POST'])
def add_inventory(request):
    request.POST._mutable = True
    request.POST['system_names'] = json.dumps(request.POST.getlist('system_names'))
    serializer = it_inventory_serializer(data=request.POST)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def edit_inventory(request, pk):
    product = it_inventory.objects.get(id=pk)

    request.POST._mutable = True
    request.POST['system_names'] = json.dumps(request.POST.getlist('system_names'))

    serializer = it_inventory_edit_serializer(instance=product, data=request.POST)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def delete_inventory(request, pk):
    product = it_inventory.objects.get(id=pk)
    product.delete()
    return Response({}, status=201)


@login_required(login_url='/auth/login')
def inventory_history(request):
    history = it_inventory.history.all().order_by('-history_date')
    return render(request, 'IT_Infra/inventory_history.html', {'it_inventory_history': history})


def load_previous_inventory_history(request):
    recent_id = request.GET.get('id')
    history_id = request.GET.get('history_id')
    res = list(it_inventory.history.filter(id=recent_id).order_by('-history_id').values())
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
            resource = itInventoryResource()

            if extension == 'csv':
                data = data_set.load(file.read().decode('utf-8'), format=extension)
            else:
                return JsonResponse({},status=400)
            result = resource.import_data(data_set, dry_run=True, collect_failed_rows=True, raise_errors=False,)
            if result.has_validation_errors() or result.has_errors():
                self.context['result'] = result
                return JsonResponse({},status=400)
            else:
                result = resource.import_data(data_set, dry_run=False, raise_errors=False)
                self.context['result'] = None
                return JsonResponse({}, status=201)
        else:
            self.context['form'] = ImportForm()
            return JsonResponse({},status=400)
        return JsonResponse({}, status=201)


cursor = connection.cursor()

def load_data(request):
    emp_code = request.GET.get('code')
    try:
        cursor.execute("SELECT full_name FROM hrm.employee WHERE employee_code=%s ORDER BY created_on DESC", [emp_code])
        name = cursor.fetchone()[0]
        return JsonResponse({'name': name})
    except:
        return None


# function to fetch the distinct employee code from hrm DB and then further filtering if that employee id is already added.
def load_employee_code(request):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM (SELECT DISTINCT(employee_code) FROM hrm.employee) AS ed WHERE ed.employee_code NOT IN (SELECt DISTINCT(employee_id) FROM admin_portal.it_infra_it_allotment)")
    row = cursor.fetchall()
    final_row = []
    for i in row:
        final_row.append((i[0], i[0]))
    return render(request, 'IT_Infra/employee_code.html', {'data': final_row})


@login_required(login_url='/auth/login')
def it_allotment_view(request):
    add_form = it_allotment_add_form()
    edit_form = it_allotment_edit_form(auto_id=True)
    hardware_items = it_inventory_item.objects.filter(type_id=1).values()
    software_items = it_inventory_item.objects.filter(type_id=2).values()

    hardware_allotment_formset = modelformset_factory(hardware_allotted_items, extra=len(hardware_items), form=hardware_allotted_add_form, fields="__all__")
    hardware_formset = hardware_allotment_formset(prefix='hardware', queryset=hardware_allotted_items.objects.none())

    software_allotment_formset  = modelformset_factory(software_allotted_items, extra=len(software_items), form=software_allotted_add_form, fields="__all__")
    software_formset = software_allotment_formset(prefix='software', queryset=software_allotted_items.objects.none())

    if request.method == 'GET':
        qs = it_allotment.objects.all()
        serializer = it_allotment_serializer(qs, many=True)

    return render(request, 'IT_Infra/IT_allotment.html', {"addForm": add_form, "editForm": edit_form, "hardware_items": zip(hardware_items, hardware_formset), "hardware_items1": zip(hardware_items, hardware_formset), "software_items": zip(software_items, software_formset), 'data': serializer.data})


# def load_employee_data(request):
#     employee_id = request.GET.get('code')

#     data = list(it_inventory.objects.filter(allottee_id=employee_id).values())
#     return JsonResponse({'data': data})


def load_item_name(request):
    item_id = request.GET.get('itemId')
    names = it_inventory.objects.filter(item_id=item_id, status=2).values()
    return render(request, 'IT_Infra/item_names_dropdown.html', {'names_list': names})
    

def load_item_details(request):
    itemId = request.GET.get('id')
    data = it_inventory.objects.filter(id=itemId).values()[0]
    return JsonResponse({'data': data})


# adding the details in IT allotment
@api_view(['POST'])
def it_allotment_add_view(request):

    # getting all the addded images in the add form
    images = request.FILES.getlist("file[]")
    print(request.POST)

    allotment = it_allotment()

    #looping over the added images and and storing each image in the damage_images model
    # for img in images:
    #     fs = FileSystemStorage()
    #     file_path = fs.save('static/media/'+img.name, img)
    #     dImage = damage_images(allotment_id_id=1, images_for_damage=file_path)
    #     dImage.save()
    

    allotment_form = it_allotment_add_form(request.POST)

    serializer = it_allotment_serializer(data=request.POST)

    hardware_items = len(it_inventory_item.objects.filter(type_id=1).values_list())
    software_items = len(it_inventory_item.objects.filter(type_id=2).values_list())

    #looping over the no. of hardware items
    for i in range(hardware_items):
        res = {}
        if 'hardware-'+str(i)+'-item_name' in request.POST:
            res['employee_id'] = request.POST['employee_id']
            res['employee_name'] = request.POST['employee_name']
            res['item_name'] = request.POST['hardware-'+str(i)+'-item_name']
            res['details'] = request.POST['hardware-'+str(i)+'-details']
            res['additional'] = request.POST['hardware-'+str(i)+'-additional']
            res['item'] = request.POST['hardware-'+str(i)+'-item']
            res['status'] = it_inventory_status.objects.get(status_id=1).pk

        if res:
            hardware_serializer = hardware_allotted_add_serializer(data=res)
            if hardware_serializer.is_valid() and serializer.is_valid():
                hardware_serializer.save()

                inventory = it_inventory.objects.get(id=res['item_name'])
                inventory.allottee_id = res['employee_id']
                inventory.allotte_name = res['employee_name']
                inventory.status = it_inventory_status.objects.get(status='Allotted')
                inventory.save()
    
    for i in range(software_items):
        res = {}
        if 'software-'+str(i)+'-item_name' in request.POST:
            res['employee_id'] = request.POST['employee_id']
            res['employee_name'] = request.POST['employee_name']
            res['item_name'] = request.POST['software-'+str(i)+'-item_name']
            res['details'] = request.POST['software-'+str(i)+'-details']
            res['validity_start_date'] = request.POST['software-'+str(i)+'-validity_start_date']
            res['validity_end_date'] = request.POST['software-'+str(i)+'-validity_end_date']
            res['additional'] = request.POST['software-'+str(i)+'-additional']
            res['item'] = request.POST['software-'+str(i)+'-item']
            res['status'] = it_inventory_status.objects.get(status_id=1).pk

        if res:
            software_serializer = software_allotted_add_serializer(data=res)
            if software_serializer.is_valid() and serializer.is_valid():
                software_serializer.save()

                inventory = it_inventory.objects.get(id=res['item_name'])
                inventory.allottee_id = res['employee_id']
                inventory.allotte_name = res['employee_name']
                inventory.status = it_inventory_status.objects.get(status='Allotted')
                inventory.save()
        
    if serializer.is_valid():
        serializer.save()

        for img in images:
            im = damage_images(allotment=serializer.instance, images_for_damage=img)
            im.save()

        return Response(serializer.data, status=201)


# function for loading the allotted item names and its details for a particular employee on the basis of employee id
def load_allotted_items(request):
    emp_id = request.GET.get('employee_id')
    
    #filtering out the hardware allotted items values based on employee id
    hardware_items = hardware_allotted_items.objects.filter(employee_id=emp_id).values('item__item', 'item_name__name', 'details', 'additional', 'employee_id', 'employee_name')
    #filtering out the software allotted items values based on employee id
    software_items = software_allotted_items.objects.filter(employee_id=emp_id).values('item__item', 'item_name__name', 'details', 'additional', 'validity_start_date', 'validity_end_date')

    return render(request, 'IT_Infra/allotted_items.html', {'hardware_items': hardware_items, 'software_items': software_items, 'employee_id': hardware_items[0]['employee_id'], 'employee_name': hardware_items[0]['employee_name']})


def load_edit_allotment_details(request):
    emp_code = request.GET.get('emp_code')
    allotted_hardware = hardware_allotted_items.objects.filter(employee_id=emp_code, status_id=1)
    allotted_software = software_allotted_items.objects.filter(employee_id=emp_code)

    initial_hardware = [{'item': i.item, 'name': i.item.item, 'item_name': i.item_name, 'details': i.details, 'additional': i.additional, 'status': i.status} for i in allotted_hardware]
    initial_software = [{'item': i.item, 'item_name': i.item_name, 'details': i.details, 'additional': i.additional, 'validity_start_date': i.validity_start_date, 'validity_end_date': i.validity_end_date, 'status': i.status} for i in allotted_software]

    hardware_items = it_inventory_item.objects.filter(type_id=1).values()
    software_items = it_inventory_item.objects.filter(type_id=2).values()

    extra_hardware = []
    for i in hardware_items:
        if i['id'] not in [k['item'].id for k in initial_hardware]:
            extra_hardware.append({'item': i})
    
    extra_software = []
    for i in software_items:
        if i['id'] not in [k['item'].id for k in initial_software]:
            extra_software.append({'item': i})

    hardware_allotment_formset = modelformset_factory(hardware_allotted_items, extra=len(extra_hardware)+len(initial_hardware), form=hardware_allotted_add_form, 
                                widgets={'item_name': Select(attrs={'type': 'text', 'disabled': True, 'class': "edit_item_names form-select", 'onchange': 'editItemNamesChange(this)'}),
                                        'details': TextInput(attrs={'type': 'text', 'readOnly': True, 'class': "form-control"}),
                                        'additional': TextInput(attrs={'type': 'text', 'class': "form-control"})}, fields="__all__")
    hardware_formset = hardware_allotment_formset(auto_id=True, prefix='hardware', initial=initial_hardware, queryset=hardware_allotted_items.objects.none())

    software_allotment_formset  = modelformset_factory(software_allotted_items, extra=len(extra_software)+len(initial_software), form=software_allotted_add_form,
                                 widgets={'item_name': Select(attrs={'type': 'text', 'disabled': True, 'class': "edit_item_names form-select", 'onchange': 'editItemNamesChange(this)'}),
                                        'details': TextInput(attrs={'type': 'text', 'readOnly': True, 'class': "form-control"}),
                                        'validity_start_date': TextInput(attrs={'type':'text', 'readOnly': True, 'class':"chk form-control"}),
                                        'validity_end_date': TextInput(attrs={'type':'text', 'readOnly': True, 'class':"chk form-control"}),
                                        'additional': TextInput(attrs={'type': 'text', 'class': "form-control"})}, fields="__all__")
    software_formset = software_allotment_formset(auto_id=True, prefix='software', initial=initial_software, queryset=software_allotted_items.objects.none())

    return render(request, 'IT_Infra/edit_allotment_details.html', {'allotted_hardware': allotted_hardware, 'allotted_software': allotted_software, "hardware_items": zip(initial_hardware+extra_hardware, hardware_formset), "software_items": zip(initial_software+extra_software, software_formset),
                'initial_hardware': initial_hardware, 'initial_software': initial_software})


def it_allotment_edit_view(request):
    pass