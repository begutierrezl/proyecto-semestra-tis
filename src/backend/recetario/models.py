from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy

# Create your models here.

# referencias:
# https://docs.djangoproject.com/en/6.1/ref/models/instances/
# https://docs.djangoproject.com/en/6.1/topics/db/examples/one_to_one/
# https://docs.djangoproject.com/en/6.1/ref/models/fields/#onetoonefield
# https://docs.djangoproject.com/en/6.1/ref/validators/

# Validacion de campo PROMEDIO_VALORACION segun lo especificado en R3.2
# "se utilizara un valor numerico decimal restringido segun la escala de Likert"
def validar_promedio_valoracion(value):
    if value < 1 or value > 5:
        raise ValidationError(
            gettext_lazy("%(value)s no esta en la escala de Likert"), 
            params={"value": value},
        )

class CalificacionReceta(models.Model): 
    # Campo ID_CALIFICACION especificado en R3.1 es implementado de forma implicita por Django AutoFields

    # Campo ID_RECETA especificado en R1.1
    # - Implementado con una relacion floja absoluta (lazy absolute relationship) 
    #   dado que depende de la implementacion de funcion 1: Ingresar Receta
    #   Advertencia: clase 'Receta' puede estar sujeto a cambio de nombre
    # Relacion OneToOneField cumple el requisito R3.9,
    # - "donde el ID_RECETA debe ser exactamente igual al ID_RECETA ingresado."
    id_receta = models.OneToOneField(
        "recetario.Receta",
        on_delete=models.CASCADE,
        primary_key=False,
    )

    # Campo PROMEDIO_VALORACION especificado en R3.2
    promedio_valoracion = models.FloatField(
        blank=True, 
        db_default=1, 
        validators=[
            validar_promedio_valoracion,
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

    def save(self, *, force_insert = ..., force_update = ..., using = ..., update_fields = ...):
        # pendiente cumplir requisito #3.10 cuando R3.8 es exitoso -> caso force_update
        # puede quedar a opcion de liberar una funcion update particular para este caso en vez de forzar
        # la actualizacion mediante el servidor

        return super().save(force_insert=force_insert, force_update=force_update, using=using, update_fields=update_fields)

    def __str__(self):
        return str(f"prom: {self.promedio_valoracion}, cant: {self.cantidad_valoraciones}")
    