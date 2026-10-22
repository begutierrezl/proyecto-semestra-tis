from django.contrib import admin
from .models import Receta, Ingrediente, Valoracion, CalificacionReceta

# Register your models here.

admin.site.register(Receta)
admin.site.register(Ingrediente)
admin.site.register(CalificacionReceta)
admin.site.register(Valoracion)