from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.

@login_required(login_url='/login')
def operations_view(request):
    return render(request, 'operations/operations.html')


def food_view(request):
    return render(request, 'operations/food_inventory.html')