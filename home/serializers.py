from rest_framework import serializers
from django.contrib.auth.models import User


class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email']

    def validate(self, data):
        username = data['username']
        email = data['email']
        query = User.objects.filter(username=username).values('username')
        if query:
            raise serializers.ValidationError("Username already exists.")
        return data

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

