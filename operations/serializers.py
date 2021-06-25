from django.db import models
from rest_framework import serializers
from .models import FoodInventory,Item_types, Product_type


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
            if data['new_product']:
                try:
                    p = Product_type.objects.get(product_type_id=data['type'], product_name=data['new_product'])
                except:
                    p = Product_type.objects.create(product_type_id=data['type'], product_name=data['new_product'])
                    p.save()
                data['product'] = p.pk
            data._mutable = False
            super(FoodSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(FoodSerializer, self).__init__(instance=instance, data=data, **kwargs)
    
    def to_representation(self, instance):
        rep = super(FoodSerializer, self).to_representation(instance)
        rep['product'] = instance.product.product_name
        return rep
        
    def validate(self, data):
        if data['last_order_date'] > data['expected_order_date']:
            raise serializers.ValidationError("This Tweet is too long!!!")
        return data


class editFoodSerializer(FoodSerializer):
    class Meta(FoodSerializer.Meta):
        fields = ['product', 'quantity', 'price', 'amount', 'last_order_date', 'expected_order_date']
