from decimal import Decimal, ROUND_HALF_UP
from django.db import models, transaction
from django.apps import apps
from django.contrib.auth.models import User
from django.core.validators import (
  RegexValidator, 
  FileExtensionValidator, 
  MinLengthValidator, 
  MaxLengthValidator, 
  MinValueValidator, 
  MaxValueValidator, 
  DecimalValidator
)
from django.core.exceptions import ValidationError

# Create your models here.

#validador propio para validar el tamaño imagen en R1.7
def validar_tamano_imagen(archivo):
    if archivo.size > 5 * 1024 * 1024: # si es mayor a 5MB (Restriccion R1.7)
        raise ValidationError("IMAGEN_REFERENCIAL no es un ingreso válido, supera el tamaño maximo de 5MB")


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

# Funcion 1: Modelo Receta
class Receta(models.Model):

    REGIMENES_ALIMENTICIOS = { 
        "VACIO":"",
        "NORMAL": "Normal",
        "DIABETICO": "Diabetico",
        "CELIACO": "Celiaco",
        "VEGETARIANO": "Vegetariano",
        "VEGANO": "Vegano",
        "SIN_LACTOSA": "Sin lactosa"
    }
    
    CATEGORIAS = {
        "VACIO":"",
        "POSTRES": "Postres",
        "ENSALADAS": "Ensaladas", 
        "PLATO_FONDO": "Plato de fondo",
        "SOPAS": "Sopas",
        "ENTRADAS": "Entradas",
        "BEBIDAS": "Bebidas",
        "DESAYUNOS": "Desayunos"
    }
    
    # R1.1 y R1.17.1: asignado por la base de datos
    id = models.BigAutoField(primary_key=True)

    # R1.2, R1.14, R1.15
    nombre_receta = models.CharField(
        max_length=100,
        unique=True,
        validators=[
            MinLengthValidator(3),
            # Regex: valores en 1.2 que: "se aceptarán caracteres alfabéticos en mayúscula, numéricos y  espacios"
            # no incluye a proposito caracteres:  |, &, <, >
            RegexValidator(r"^[A-ZÁÉÍÓÚÜÑ0-9 ]+$",
                           "NOMBRE_RECETA no es un ingreso válido, incluye caracteres no permitidos o incluye minúsculas"),
        ],
        error_messages={
            "unique": "Ya existe una receta con ese nombre. Por favor, utilice un nombre diferente",
        },
    )

    # R1.3
    descripcion_corta = models.CharField(
        max_length=300,
        validators=[
            MinLengthValidator(10),
            #Regex: valores de 1.3 que entran en "se aceptarán caracteres alfabéticos, numéricos,  espacios y signos de puntuación básicos(punto, coma, punto y coma)"
            RegexValidator(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,;:]+$",
                           "DESCRIPCION_CORTA no es un ingreso válido, incluye caracteres no permitidos"),
        ],
    )

    # R1.7: 
    imagen_referencial = models.ImageField(
        upload_to="recetas/",
        validators=[FileExtensionValidator(["jpg", "png"]),
                    validar_tamano_imagen],
        default="c.jpg",
    ) 

    # R1.8
    cantidad_personas = models.PositiveIntegerField(
        db_default=1,validators=[MinValueValidator(1), MaxValueValidator(100)],
    )


    categoria = models.CharField(max_length=20, choices=CATEGORIAS, db_default="VACIO")

    regimen_alimenticio = models.CharField(max_length=20, choices=REGIMENES_ALIMENTICIOS, db_default="VACIO")

    # R1.11
    instrucciones_preparacion = models.TextField(
        validators=[
            MinLengthValidator(20),
            MaxLengthValidator(5000),
            RegexValidator(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,;:()¿?¡!\-\n]+$",
                           "INSTRUCCIONES_PREPARACION no es un ingreso válido, incluye caracteres no permitidos"),
        ],
    )

    # R1.12 y R1.17.2: generado por el sistema, no ingresado
    enlace_receta = models.URLField(
        max_length=200, blank=True, 
        validators=[RegexValidator(
            #r"^https://www\.libroderecetas\.com/receta/\d+$", #Para uso en produccion
            r"^http://127.0.0.1:9000/receta/\d+$", # Para uso en desarrollo
            "ENLACE_RECETA no es un enlace valido")],
    )

    #para printear nombre receta
    def __str__(self):
        return self.nombre_receta
    
