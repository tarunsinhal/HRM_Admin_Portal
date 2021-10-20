from rest_framework import serializers
from .models import FoodInventory, Item_types, Product_type, recurringItems, vendorContactList, repairServices,  AdhocItems, t_shirt_inventory, engagementJoining, officeEvents
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
            data['paid_by'] = data['paid_by'].strip().title()
            data['new_product'] = data['new_product'].strip().title()
            data['additional_info'] = data['additional_info'].strip().capitalize()
            data['add_name'] = data['add_name'].strip().title()
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

    def validate(self, data):
        if data['purchase_date'] and data['next_order_date'] :
            if data['purchase_date'] > data['next_order_date']:
                raise serializers.ValidationError("Next Order date should be greater than purchase date!!!")
        return data


class editProductSerializer(ProductSerializer):
    class Meta(ProductSerializer.Meta):
        fields = [ 'frequency', 'product', 'quantity', 'unit', 'price', 'discount', 'amount', 'paid_by', 'purchase_date', 'next_order_date', 'additional_info']


class AdhocItemSerializer(serializers.ModelSerializer):
    # paid_by = serializers.ChoiceField(choices=PAID_BY)

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
            data['add_name'] = data['add_name'].strip().title()
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

    def validate(self, data):
        if data['purchase_date'] and data['received_date'] :
            if data['purchase_date'] > data['received_date']:
                raise serializers.ValidationError("Received date should be greater than purchase date!!!")
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
            raise serializers.ValidationError({"vendor_name" : "Vendor Name already exists."})
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
                raise serializers.ValidationError({"vendor_name" : "Vendor Name already exists."})
        return data


class repairServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = repairServices
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            # print(data)
            if data['vendor_name']:
                p = vendorContactList.objects.get(service=data['service_of'], vendor_name=data['vendor_name'])
                data['service_of'] = p.pk
            data['service_type'] = data['service_type'].strip().title()
            data['paid_by'] = data['paid_by'].strip().title()
            data['aditional_info'] = data['aditional_info'].strip().capitalize()
            data['add_name'] = data['add_name'].strip().title()
            if data['add_name']:
                data['paid_by'] = data['add_name'].strip().title()
            data._mutable = False
        super(repairServicesSerializer, self).__init__(instance=instance, data=data, **kwargs)

    def to_representation(self, instance):
        rep = super(repairServicesSerializer, self).to_representation(instance)
        rep['service_of'] = instance.service_of.service
        return rep

    def validate(self, data):
        if data['service_date'] and data['next_service_date'] :
            if data['service_date'] > data['next_service_date']:
                raise serializers.ValidationError("Next Service date should be greater than  Service date!!!")
        return data

class editRepairServicesSerializer(repairServicesSerializer):
    class Meta(repairServicesSerializer.Meta):
        fields = '__all__'
        

class tshirtSerializer(serializers.ModelSerializer):
    class Meta:
        model = t_shirt_inventory
        fields = "__all__"

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            super(tshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(tshirtSerializer, self).__init__(instance=instance, data=data, **kwargs)


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
        fields = ('size', 'receiving_date', 'previous_stock', 'ordered_quantity', 'total_quantity', 'allotted', 'remaining',
        'paid_by', 'additional')

    def __init__(self, *args, instance=None, data=None, **kwargs):
        if data:
            data._mutable = True
            data['total_quantity'] = int(data['received_quantity']) + int(data['previous_stock'])
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

    # class Meta:
    #     fields = ['history_date', 'size', 'receving date', 'allotted', 'remaining', 'paid_by', 'history_type']
    
    
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
        fields = '__all__'
        # fileds = ['employee_name', 'loi', 'offer_letter', 'nda_signed', 'joining_letter', 'joining_documents', 'joining_hamper', 'relieving_letter', 'experience_letter', 'laptop_charger', 'mouse_mousePad', 'bag', 'id_card', 'induction', 'add_to_skype_group', 'add_to_whatsapp_group', 'remove_from_skype_group', 'remove_from_whatsapp_group', 'grant_onedrive_access', 'onedrive_access', 'microsoft_account_created', 'microsoft_account_deleted', 'gmail_account', 'skype_id', 'system_configration', 'system_format', 'email_account', 'upwork_account_Add_to_team', 'upwork_account_Add_account', 'upwork_account_Remove_from_team', 'upwork_account_Close_account']
        

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = officeEvents
        fields = '__all__'

    def __init__(self, *args, instance=None, data=None, **kwargs):

        if data:
            data._mutable = True
            data['item'] = data['item_0'] + ' : ' + data['item_1']
            data['food'] = data['food_0'] + ' : ' + data['food_1']
            if data['new_event']:
                try:
                    p = officeEvents.objects.get(event_name=data['new_event'])
                except:
                    p = officeEvents.objects.create(event_name=data['new_event'])
                    p.save()
            data._mutable = False
            super(EventSerializer, self).__init__(instance=instance, data=data, **kwargs)
        super(EventSerializer, self).__init__(instance=instance, data=data, **kwargs)
