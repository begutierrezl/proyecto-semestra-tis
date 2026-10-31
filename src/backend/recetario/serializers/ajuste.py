from rest_framework import serializers

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
