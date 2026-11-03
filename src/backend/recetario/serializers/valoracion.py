from django.contrib.auth.models import User
from rest_framework import serializers
from ..models.valoracion import Valoracion

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


class ValoracionInputSerializer(serializers.Serializer):
    id_usuario = serializers.IntegerField(label="Ingrese el ID del usuario")
    id_receta = serializers.IntegerField(label="Ingrese el ID de la receta")
    valoracion = serializers.IntegerField(min_value=1, max_value=5, label="Valoración (Número entero entre 1 y 5)")

