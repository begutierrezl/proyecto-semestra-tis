from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import Receta, Ingrediente
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class IngredienteSerializer(serializers.ModelSerializer):
    # Lo dejamos opcional para que DRF no reclame si viene vacío cuando es "al gusto"
   
    class Meta:
        model = Ingrediente
        fields = ["NOMBRE_INGREDIENTE", "CANTIDAD_INGREDIENTE", "UNIDAD_MEDIDA"]

    def create(self, validated_data):
        ingrediente = Ingrediente.objects.create_user(**validated_data)
        return ingrediente


class RecetaSerializer(serializers.ModelSerializer):
    #para incluir los ingredientes
    ingredientes = IngredienteSerializer(many=True)
    class Meta:
        model = Receta
        fields = [
            "ID_RECETA",
            "NOMBRE_RECETA",
            "DESCRIPCION_CORTA",
            "CANTIDAD_PERSONAS",
            "CATEGORIA",
            "REGIMEN_ALIMENTICIO",
            "INSTRUCCIONES_PREPARACION",
            "ENLACE_RECETA",
            "INGREDIENTES",
        ]
        read_only_fields = ["ID_RECETA", "ENLACE_RECETA"] #campos que serviran para respuesta no entrada 
    def create(self, validated_data):
        receta = Receta.objects.create_user(**validated_data)
        return receta



