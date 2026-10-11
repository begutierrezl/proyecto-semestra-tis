from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator, DecimalValidator
from django.contrib.auth.models import User

# Create your models here.

# dependencias
class Receta(models.Model):
    nombre = models.CharField(max_length=50, db_default="")

class Valoracion(models.Model):
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
    valoracion = models.FloatField(db_default=1)

# referencias:
# https://docs.djangoproject.com/en/6.1/ref/models/instances/
# https://docs.djangoproject.com/en/6.1/topics/db/examples/one_to_one/
# https://docs.djangoproject.com/en/6.1/ref/models/fields/#onetoonefield
# https://docs.djangoproject.com/en/6.1/ref/validators/

class CalificacionReceta(models.Model): 
    # Campo ID_CALIFICACION especificado en R3.1 es implementado de forma implicita por Django AutoFields

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
        related_name="receta"
    )

    # Campo PROMEDIO_VALORACION especificado en R3.2
    promedio_valoracion = models.FloatField(
        blank=True, 
        db_default=1, 
        validators=[
            MaxValueValidator(5),
            MinValueValidator(1),
            DecimalValidator(max_digits=None, decimal_places=1),
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

    def save(self, **kwargs):
        if "promedio_valoracion" in kwargs:
            print(kwargs["promedio_valoraciones"])
        return super().save(**kwargs)
    