"""Serializer for the home app."""
from rest_framework import serializers
from django.contrib.auth.models import User


class UpdateUserSerializer(serializers.ModelSerializer):
    """Serializer for the user model."""
    class Meta:
        """Meta class."""
        model = User
        fields = ['username','email']

    def validate(self, attrs):
        """Validate the data."""
        username = attrs['username']
        query = User.objects.filter(username=username).values('username')
        if query:
            raise serializers.ValidationError("Username already exists.")
        return attrs

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user model."""
    class Meta:
        """Meta class."""
        model = User
        fields = "__all__"
