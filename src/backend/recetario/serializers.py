from django.contrib.auth.models import User
from rest_framework import serializers
from .models import CalificacionReceta

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# pendiente investigar e implementar
class CalificacionRecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionReceta
        fields = "__all__"
        read_only_fields = ["id", "id_receta"]

    def create(self, validated_data):
        calificacion_receta = CalificacionReceta.objects.create(**validated_data)
        # especificar codigo de creacion y validacion
        return calificacion_receta

    """ def update(self, instance, validated_data):
        # especificar campos a actualizar y validacion
        return instance """