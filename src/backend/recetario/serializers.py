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
# ----------------------------------------------------------------------

# Validacion de la entrada CANTIDAD_PERSONAS_DESEADA
# R4.1: entero positivo, > 0 y no superior a 100
# R4.2: campo estrictamente obligatorio
class ParametrosAjusteSerializer(serializers.Serializer):
    cantidad_personas_deseada = serializers.IntegerField(
        min_value=1,
        max_value=100,
        error_messages={
            "required": "CANTIDAD_PERSONAS_DESEADA es obligatoria",
            "invalid": "CANTIDAD_PERSONAS_DESEADA debe ser un numero entero",
            "min_value": "CANTIDAD_PERSONAS_DESEADA debe ser mayor a cero",
            "max_value": "CANTIDAD_PERSONAS_DESEADA no puede ser superior a 100",
        },
    )


# Ingrediente ajustado: NOMBRE_INGREDIENTE, CANTIDAD_AJUSTADA, UNIDAD_MEDIDA (R4.6)
class IngredienteAjustadoSerializer(serializers.Serializer):
    nombre_ingrediente = serializers.CharField()
    cantidad_ajustada = serializers.FloatField()
    unidad_medida = serializers.CharField()


# Salida 1 (R4.6): solo lectura, los datos vienen calculados desde generar_receta_ajustada
class RecetaAjustadaSerializer(serializers.Serializer):
    nombre_receta = serializers.CharField()
    descripcion_corta = serializers.CharField()
    categoria = serializers.CharField()
    regimen_alimenticio = serializers.CharField()
    cantidad_personas_deseada = serializers.IntegerField()
    ingredientes_ajustados = IngredienteAjustadoSerializer(many=True)
    instrucciones_preparacion = serializers.CharField()
    mensaje = serializers.CharField()  # Salida 2: mensaje de R4.6 / R4.7