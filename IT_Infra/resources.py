from import_export import widgets,fields,resources
from .models import it_inventory
from import_export.widgets import ForeignKeyWidget


class itInventoryResource(resources.ModelResource):
    class Meta:
        model = it_inventory