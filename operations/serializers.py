from rest_framework import serializers
from .models import Item_types, Product_type, Adhoc_types, Detail_types, recurringItems, vendorContactList, repairServices,  AdhocItems, t_shirt_inventory, engagementJoining, officeEvents
from django.contrib.auth.models import User
from datetime import datetime

# serializer class for item type in recurring section
class ItemTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item_types


# serializer class for reccuring module
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = recurringItems
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):

        if data:
            data._mutable = True
            print(data)

            data['unit'] = data['unit_0'] + ' ' + data['unit_1']
            data['paid_by'] = data['paid_by'].strip().title()
            data['new_product'] = data['new_product'].strip().title()
            data['additional_info'] = data['additional_info'].strip().capitalize()
            if data['add_name']:
                data['paid_by'] = data['add_name'].strip().title()
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


class editProductSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        fields = [ 'frequency', 'product', 'quantity', 'unit', 'price', 'discount', 'amount', 'paid_by', 'purchase_date', 'next_order_date', 'additional_info']


class AdhocItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = AdhocItems
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            data['product'] = data['product'].strip().title()
            data['paid_by'] = data['paid_by'].strip().title()
            data['additional_info'] = data['additional_info'].strip().capitalize()
            data['quantity'] = data['quantity_0'] + ' ' + data['quantity_1']
            if data['add_name']:
                data['paid_by'] = data['add_name'].strip().title()

            data._mutable = False
            super(AdhocItemSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(AdhocItemSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        if data['received_date']:
            if data['balance_amount'] != 0:
                raise serializers.ValidationError({"balance_amount": "Value must be Zero."})
        if data['quantity']:
            q = data['quantity'].split()
            if len(q) != 2:
                raise serializers.ValidationError({"quantity_1": "This field is required."})
        if data['amount'] == 0:
            raise serializers.ValidationError({"amount": "Amount should not be Zero."})  
        return data


class EditAdhocItemSerializer(AdhocItemSerializer):
    class Meta(AdhocItemSerializer.Meta):
        fields = ['purchase_date', 'received_date', 'product', 'quantity', 'price', 'amount', 'advance_pay', 'balance_amount', 'paid_by', 'additional_info']


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
        super(vendorSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        service = data['service']
        vendor_name = data['vendor_name']
        query = vendorContactList.objects.filter(vendor_name=vendor_name, service=service).values('vendor_name')
        if query:
            raise serializers.ValidationError({"vendor_name" : "Vendor Name already exist."})
        return data


class editVendorSerializer(vendorSerializer):
    class Meta(vendorSerializer.Meta):
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        self.vendorName = vendorContactList.objects.filter(id=instance.pk).values('vendor_name')[0]['vendor_name']
        if data:
            data._mutable = True
            data['service'] = data['service'].strip().title()
            data['vendor_name'] = data['vendor_name'].strip().title()
            data['aditional_info'] = data['aditional_info'].strip().capitalize()
            if instance:
                data['id'] = instance.pk
            data._mutable = False
        super(vendorSerializer, self).__init__(instance=instance, data=data, **kwargs)


    def validate(self, data, instance=None):
        if data['vendor_name'] != self.vendorName :
            service = data['service']
            vendor_name = data['vendor_name']
            query = vendorContactList.objects.filter(vendor_name=vendor_name, service=service).values('vendor_name')
            if query:
                raise serializers.ValidationError({"vendor_name" : "Vendor Name already exist."})
        return data


class repairServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = repairServices
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            if data['vendor_name']:
                p = vendorContactList.objects.get(service=data['service_of'], vendor_name=data['vendor_name'])
                data['service_of'] = p.pk
            data['service_type'] = data['service_type'].strip().title()
            data['paid_by'] = data['paid_by'].strip().title()
            data['aditional_info'] = data['aditional_info'].strip().capitalize()
            if data['add_name']:
                data['paid_by'] = data['add_name'].strip().title()
            data._mutable = False
        super(repairServicesSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def to_representation(self, instance):
        rep = super(repairServicesSerializer, self).to_representation(instance)
        rep['service_of'] = instance.service_of.service
        return rep


class editRepairServicesSerializer(repairServicesSerializer):
    class Meta(repairServicesSerializer.Meta):
        fields = '__all__'
        

class tshirtSerializer(serializers.ModelSerializer):
    class Meta:
        model = t_shirt_inventory
        fields = "__all__"

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data['paid_by'] = data['paid_by'].strip().title()
            super(tshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(tshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        size = data['size']
        datedata = t_shirt_inventory.objects.filter(order_date=data['order_date'], size=size).values_list('order_date')
        print(datedata)
        for i in range(len(data)):
            if datedata:
                raise serializers.ValidationError({"form-0-order_date" : "Date already exist."})
        return data

class editTshirtSerializer(serializers.ModelSerializer):
    class Meta:
        model = t_shirt_inventory
        fields = ('size', 'order_date', 'receiving_date', 'previous_stock', 'ordered_quantity', 'received_quantity', 'total_quantity', 'allotted', 'remaining', 'amount', 'paid_by', 'additional')

    def __init__(self, *args, instance=None, data=None, **kwargs):
        self.orderDate = t_shirt_inventory.objects.filter(id=instance.pk).values('order_date')[0]['order_date']
        if data:
            data['paid_by'] = data['paid_by'].strip().title()
            super(editTshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(editTshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        if data['order_date'] != self.orderDate:
            size = data['size']
            datedata = t_shirt_inventory.objects.filter(order_date=data['order_date'], size=size).values_list('order_date')
            print(datedata)
            for i in range(len(data)):
                if datedata:
                    raise serializers.ValidationError({"form-0-order_date" : "Date already exist."})
        return data

class operations_history(serializers.ModelSerializer):
    def __init__(self, model, *args, fields='__all__', **kwargs):
        self.Meta.model = model
        self.Meta.fields = fields
        super().__init__()

    class Meta:
        pass

    
class joiningSerializer(serializers.ModelSerializer):
    class Meta:
        model = engagementJoining
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            data['employee_name'] = data['employee_name'].strip().title()
            data._mutable = False
        super(joiningSerializer, self).__init__(instance=instance, data=data, **kwargs)


class editJoiningSerializer(joiningSerializer):
    class Meta(joiningSerializer.Meta):
        fields = ['employee_name', 'loi', 'offer_letter', 'nda_signed', 'joining_letter', 'joining_documents', 'joining_hamper', 'relieving_letter', 'experience_letter', 'laptop_charger', 'mouse_mousepad', 'bag', 'id_card', 'induction', 'add_to_cliq_channels', 'add_to_whatsapp_group', 'remove_from_cliq_channels', 'remove_from_whatsapp_group', 'onedrive_access', 'microsoft_account_created', 'microsoft_account_deleted', 'gmail_account', 'cliq_id', 'system_configuration', 'system_format', 'email_account', 'add_upwork_account_to_team', 'add_upwork_account', 'remove_upwork_account_from_team', 'close_upwork_account', 'fnf', 'joining_date', 'last_working_date']

    
class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = officeEvents
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            data['event_name'] = data['event_name'].strip().title()
            data['paid_by'] = data['paid_by'].strip().title()
            if data['new_event']:
                data['event_name'] = data['new_event'].strip().title()
            if data['add_name']:
                data['paid_by'] = data['add_name'].strip().title()
            data._mutable = False
            super(EventSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(EventSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        datedata = officeEvents.objects.filter(date=data['date']).values_list('date')
        for i in range(len(data)):
            if datedata:
                raise serializers.ValidationError({"date" : "Date already exist."})
        for k,v in data['item'].items() :
            if k == '' and v != '':
                raise serializers.ValidationError({"item_name" : "This field may not be blank."})
            if k != '' and v == '':
                raise serializers.ValidationError({"item_price" : "This field may not be blank."})
        for k,v in data['food'].items() :
            if k == '' and v != '':
                raise serializers.ValidationError({"food_name" : "This field may not be blank."})
            if k != '' and v == '':
                raise serializers.ValidationError({"food_price" : "This field may not be blank."})
        return data
        
class EditEventSerializer(EventSerializer):
    class Meta(EventSerializer.Meta):
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        self.preDate = officeEvents.objects.filter(id=instance.pk).values('date')[0]['date']
        if data:
            data._mutable = True
            data['event_name'] = data['event_name'].strip().title()
            data['paid_by'] = data['paid_by'].strip().title()
            if data['new_event']:
                data['event_name'] = data['new_event'].strip().title()
            if data['add_name']:
                data['paid_by'] = data['add_name'].strip().title()
            data._mutable = False
            super(EventSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(EventSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def validate(self, data):
        if data['date'] != self.preDate:
            datedata = officeEvents.objects.filter(date=data['date']).values_list('date')
            for i in range(len(data)):
                if datedata:
                    raise serializers.ValidationError({"date" : "Date already exist."})
        for k,v in data['item'].items() :
            if k == '' and v != '':
                raise serializers.ValidationError({"item_name" : "This field may not be blank."})
            if k != '' and v == '':
                raise serializers.ValidationError({"item_price" : "This field may not be blank."})
        for k,v in data['food'].items() :
            if k == '' and v != '':
                raise serializers.ValidationError({"food_name" : "This field may not be blank."})
            if k != '' and v == '':
                raise serializers.ValidationError({"food_price" : "This field may not be blank."})
        return data
