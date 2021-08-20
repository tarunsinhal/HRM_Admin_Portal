from enum import Flag
from django.contrib.auth.decorators import user_passes_test
from django.shortcuts import render
from functools import wraps
# Create your views here.


def it_infra_view(request):
    return render(request, 'IT_Infra/it_infra.html')


def it_inventory_view(request):
    return render(request, 'IT_Infra/it_inventory.html')

