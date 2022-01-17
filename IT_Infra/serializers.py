from django.core.exceptions import ValidationError
from django.db.models import fields
from django.http import request
from rest_framework import serializers
from .models import hardware_allotted_items, it_inventory, it_allotment, it_inventory_type, it_inventory_item, software_allotted_items
import json


class it_inventory_serializer(serializers.ModelSerializer):
    class Meta:
        model = it_inventory
        fields = "__all__"

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            
            if data['item_base_name']:
                data['name'] = (data['item_base_name'] + "-" + data['item_number']).title()
            else:
                data['name'] = ""
            
            if json.loads(data["system_names"]):
                data["status"] = 1        

            if data['new_item']:
                try:
                    p = it_inventory_item.objects.get(type_id=data['type'].title(), item=data['new_item'])
                except:
                    p = it_inventory_item.objects.create(type_id=data['type'].title(), item=data['new_item'])
                    p.save()
                data['item'] = p.pk
            data._mutable = False
            super(it_inventory_serializer, self).__init__(instance=instance, data=data, **kwargs)
        super(it_inventory_serializer, self).__init__(instance=instance, data=data, **kwargs)

    def to_representation(self, instance):
        rep = super(it_inventory_serializer, self).to_representation(instance)
        rep['item'] = instance.item.item
        rep['status'] = instance.status.status
        return rep

    def validate(self, data):
        q = it_inventory.objects.filter(name=data['name'])
        if q:
            raise ValidationError({'name': 'Item name already exists!'})
        return data
        

class it_inventory_edit_serializer(it_inventory_serializer):
    class Meta(it_inventory_serializer.Meta):
        fields = ('item', 'details', 'name', 'purchase_type', 'status', 'system_names', 'validity_start_date', 'validity_end_date', 'remarks')

    def __init__(self, *args, instance=None, data=None, **kwargs):
        self.name = it_inventory.objects.filter(id=instance.pk).values('name')[0]['name']

        if data:
            data._mutable = True
            
            if data['item_base_name']:
                data['name'] = (data['item_base_name'] + "-" + data['item_number']).title()
            else:
                data['name'] = ""
            
            if json.loads(data["system_names"]):
                data["status"] = 1        

            data._mutable = False
            super(it_inventory_serializer, self).__init__(instance=instance, data=data, **kwargs)
        super(it_inventory_serializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        if data['name'] != self.name:
            q = it_inventory.objects.filter(name=data['name'])
            if q:
                raise ValidationError({'name': 'Item name already exists!'})
        return data


class it_allotment_serializer(serializers.ModelSerializer):
    class Meta:
        model = it_allotment
        fields = "__all__"
    
    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            super(it_allotment_serializer, self).__init__(instance=instance, data=data, **kwargs)
        super(it_allotment_serializer, self).__init__(instance=instance, data=data, **kwargs)


class hardware_allotted_add_serializer(serializers.ModelSerializer):
    class Meta(object):
        model = hardware_allotted_items
        fields = "__all__"
            
    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            super(hardware_allotted_add_serializer, self).__init__(instance=instance, data=data, **kwargs)
        super(hardware_allotted_add_serializer, self).__init__(instance=instance, data=data, **kwargs)


class software_allotted_add_serializer(serializers.ModelSerializer):
    class Meta(object):
        model = software_allotted_items
        fields = "__all__"

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            super(software_allotted_add_serializer, self).__init__(instance=instance, data=data, **kwargs)
        super(software_allotted_add_serializer, self).__init__(instance=instance, data=data, **kwargs)

