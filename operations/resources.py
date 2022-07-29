"""
This file contains the resources for the operations app.
"""
from django.core.exceptions import ValidationError
from import_export import widgets,fields,resources
from import_export.widgets import ForeignKeyWidget
from .models import (
                        Item_types, Product_type, recurringItems,
                        t_shirt_inventory, Adhoc_types, AdhocItems,
                        vendorContactList, officeEvents,
                        engagementJoining
                    )


class CharRequiredWidget(widgets.CharWidget):
    """
    This class is used to create a widget for char value.
    """
    def clean(self, *args, value, row=None, **kwargs):
        val = super().clean(value)
        if val:
            return val
        else:
            raise ValueError("This field is required")

class RecurringResource(resources.ModelResource):
    """
    This class is used to create a resource for recurringItems.
    """
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    type = fields.Field(
                            column_name='type',
                            attribute='type',
                            widget=ForeignKeyWidget(Item_types, 'type_name')
                        )
    product = fields.Field(
                                column_name='product',
                                attribute='product',
                                widget=ForeignKeyWidget(Product_type, 'product_name')
                            )
    quantity = fields.Field(
                                saves_null_values=False,
                                column_name='quantity',
                                attribute='quantity',
                                widget=CharRequiredWidget()
                            )
    unit = fields.Field(
                            saves_null_values=False,
                            column_name='unit',
                            attribute='unit',
                            widget=CharRequiredWidget()
                        )
    amount = fields.Field(
                            saves_null_values=False,
                            column_name='amount',
                            attribute='amount',
                            widget=CharRequiredWidget()
                        )
    paid_by = fields.Field(
                                saves_null_values=False,
                                column_name='paid_by',
                                attribute='paid_by',
                                widget=CharRequiredWidget()
                            )
    purchase_date = fields.Field(
                                    saves_null_values=False,
                                    column_name='purchase_date',
                                    attribute='purchase_date',
                                    widget=CharRequiredWidget()
                                )

    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = recurringItems
        clean_model_instances=True

class AdhocResource(resources.ModelResource):
    """
    This class is used to create a resource for AdhocItems.
    """
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    type = fields.Field(
                            column_name='type',
                            attribute='type',
                            widget=ForeignKeyWidget(Adhoc_types, 'item_name')
                        )
    product = fields.Field(
                                saves_null_values=False,
                                column_name='product',
                                attribute='product',
                                widget=CharRequiredWidget()
                            )
    quantity = fields.Field(
                                saves_null_values=False,
                                column_name='quantity',
                                attribute='quantity',
                                widget=CharRequiredWidget()
                            )
    amount = fields.Field(
                            saves_null_values=False,
                            column_name='amount',
                            attribute='amount',
                            widget=CharRequiredWidget()
                        )
    paid_by = fields.Field(
                                saves_null_values=False,
                                column_name='paid_by',
                                attribute='paid_by',
                                widget=CharRequiredWidget()
                            )
    purchase_date = fields.Field(
                                    saves_null_values=False,
                                    column_name='purchase_date',
                                    attribute='purchase_date',
                                    widget=CharRequiredWidget()
                                )
    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = AdhocItems
        clean_model_instances=True

class JoiningResource(resources.ModelResource):
    """
    This class is used to create a resource for joining formalities.
    """
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]
        dataset.headers.append('details')

    def before_import_row(self, row, row_number=None, **kwargs):
        row['details'] = '1'
        return row

    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = engagementJoining
        clean_model_instances=True

class ExitResource(resources.ModelResource):
    """
    This class is used to create a resource for exit formalities.
    """
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]
        dataset.headers.append('details')

    def before_import_row(self, row, row_number=None, **kwargs):
        row['details'] = '2'
        return row

    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = engagementJoining
        clean_model_instances=True

