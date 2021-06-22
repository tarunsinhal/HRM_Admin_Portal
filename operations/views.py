
from django.http.response import HttpResponseRedirect
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from rest_framework.serializers import Serializer
from .models import FoodInventory
from django.http import JsonResponse
from .serializers import FoodSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
import requests 
from .forms import AddProducts, EditProducts
from django.urls import reverse
from django.views import generic
# from .forms import AddProducts

# Create your views here.

@login_required(login_url='/auth/login')
def operations_view(request):
    return render(request, 'operations/operations.html')


def food_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    results = callApi.json()
    return render(request, 'operations/food_inventory.html', {'products': results, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})

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


@api_view(['GET'])
def getProducts(request):
    if request.method == 'GET':
        qs = FoodInventory.objects.all()
        serializer = FoodSerializer(qs, many=True)
        return Response(serializer.data)


@api_view(['POST'])
def addProducts(request):
    print(request.META.get('HTTP_REFERER', '/'))
    serializer = FoodSerializer(data=request.POST)
    if serializer.is_valid():
        serializer.save()
    return redirect('/operations/food')


@api_view(['POST'])
def editProducts(request, pk):
    product = FoodInventory.objects.get(id=pk)
    serializer = FoodSerializer(instance=product, data=request.POST)
    if serializer.is_valid():
        serializer.save()
    return redirect('/operations/food')


@api_view(['POST'])
def deleteProducts(request, pk):
    product = FoodInventory.objects.get(id=pk)
    product.delete()
    return redirect('/operations/food')


def maintenance_view(request):
    return render(request, 'operations/maintenance.html')
