from decimal import Decimal
from django.db import models
from .receta import Receta
from django.core.validators import ( 
  MinValueValidator, 
  MaxValueValidator, 
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
