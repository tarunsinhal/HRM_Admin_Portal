from django.db import models
from django.http import request
from rest_framework import serializers
from .models import FoodInventory,Item_types, Product_type, recurringItems


class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_types


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = recurringItems
        fields = '__all__'
    
    def __init__(self, *args, instance=None, data=None, **kwargs):

        if data:
            data._mutable = True
            data['unit'] = data['unit_0'] + ' ' +  data['unit_1']
            if data['new_product']:
                try:
                    p = Product_type.objects.get(product_type_id=data['type'], product_name=data['new_product'])
                except:
                    p = Product_type.objects.create(product_type_id=data['type'], product_name=data['new_product'])
                    p.save()
                data['product'] = p.pk
            data._mutable = False
            super(ProductSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(ProductSerializer, self).__init__(instance=instance, data=data, **kwargs)
    
    def to_representation(self, instance):
        rep = super(ProductSerializer, self).to_representation(instance)
        rep['product'] = instance.product.product_name
        return rep
        
    def validate(self, data):
        if data['purchase_date'] > data['next_order_date']:
            raise serializers.ValidationError("Next Order date should be greater than purchase date!!!")
        return data


class editProductSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        fields = ['product', 'quantity', 'price', 'amount', 'purhase_date', 'next_order_date']
