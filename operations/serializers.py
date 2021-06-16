from rest_framework import serializers
from .models import FoodInventory


class FoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodInventory
        fields = '__all__'