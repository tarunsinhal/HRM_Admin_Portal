
from django.db import models
from django.db.models import fields
from django.db.models.base import Model
from django.http import request
from rest_framework import serializers
from .models import (FoodInventory, Item_types, Product_type, dailyWeeklyItems, recurringItems, vendorContactList,
                     repairServices,  AdhocItems, t_shirt_inventory)
from django.contrib.auth.models import User


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


    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            data['quantity'] = data['quantity_0'] + ' ' + data['quantity_1']

            data._mutable = False
            super(AdhocItemSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(AdhocItemSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def to_representation(self, instance):
        rep = super(AdhocItemSerializer, self).to_representation(instance)
        rep['paid_by'] = instance.paid_by.username
        return rep


class EditAdhocItemSerializer(AdhocItemSerializer):
    class Meta(AdhocItemSerializer.Meta):
        fields = ['product', 'quantity', 'unit','price', 'amount', 'paid_by', 'purchase_date',
                  'additional_info']


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


class EditAdhocItemSerializer(serializers.ModelSerializer):
    # paid_by = serializers.StringRelatedField()

    class Meta:
        model = AdhocItems
        fields = ['purchase_date', 'product', 'price', 'amount', 'paid_by', 'additional_info']

    # def to_representation(self, instance):
    #     rep = super(EditAdhocItemSerializer, self).to_representation(instance)
    #     rep['paid_by'] = instance.paid_by.username
    #     # print('1111111111',instance.paid_by.username)
    #     return rep


class tshirtSerializer(serializers.ModelSerializer):
    class Meta:
        model = t_shirt_inventory
        fields = "__all__"

    # def __init__(self, instance=None, data=None, **kwargs):
    #     if data:
    #         data._mutable = True
    #         data['form-0-total_quantity'] = int(data['form-0-previous_stock']) + int(data['form-0-ordered_quantity'])
    #         data['form-0-remaining'] = int(data['form-0-total_quantity']) - int(data['form-0-allotted'])

    #         print(data)
    #         for i in range(1,6):
    #             form_id = 'form-' + str(i)
    #             data[form_id+'order_date'] = data['form-0-order_date']
    #             data[form_id+'receiving_date'] = data['form-0-receiving_date']
    #             data[form_id+'-total_quantity'] = int(data[form_id+'-previous_stock']) + int(data[form_id+'-ordered_quantity'])
    #             data[form_id+'-remaining'] = int(data[form_id+'-total_quantity']) - int(data[form_id+'-allotted'])
    #             data[form_id+'-paid_by'] = data['form-0-paid_by']
    #             data[form_id+'-additional'] = data['form-0-additional']
    #         data._mutable = False

    #     super(addTshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)


class editTshirtSerializer(serializers.ModelSerializer):
    class Meta:
        model = t_shirt_inventory
        fields = ('size', 'receiving_date', 'previous_stock', 'ordered_quantity', 'total_quantity', 'allotted', 'remaining', 'paid_by', 'additional')
    
    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            print(data)
            data._mutable = True
            data['total_quantity'] = int(data['ordered_quantity']) + int(data['previous_stock'])
            print(data['total_quantity'])
            data['remaining'] = int(data['total_quantity']) - int(data['allotted'])

            data._mutable = False
            super(editTshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(editTshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)



class operations_history(serializers.ModelSerializer):
    def __init__(self, model, *args, fields='__all__', **kwargs):
        self.Meta.model = model
        self.Meta.fields = fields
        super().__init__()
    
    class Meta:
        pass


# class tshirtHistorySerializer(serializers.Serializer):
#     class Meta:
#         model = t_shirt_inventory
#         fields = "__all__"

#     history = serializers.SerializerMethodField()


#     def get_history(self, obj):
#         model = obj.history.__dict__['model']
#         fields = ['history_date', 'history_user', ]
#         serializer = operations_history(model, obj.history.all().order_by('history_date'), fields=fields, many=True)
#         serializer.is_valid()
#         return serializer.data



    # class Meta:
    #     fields = ['history_date', 'size', 'receving date', 'allotted', 'remaining', 'paid_by', 'history_type']
    
    

