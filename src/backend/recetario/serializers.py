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

# testear serializador de recetas
class RecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receta
        fields = ["id", "nombre"]

    def create(self, validated_data):
        receta = Receta.objects.create(**validated_data)
        return receta

    

# pendiente investigar e implementar
class CalificacionRecetaSerializer(serializers.ModelSerializer):
    #id_receta = serializers.IntegerField()

    class Meta:
        model = CalificacionReceta
        fields = ["receta", "promedio_valoracion", "cantidad_valoraciones"]
        read_only_fields = ["id",]

    def create(self, validated_data):
        #receta = Receta.objects.get(validated_data.get("id_receta"))
        
        calificacion_receta = CalificacionReceta.objects.create(**validated_data)
        # especificar codigo de creacion y validacion
        return calificacion_receta

    """ def update(self, instance, validated_data):
        # especificar campos a actualizar y validacion
        return instance """