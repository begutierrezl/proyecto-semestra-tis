from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from .models import (
  Receta, 
  Ingrediente, 
  Valoracion, 
  CalificacionReceta,
)

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

# ----------------------------------------------------------------------
# Funcion 1: 
# ----------------------------------------------------------------------
      
class IngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = [
          "nombre_ingrediente",
          "cantidad_ingrediente",
          "unidad_medida"
        ]

    def create(self, validated_data):
        ingrediente = Ingrediente.objects.create_user(**validated_data)
        return ingrediente

#serializador para crear las recetas
class CreateRecetaSerializer(serializers.ModelSerializer):
    #para incluir los ingredientes
    ingrediente_receta = IngredienteSerializer(many=True)
    class Meta:
        model = Receta
        fields = [
            "id",
            "nombre_receta",
            "descripcion_corta",
            "cantidad_personas",
            "categoria",
            "regimen_alimenticio",
            "instrucciones_preparacion",
            "enlace_receta",
            "ingrediente_receta",
        ]
        read_only_fields = ["id", "enlace_receta"] #campos que serviran para respuesta no entrada 
        
    def create(self, validated_data):
        #datos ingredientes
        ingrediente_receta_data = validated_data.pop('ingrediente_receta')
        receta= Receta.objects.create(**validated_data)
        for ingred_data in ingrediente_receta_data:
             Ingrediente.objects.create(receta=receta, **ingred_data)
        #con el objeto receta creado y su id asignado, se crea el enlace y se guarda
        #enlace_creado="https://www.libroderecetas.com/receta/"+ str(receta.id) #Para produccion
        enlace_creado="http://127.0.0.1:9000/receta/"+ str(receta.id) #Para desarrollo
        receta.enlace_receta=enlace_creado
        receta.save(update_fields=["enlace_receta"])
        return receta

#serializador para recuperar recetas
class ReadRecetaSerializer(serializers.ModelSerializer):
    ingrediente_receta = IngredienteSerializer(many=True, read_only=True)
    class Meta:
        model = Receta
        fields = [
            "id",
            "nombre_receta",
            "descripcion_corta",
            "cantidad_personas",
            "categoria",
            "regimen_alimenticio",
            "instrucciones_preparacion",
            "enlace_receta",
            "ingrediente_receta",
        ]
        read_only_fields = ["id", "enlace_receta"] #campos que serviran para respuesta no entrada 

# Depedencia de funcion 2: Valoracion de recetas
class ValoracionSerializer(serializers.ModelSerializer):

    id_valoracion = serializers.SerializerMethodField()
    
    class Meta:
        model = Valoracion
        fields = ["id_valoracion", "usuario", "receta", "valoracion"]

    def get_id_valoracion(self, obj):
        return f"{obj.id:012d}"

    def create(self, validated_data):
        valoracion = Valoracion.objects.create(**validated_data)
        return valoracion
      
# ----------------------------------------------------------------------
# Funcion 3: Modelo CalificacionReceta para Listado de recetas populares
# ----------------------------------------------------------------------

# Funcion CREATE
class CalificacionRecetaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionReceta
        fields = ["receta", "promedio_valoracion", "cantidad_valoraciones"]
        read_only_fields = ["id",]

    def create(self, validated_data):        
        calificacion_receta = CalificacionReceta.objects.create(**validated_data)
        return calificacion_receta

# Funcion READ & UPDATE
class CalificacionRecetaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalificacionReceta
        fields = ["promedio_valoracion", "cantidad_valoraciones"]
        read_only_fields = ["id", "receta",]

    def update(self, instance, validated_data):
        instance = CalificacionReceta(**validated_data)
        instance.save()
        return instance

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
# Solo lectura: son datos calculados por el sistema (R4.5)
class IngredienteAjustadoSerializer(serializers.Serializer):
    nombre_ingrediente = serializers.CharField(read_only=True)
    cantidad_ajustada = serializers.FloatField(read_only=True)
    unidad_medida = serializers.CharField(read_only=True)

# Salida 1 (R4.6): solo lectura (read_only=True), los datos vienen calculados
# desde generar_receta_ajustada
class RecetaAjustadaSerializer(serializers.Serializer):
    nombre_receta = serializers.CharField(read_only=True)
    descripcion_corta = serializers.CharField(read_only=True)
    categoria = serializers.CharField(read_only=True)
    regimen_alimenticio = serializers.CharField(read_only=True)
    cantidad_personas_deseada = serializers.IntegerField(read_only=True)
    ingredientes_ajustados = IngredienteAjustadoSerializer(many=True, read_only=True)
    instrucciones_preparacion = serializers.CharField(read_only=True)
    mensaje = serializers.CharField(read_only=True)  # Salida 2: mensaje de R4.6 / R4.7
