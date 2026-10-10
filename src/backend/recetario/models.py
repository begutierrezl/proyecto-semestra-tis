from decimal import Decimal, ROUND_HALF_UP
from django.apps import apps
from django.db import models

# Create your models here.

# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# No requiere tabla nueva: CANTIDAD_AJUSTADA es un dato calculado (R4.5)
# Dependencia de funcion 1 (ingresar receta): modelos Receta e IngredienteReceta
# Advertencia: nombres de clase/campos pueden estar sujetos a cambio
# ----------------------------------------------------------------------

# R4.5: CANTIDAD_AJUSTADA = (CANTIDAD_INGREDIENTE / CANTIDAD_PERSONAS) * CANTIDAD_PERSONAS_DESEADA
# - Se usa Decimal para evitar errores de punto flotante
# - Maximo 2 decimales
def calcular_cantidad_ajustada(cantidad_ingrediente, cantidad_personas, cantidad_personas_deseada):
    if cantidad_personas <= 0:
        # R1.8 garantiza CANTIDAD_PERSONAS > 0, esto es solo una proteccion
        raise ValueError("CANTIDAD_PERSONAS debe ser mayor a cero")
    ajustada = (
        Decimal(str(cantidad_ingrediente)) / Decimal(cantidad_personas)
    ) * Decimal(cantidad_personas_deseada)
    return float(ajustada.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


# R4.4 a R4.7: recupera ingredientes de la receta y arma la salida
def generar_receta_ajustada(receta, cantidad_personas_deseada):
    IngredienteReceta = apps.get_model("recetario", "IngredienteReceta")
    ingredientes = IngredienteReceta.objects.filter(id_receta=receta.pk)

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
