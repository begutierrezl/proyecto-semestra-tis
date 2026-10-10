from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Receta, CalificacionReceta

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Dependencia de funcion 1: Registro de recetas
class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = ["id", "nombre"]

    def create(self, validated_data):
        receta = Receta.objects.create(**validated_data)
        return receta

class CalificacionRecetaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionReceta
        fields = ["receta", "promedio_valoracion", "cantidad_valoraciones"]
        read_only_fields = ["id",]

    def create(self, validated_data):        
        calificacion_receta = CalificacionReceta.objects.create(**validated_data)
        return calificacion_receta

class CalificacionRecetaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionReceta
        fields = ["promedio_valoracion", "cantidad_valoraciones"]
        read_only_fields = ["id", "receta",]

    def update(self, instance, validated_data):
        instance = CalificacionReceta(**validated_data)
        instance.save()
        return instance