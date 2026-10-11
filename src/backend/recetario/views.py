from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .models import Receta, Valoracion, CalificacionReceta
from .serializers import UserSerializer, RecetaSerializer
from .serializers import ValoracionSerializer
from .serializers import CalificacionRecetaCreateSerializer, CalificacionRecetaUpdateSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Dependencia de pruebas funcion 3, funcion 1 ingresa receta
class CreateRecetaView(generics.CreateAPIView):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    permission_classes = [AllowAny]

# Dependencia de funcion 1 ingresar receta -> Definicion de modelo Receta
class RecetasListView(generics.ListAPIView):
    queryset = Receta.objects.all()
    serializer_class = RecetaSerializer
    permission_classes = [AllowAny]

# Dependencia de funcion 2 valoracion recetas -> Definicion de modelo Valoracion
class RetrieveValoracionView(generics.ListAPIView):
    queryset = Valoracion.objects.all()
    serializer_class = ValoracionSerializer
    permission_classes = [AllowAny]
    lookup_field = "receta_id"


# referencias 
# https://www.django-rest-framework.org/api-guide/generic-views/#concrete-view-classes

# Crear una calificacion de una receta, caso R3.9 no se cumple requisito
# "El sistema (API) verificará la existencia de una calificación asociada a una receta"
# La calificacion no existe -> debe ser creada
class CreateCalificacionView(generics.CreateAPIView):
    queryset = CalificacionReceta.objects.all()
    serializer_class = CalificacionRecetaCreateSerializer
    permission_classes = [AllowAny] # obs1: Sin un requisito de seguridad concreto, maxima validacion 
                                    #       de autenticacion debiese ser el dueño de una receta

# Actualizar los campos de una calificacion de una receta, caso R3.9 se cumple requisito
# "En caso de que R3.9 sea exitoso, el sistema (API) actualizará los campos CANTIDAD_VALORACIONES, PROMEDIO_VALORACION"
# La calificacion existe y tiene una receta asociada -> debe ser actualizada
class RetrieveUpdateCalificacionFromIdView(generics.RetrieveUpdateAPIView):
    # se necesita recuperar el ID_RECETA de la URL para poder realizar la asociacion en la BD
    queryset = CalificacionReceta.objects.all()
    serializer_class = CalificacionRecetaUpdateSerializer
    permission_classes = [AllowAny] # obs1: ...
    lookup_field = "id"

# Recuperar califiaciones, caso R3.9 y R3.11
# R3.11: Validacion "CANTIDAD_VALORACIONES sea mayor o igual a uno (≥1)" debe ser realizada del lado
#        del usuario [citar end_point en Pagina Web]
# R3.14: Validacion "... no se encuentra ninguna receta con al menos una calificación, ..." debe ser
#        realizada del lado del usuario [citar end_point en Pagina Web]
class RetrieveUpdateCalifiacionFromRecetaView(generics.RetrieveUpdateAPIView):
    queryset = CalificacionReceta.objects.all()
    serializer_class = CalificacionRecetaUpdateSerializer
    permission_classes = [AllowAny]
    lookup_field = "receta_id"