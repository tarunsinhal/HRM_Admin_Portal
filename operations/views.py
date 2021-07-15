
from django.forms.widgets import DateInput
from django.http.response import HttpResponse, HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from rest_framework.serializers import Serializer
from .models import FoodInventory, Product_type, recurringItems
from django.http import JsonResponse
from .serializers import ProductSerializer, editProductSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests 
from .forms import AddProducts, EditProducts
from django.urls import reverse
from django.views import generic
from home.models import notifications

# Create your views here.

@login_required(login_url='/auth/login')
def operations_view(request):
    return redirect(reverse('operations:pantry_view'))


@login_required(login_url='/auth/login')
def pantry_view(request):
    return render(request, 'operations/pantry.html')


@login_required(login_url='/auth/login')
def mro_view(request):
    return render(request, 'operations/mro_supplies.html')


@login_required(login_url='/auth/login')
def engagements_view(request):
    return render(request, 'operations/pantry.html')


@login_required(login_url='/auth/login')
def pantry_recurring_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    # callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    # results = callApi.json()

    if request.method == 'GET':
        qs = recurringItems.objects.all()
        serializer = ProductSerializer(qs, many=True)

    return render(request, 'operations/food_inventory.html', {'products': serializer.data, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})


@api_view(['POST'])
def addProducts(request):
    print(request.META.get('HTTP_REFERER', '/'))
    print(request.POST)
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
        date = recurringItems.objects.filter(product=product).order_by('-next_order_date').values('next_order_date')[0]['next_order_date']
        return JsonResponse({'data':date.strftime('%Y-%m-%d')})
    except:
        return JsonResponse({'data': ''})


def maintenance_view(request):
    return render(request, 'operations/maintenance.html')







# class IndexView(generic.ListView):
#     template_name = "operations/food_inventory.html"
#     context_object_name = "products"
#     paginate_by = 3

#     def get_queryset(self):
#         qs = FoodInventory.objects.all()
#         # serializer = FoodSerializer(qs, many=True)
#         return qs

#     def get_context_data(self, **kwargs):
#         context = super(IndexView, self).get_context_data(**kwargs)
#         # callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
#         # results = callApi.json()
#         addProductsForm = AddProducts()
#         editProducts = EditProducts(auto_id=True)
#         # context['products'] = results
#         context['addProductsForm'] = addProductsForm
#         context['editProductsForm'] = editProducts
#         return context


# @api_view(['GET'])
# def getProducts(request):
#     if request.method == 'GET':
#         qs = recurringItems.objects.all()
#         serializer = ProductSerializer(qs, many=True)
#         return Response(serializer.data)

