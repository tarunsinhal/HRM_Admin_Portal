
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
# from .forms import AddProducts

# Create your views here.

@login_required(login_url='/auth/login')
def operations_view(request):
    return render(request, 'operations/operations.html')


def food_view(request):
    addProductsForm = AddProducts()
    editProducts = EditProducts(auto_id=True)
    print(addProductsForm)
    callApi = requests.get('http://127.0.0.1:8000/operations/food/getProducts')
    results = callApi.json()
    return render(request, 'operations/food_inventory.html', {'products': results, 'addProductsForm': addProductsForm, 'editProductsForm': editProducts})


@api_view(['GET'])
def getProducts(request):
    if request.method == 'GET':
        qs = FoodInventory.objects.all()
        serializer = FoodSerializer(qs, many=True)
        return Response(serializer.data)


@api_view(['POST'])
def addProducts(request):
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