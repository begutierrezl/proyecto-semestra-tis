from django.db import models, transaction
from django.core.validators import MinLengthValidator, RegexValidator, FileExtensionValidator, MaxLengthValidator,MinValueValidator,MaxValueValidator
from decimal import Decimal
from django.core.exceptions import ValidationError

# Create your models here.




#validador propio para validar el tamaño imagen
def validar_tamano_imagen(archivo):
    if archivo.size > 5 * 1024 * 1024: # si es mayor a 5MB (Restriccion R1.7)
        raise ValidationError("IMAGEN_REFERENCIAL no es un ingreso válido, supera el tamaño maximo de 5MB")



class Receta(models.Model):

    # R1.1 y R1.17.1: asignado por la base de datos
    ID_RECETA = models.BigAutoField(primary_key=True)

    # R1.2, R1.14, R1.15
    NOMBRE_RECETA = models.CharField(
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
    DESCRIPCION_CORTA = models.CharField(
        max_length=300,
        validators=[
            MinLengthValidator(10),
            #Regex: valores de 1.3 que entran en "se aceptarán caracteres alfabéticos, numéricos,  espacios y signos de puntuación básicos(punto, coma, punto y coma)"
            RegexValidator(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,;]+$",
                           "DESCRIPCION_CORTA no es un ingreso válido, incluye caracteres no permitidos"),
        ],
    )

    # R1.7: no nulo
    IMAGEN_REFERENCIAL = models.ImageField(
        upload_to="recetas/",
        validators=[FileExtensionValidator(["jpg", "png"]),
                    validar_tamano_imagen],
    )

    # R1.8
    CANTIDAD_PERSONAS = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(100)],
    )

    class Categoria(models.TextChoices):          # R1.9 
        POSTRES = "postres", "Postres"
        ENSALADAS = "ensaladas", "Ensaladas"
        PLATO_DE_FONDO = "plato de fondo", "Plato de fondo"
        SOPAS = "sopas", "Sopas"
        ENTRADAS = "entradas", "Entradas"
        BEBIDAS = "bebidas", "Bebidas"
        DESAYUNOS = "desayunos", "Desayunos"

    CATEGORIA = models.CharField(max_length=20, choices=Categoria.choices)

    class Regimen(models.TextChoices):            # R1.10 
        NORMAL = "normal", "Normal"
        DIABETICO = "diabetico", "Diabético"
        CELIACO = "celíaco", "Celíaco"
        VEGETARIANO = "vegetariano", "Vegetariano"
        VEGANO = "vegano", "Vegano"
        SIN_LACTOSA = "sin lactosa", "Sin lactosa"
    REGIMEN_ALIMENTICIO = models.CharField(max_length=20, choices=Regimen.choices)

    # R1.11
    INSTRUCCIONES_PREPARACION = models.TextField(
        validators=[
            MinLengthValidator(20),
            MaxLengthValidator(5000),
            RegexValidator(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 .,;:()¿?¡!\-\n]+$",
                           "INSTRUCCIONES_PREPARACION no es un ingreso válido, incluye caracteres no permitidos"),
        ],
    )

    # R1.12 y R1.17.2: generado por el sistema, no ingresado
    ENLACE_RECETA = models.URLField(
        max_length=200, blank=True, editable=False,
        validators=[RegexValidator(
            r"^https://www\.libroderecetas\.com/receta/\d+$",
            "ENLACE_RECETA no es un enlace valido")],
    )


    #para printear nombre receta
    def __str__(self):
        return self.NOMBRE_RECETA

    def save(self, *args, **kwargs):
        # metodo save de clase models, se llama de la misma manera y se le añade la generacion del enlace despues de insertar el id
        with transaction.atomic():
            super().save(*args, **kwargs)
            enlace = f"https://www.libroderecetas.com/receta/{self.ID_RECETA}"
            if self.ENLACE_RECETA != enlace:
                self.ENLACE_RECETA = enlace
                super().save(update_fields=["ENLACE_RECETA"])


class Ingrediente(models.Model):
    RECETA = models.ForeignKey(
        Receta, on_delete=models.CASCADE, related_name="ingredientes")

    # R1.4
    NOMBRE_INGREDIENTE = models.CharField(
        max_length=80,
        validators=[
            MinLengthValidator(3, "NOMBRE_INGREDIENTE no es un ingreso válido, debe tener minimo 3 caracteres"),
            RegexValidator(r"^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$",
                           "NOMBRE_INGREDIENTE no es un ingreso válido, incluye caracteres no permitidos"),
        ],
    )

    # R1.5: blank=True porque con "al gusto" se completa sola (R1.14)
    CANTIDAD_INGREDIENTE = models.DecimalField(
        max_digits=10, decimal_places=2, blank=True, null=True,
        validators=[MinValueValidator(Decimal("0.01"))],
    )
    class Unidad(models.TextChoices):             # R1.6
        GRAMOS = "gramos (g)", "gramos (g)"
        KILOGRAMOS = "kilogramos (kg)", "kilogramos (kg)"
        MILILITROS = "mililitros (ml)", "mililitros (ml)"
        LITROS = "litros (l)", "litros (l)"
        TAZAS = "tazas", "tazas"
        CUCHARADAS = "cucharadas", "cucharadas"
        CUCHARADITAS = "cucharaditas", "cucharaditas"
        UNIDADES = "unidades", "unidades"
        AL_GUSTO = "al gusto", "al gusto"


    UNIDAD_MEDIDA = models.CharField(max_length=20, choices=Unidad.choices)


    def __str__(self):
        return f"{self.NOMBRE_INGREDIENTE} ({self.CANTIDAD_INGREDIENTE} {self.UNIDAD_MEDIDA})"