# Funcion 1: Modelo de ingredientes que ingresan con la receta
class Ingrediente(models.Model):
    receta = models.ForeignKey(
        Receta, on_delete=models.CASCADE, related_name="ingrediente_receta")

    # R1.4
    nombre_ingrediente = models.CharField(
        max_length=80,
        validators=[
            MinLengthValidator(3, "NOMBRE_INGREDIENTE no es un ingreso válido, debe tener minimo 3 caracteres"),
            RegexValidator(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ 0-9.,;:]+$",
                           "NOMBRE_INGREDIENTE no es un ingreso válido, incluye caracteres no permitidos"),
        ],
    )

    # R1.5: blank=True porque con "al gusto" se completa sola (R1.14)
    cantidad_ingrediente = models.DecimalField(
        max_digits=10, decimal_places=2, 
        validators=[MinValueValidator(0.01),MaxValueValidator(100)],
    )
    UNIDADES = {
        "VACIO":"",
        "GRAMOS": "gramos (g)",
        "KILOGRAMOS": "kilogramos (kg)",
        "MILILITROS": "mililitros (ml)",
        "LITROS": "litros (l)",
        "TAZAS": "tazas",
        "CUCHARADAS": "cucharadas",
        "CUCHARADITAS": "cucharaditas",
        "UNIDADES": "unidades",
        "AL_GUSTO": "al gusto"
        }

    unidad_medida = models.CharField(max_length=20, choices=UNIDADES)

    def __str__(self):
        return f"{self.nombre_ingrediente} ({self.cantidad_ingrediente} {self.unidad_medida})"

# Funcion 2
class Valoracion(models.Model):

    class VALORACION(models.IntegerChoices):
    
        NO_GUSTA_PARA_NADA = 1, "No gusta para nada"
        NO_ME_GUSTA = 2, "No me gusta"
        INDIFERENTE = 3, "Indiferente"
        ME_GUSTA = 4, "Me gusta"
        ME_GUSTA_MUCHO = 5, "Me gusta mucho"

    id = models.BigAutoField(primary_key=True, editable=False)
    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        primary_key=False,
        related_name="usuario"
    )
    receta = models.ForeignKey(
        Receta,
        on_delete=models.CASCADE,
        primary_key=False,
        related_name="valoracion_receta"
    )
    valoracion = models.IntegerField(
            choices=VALORACION.choices,
            validators=[MinValueValidator(1), MaxValueValidator(5)],
            verbose_name="Valoración"
        )

# Funcion 3
# referencias:
# https://docs.djangoproject.com/en/6.1/ref/models/instances/
# https://docs.djangoproject.com/en/6.1/topics/db/examples/one_to_one/
# https://docs.djangoproject.com/en/6.1/ref/models/fields/#onetoonefield
# https://docs.djangoproject.com/en/6.1/ref/validators/

class CalificacionReceta(models.Model): 
    # Campo ID_CALIFICACION especificado en R3.1 es implementado de forma implicita por Django AutoFields
    id = models.BigAutoField(primary_key=True)

    # Campo ID_RECETA especificado en R1.1
    # - Implementado con una relacion floja absoluta (lazy absolute relationship) 
    #   dado que depende de la implementacion de funcion 1: Ingresar Receta
    #   Advertencia: clase 'Receta' puede estar sujeto a cambio de nombre
    # Relacion OneToOneField cumple el requisito R3.9,
    # - "donde el ID_RECETA debe ser exactamente igual al ID_RECETA ingresado."
    receta = models.OneToOneField(
        Receta,
        on_delete=models.CASCADE,
        primary_key=False,
        related_name="calificacion_receta"
    )

    # Campo PROMEDIO_VALORACION especificado en R3.2
    promedio_valoracion = models.DecimalField(
        blank=True, 
        db_default=Decimal(1), 
        max_digits=2,
        decimal_places=1,
        validators=[
            MaxValueValidator(5),
            MinValueValidator(1),
        ], 
        db_comment="En escala de Likert, >=1 y <=5"
    )
    # Campo CANTIDAD_VALORACIONES especificado en R3.3
    cantidad_valoraciones = models.PositiveIntegerField(
        blank=True, 
        db_default=0, 
        validators=[
            MinValueValidator(0),
        ],
        db_comment="Puede ser blanco o cero"
    )

    def __str__(self):
        return str(f"prom: {self.promedio_valoracion}, cant: {self.cantidad_valoraciones}")