class VendorResource(resources.ModelResource):
    """
    This class is used to create a resource for VendorContactList.
    """
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    def before_import_row(self, row, row_number=None, **kwargs):
        self.vendor_name = row["vendor_name"]
        self.service = row["service"]
        query = vendorContactList.objects.filter(
                    vendor_name=self.vendor_name, service=self.service
                ).values('vendor_name')
        if query:
            raise ValidationError({'Vendor Name':'Vendor Name already exist.'})


    service = fields.Field(
                                saves_null_values=False,
                                column_name='service',
                                attribute='service',
                                widget=CharRequiredWidget()
                            )
    vendor_name = fields.Field(
                                    saves_null_values=False,
                                    column_name='vendor_name',
                                    attribute='vendor_name',
                                    widget=CharRequiredWidget()
                                )
    contact_no = fields.Field(
                                saves_null_values=False,
                                column_name='contact_no',
                                attribute='contact_no',
                                widget=CharRequiredWidget()
                            )
    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = vendorContactList
        clean_model_instances=True

class TshirtResource(resources.ModelResource):
    """
    This class is used to create a resource for t_shirt_inventory.
    """
    def before_import(self, dataset, using_transactions, dry_run, **kwargs):
        first_row = dataset.headers
        dataset.headers = ['_'.join(i.split(' ')).lower() for i in first_row]

    def before_import_row(self, row, row_number=None, **kwargs):
        self.order_date = row["order_date"]
        self.size = row["size"]
        datedata = t_shirt_inventory.objects.filter(
                        order_date=self.order_date, size=self.size
                    ).values_list('order_date')
        if datedata:
            raise ValidationError({'Order Date':'Order date already exist.'})

    order_date = fields.Field(
                                saves_null_values=False,
                                column_name='order_date',
                                attribute='order_date',
                                widget=CharRequiredWidget()
                            )
    size = fields.Field(
                            saves_null_values=False,
                            column_name='size',
                            attribute='size',
                            widget=CharRequiredWidget()
                        )
    previous_stock = fields.Field(
                                    saves_null_values=False,
                                    column_name='previous_stock',
                                    attribute='previous_stock',
                                    widget=CharRequiredWidget()
                                )
    ordered_quantity = fields.Field(
                                        saves_null_values=False,
                                        column_name='ordered_quantity',
                                        attribute='ordered_quantity',
                                        widget=CharRequiredWidget()
                                    )
    received_quantity = fields.Field(
                                        saves_null_values=False,
                                        column_name='received_quantity',
                                        attribute='received_quantity',
                                        widget=CharRequiredWidget()
                                    )
    total_quantity = fields.Field(
                                    saves_null_values=False,
                                    column_name='total_quantity',
                                    attribute='total_quantity',
                                    widget=CharRequiredWidget()
                                )
    allotted = fields.Field(
                                saves_null_values=False,
                                column_name='allotted',
                                attribute='allotted',
                                widget=CharRequiredWidget()
                            )
    remaining = fields.Field(
                                saves_null_values=False,
                                column_name='remaining',
                                attribute='remaining',
                                widget=CharRequiredWidget()
                            )
    amount = fields.Field(
                            saves_null_values=False,
                            column_name='amount',
                            attribute='amount',
                            widget=CharRequiredWidget()
                        )
    paid_by = fields.Field(
                                saves_null_values=False,
                                column_name='paid_by',
                                attribute='paid_by',
                                widget=CharRequiredWidget()
                            )
    user_name = fields.Field(
                                saves_null_values=False,
                                column_name='user_name',
                                attribute='user_name',
                                widget=CharRequiredWidget()
                            )

    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = t_shirt_inventory
        clean_model_instances=True

class officeEventsResource(resources.ModelResource):
    """
    This class is used to create a resource for officeEvents.
    """
    date = fields.Field(
                            saves_null_values=False,
                            column_name='date',
                            attribute='date',
                            widget=CharRequiredWidget()
                        )
    event_name = fields.Field(
                                saves_null_values=False,
                                column_name='event_name',
                                attribute='event_name',
                                widget=CharRequiredWidget()
                            )

    class Meta:
        """
        This class is used to create meta class for resource.
        """
        model = officeEvents
        clean_model_instances=True
