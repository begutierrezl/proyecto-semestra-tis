from rest_framework import serializers
from ..models.valoracion import Valoracion
from ..models.calificacion import CalificacionReceta
 
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
