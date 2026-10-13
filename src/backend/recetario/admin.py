from django.contrib import admin
from .models import Receta, Valoracion, CalificacionReceta

# Register your models here.

admin.site.register(Receta)
admin.site.register(CalificacionReceta)
admin.site.register(Valoracion)