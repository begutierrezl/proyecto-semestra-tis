from decimal import Decimal, ROUND_HALF_UP
from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models.receta import Ingrediente
from ..serializers.ajuste import ParametrosAjusteSerializer, RecetaAjustadaSerializer

# Create your models here.

# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# No requiere tabla nueva: CANTIDAD_AJUSTADA es un dato calculado (R4.5)
# Dependencia de funcion 1 (ingresar receta): modelos Receta e IngredienteReceta

# ----------------------------------------------------------------------

# R4.4 a R4.7: recupera ingredientes de la receta y arma la salida
def generar_receta_ajustada(receta, cantidad_personas_deseada):
    ingredientes = Ingrediente.objects.filter(receta=receta)

    # R4.7: si la cantidad deseada es igual a la original, no se ejecuta R4.5
    es_cantidad_original = cantidad_personas_deseada == receta.cantidad_personas

    ingredientes_ajustados = []
    for ingrediente in ingredientes:
        if es_cantidad_original:
            cantidad = ingrediente.cantidad_ingrediente
        else:
            cantidad = calcular_cantidad_ajustada(
                ingrediente.cantidad_ingrediente,
                receta.cantidad_personas,
                cantidad_personas_deseada,
            )
        ingredientes_ajustados.append({
            "nombre_ingrediente": ingrediente.nombre_ingrediente,
            "cantidad_ajustada": cantidad,
            "unidad_medida": ingrediente.unidad_medida,
        })

    if es_cantidad_original:
        # R4.7
        mensaje = "Las cantidades mostradas corresponden a la cantidad de personas original de la receta"
    else:
        # R4.6: indicar explicitamente para cuantas personas son las cantidades
        mensaje = f"Las cantidades mostradas corresponden a {cantidad_personas_deseada} personas"

    return {
        "nombre_receta": receta.nombre_receta,
        "descripcion_corta": receta.descripcion_corta,
        "categoria": receta.categoria,
        "regimen_alimenticio": receta.regimen_alimenticio,
        "cantidad_personas_deseada": cantidad_personas_deseada,
        "ingredientes_ajustados": ingredientes_ajustados,
        "instrucciones_preparacion": receta.instrucciones_preparacion,
        "mensaje": mensaje,
    }
        
# R4.5: CANTIDAD_AJUSTADA = (CANTIDAD_INGREDIENTE / CANTIDAD_PERSONAS) * CANTIDAD_PERSONAS_DESEADA
# - CANTIDAD_INGREDIENTE es decimal (R1.5), se convierte via str para crear el Decimal
#   sin arrastrar el error de punto flotante
# - Maximo 2 decimales
def calcular_cantidad_ajustada(cantidad_ingrediente, cantidad_personas, cantidad_personas_deseada):
    if cantidad_personas <= 0:
        # R1.8 garantiza CANTIDAD_PERSONAS > 0, esto es solo una proteccion
        raise ValueError("CANTIDAD_PERSONAS debe ser mayor a cero")
    ajustada = (
        Decimal(str(cantidad_ingrediente)) / Decimal(cantidad_personas)
    ) * Decimal(cantidad_personas_deseada)
    return float(ajustada.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))

# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# GET api/get/receta/<id_receta>/ajuste/?cantidad_personas_deseada=N
# ----------------------------------------------------------------------
# Dependencia de funcion 1 ingresar receta -> Definicion de modelo Receta
# (se obtiene de forma perezosa para no depender del orden de implementacion)
class AjusteIngredientesView(generics.RetrieveAPIView):
    serializer_class = RecetaAjustadaSerializer
    permission_classes = [AllowAny]  # obs1: sin un requisito de seguridad concreto

    def get_queryset(self):
        return apps.get_model("recetario", "Receta").objects.all()

    def retrieve(self, request, *args, **kwargs):
        # R4.1 y R4.2: validacion de CANTIDAD_PERSONAS_DESEADA
        parametros = ParametrosAjusteSerializer(data=request.query_params)
        parametros.is_valid(raise_exception=True)
        cantidad_deseada = parametros.validated_data["cantidad_personas_deseada"]

        # R4.3: verificar existencia del ID_RECETA
        try:
            receta = self.get_queryset().get(pk=kwargs["id_receta"])
        except ObjectDoesNotExist:
            raise NotFound("Receta no encontrada. No es posible realizar el ajuste")

        # R4.4 a R4.7: recuperar datos, calcular y armar la salida
        datos = generar_receta_ajustada(receta, cantidad_deseada)
        serializer = self.get_serializer(datos)
        return Response(serializer.data)