from django.db import models
from .receta import Receta
from django.contrib.auth.models import User
from django.core.validators import (
  MinValueValidator, 
  MaxValueValidator, 
)

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