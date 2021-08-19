from django.db import models
from django.http import request
from rest_framework import serializers
from .models import FoodInventory,Item_types, Product_type, dailyWeeklyItems, recurringItems, vendorContactList, repairServices


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
            data['unit'] = data['unit_0'] + ' ' + data['unit_1']
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
        fields = ['product', 'quantity', 'unit', 'price', 'discount', 'amount', 'paid_by', 'purchase_date',
                  'next_order_date']


class AdhocItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdhocItems
        fields = '__all__'
    # def __init__(self, *args, instance=None, data=None, **kwargs):
    #
    #     if data:
    #         data._mutable = True
    #         if data['add_user']:
    #             try:
    #                 p = AdhocItems.objects.get(product_type_id=data['type'], product_name=data['add_user'])
    #             except:
    #                 p = Product_type.objects.create(product_type_id=data['type'], product_name=data['new_product'])
    #                 p.save()
    #             data['product'] = p.pk
    #         data._mutable = False
    #         super(ProductSerializer, self).__init__(instance=instance, data=data, **kwargs)
    #     super(ProductSerializer, self).__init__(instance=instance, data=data, **kwargs)



class EditAdhocItemSerializer(AdhocItemSerializer):
    class Meta(AdhocItemSerializer.Meta):
        fields = ['product', 'quantity', 'unit','price', 'amount', 'paid_by', 'purchase_date',
                  'additional_info']
        fields = ['product', 'quantity', 'unit', 'discount', 'amount', 'paid_by', 'purchase_date', 'next_order_date']


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = dailyWeeklyItems
        fields = '__all__'

class editItemSerializer(ItemSerializer):
    class Meta(ItemSerializer.Meta):
        fields = ['purchase_date', 'product', 'quantity', 'unit', 'amount', 'aditional_info']

class vendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = vendorContactList
        fields = '__all__'
        
    def __init__(self, *args, instance=None, data=None, **kwargs):

        if data:
            data._mutable = True
            data['service'] = data['service'].strip().title()
            data['vendor_name'] = data['vendor_name'].strip().title()
            data['aditional_info'] = data['aditional_info'].strip().capitalize()
            if instance:
                data['id'] = instance.pk
            data._mutable = False
        print(data)
        super(vendorSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        service = data['service']
        vendor_name = data['vendor_name']
        query = vendorContactList.objects.filter(vendor_name=vendor_name, service=service).values('vendor_name')
        if query:
            raise serializers.ValidationError("Vendor Name already exists.")
        return data


class editVendorSerializer(vendorSerializer):
    class Meta(vendorSerializer.Meta):
        fields = '__all__'
        
    def validate(self, data, instance=None):
        vendor_name = vendorContactList.objects.filter(id=instance.pk).values('vendor_name')[0]['vendor_name']
        if vendor_name != data['vendor_name'] :
            service = data['service']
            vendor_name = data['vendor_name']
            query = vendorContactList.objects.filter(vendor_name=vendor_name, service=service).values('vendor_name')
            if query:
                raise serializers.ValidationError("Vendor Name already exists.")
        return data


class repairServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = repairServices
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        
        if data:
            data._mutable = True
            p = vendorContactList.objects.get(service=data['service_of'], vendor_name=data['vendor_name'])
            data['service_of'] = p.pk 
            data['service_type'] = data['service_type'].strip().title()
            data['aditional_info'] = data['aditional_info'].strip().capitalize()
            data._mutable = False
        super(repairServicesSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def to_representation(self, instance):
        rep = super(repairServicesSerializer, self).to_representation(instance)
        rep['service_of'] = instance.service_of.service
        return rep


class editRepairServicesSerializer(repairServicesSerializer):
    class Meta(repairServicesSerializer.Meta):
        fields = '__all__'


