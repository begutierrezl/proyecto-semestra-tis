from django.contrib import admin
from .models.receta import Receta, Ingrediente
from .models.valoracion import Valoracion
from .models.calificacion import CalificacionReceta

# Register your models here.

admin.site.register(Receta)
admin.site.register(Ingrediente)
admin.site.register(CalificacionReceta)
admin.site.register(Valoracion)