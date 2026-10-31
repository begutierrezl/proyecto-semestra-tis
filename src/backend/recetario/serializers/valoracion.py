from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):

    id_usuario = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id_usuario", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        
    def get_id_usuario(self, obj):
        return f"{obj.id:012d}"

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


