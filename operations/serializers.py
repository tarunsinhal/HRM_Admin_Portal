from django.db import models
from rest_framework import serializers
from .models import FoodInventory,Item_types


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_types


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodInventory
        fields = '__all__'
    
    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            data['amount'] = int(data['price']) * int(data['quantity'])
            data._mutable = False
            super(FoodSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(FoodSerializer, self).__init__(instance=instance, data=data, **kwargs)
           
        
    def validate(self, data):
        if data['last_order_date'] > data['expected_order_date']:
            raise serializers.ValidationError("This Tweet is too long!!!")
        return data