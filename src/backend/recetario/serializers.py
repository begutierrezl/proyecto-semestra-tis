from django.apps import apps
from django.contrib.auth.models import User
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# El servidor solo entrega los datos de la receta (R4.4).
# El calculo (R4.5) y la validacion de CANTIDAD_PERSONAS_DESEADA (R4.1, R4.2)
# se realizan del lado del usuario (React).
# Dependencia de funcion 1: modelos Receta e IngredienteReceta
# ----------------------------------------------------------------------

# Ingrediente original: NOMBRE_INGREDIENTE, CANTIDAD_INGREDIENTE, UNIDAD_MEDIDA
class IngredienteAjusteSerializer(serializers.Serializer):
    nombre_ingrediente = serializers.CharField(read_only=True)
    cantidad_ingrediente = serializers.FloatField(read_only=True)
    unidad_medida = serializers.CharField(read_only=True)


# Datos de la receta recuperados en R4.4 (solo lectura)
class RecetaAjusteSerializer(serializers.Serializer):
    nombre_receta = serializers.CharField(read_only=True)
    descripcion_corta = serializers.CharField(read_only=True)
    categoria = serializers.CharField(read_only=True)
    regimen_alimenticio = serializers.CharField(read_only=True)
    instrucciones_preparacion = serializers.CharField(read_only=True)
    cantidad_personas = serializers.IntegerField(read_only=True)  # valor original de la receta
    ingredientes = serializers.SerializerMethodField()  # solo lectura por defecto

    def get_ingredientes(self, receta):
        IngredienteReceta = apps.get_model("recetario", "IngredienteReceta")
        ingredientes = IngredienteReceta.objects.filter(id_receta=receta.pk)
        return IngredienteAjusteSerializer(ingredientes, many=True).data