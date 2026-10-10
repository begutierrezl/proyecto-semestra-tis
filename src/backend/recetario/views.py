from django.shortcuts import render
from django.apps import apps
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .serializers import UserSerializer, RecetaAjusteSerializer

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# GET api/get/receta/<id_receta>/ajuste/
# El servidor solo consulta (R4.3 y R4.4). Calculo y validacion -> React.
# ----------------------------------------------------------------------
# Dependencia de funcion 1 ingresar receta -> Definicion de modelo Receta
class AjusteIngredientesView(generics.RetrieveAPIView):
    serializer_class = RecetaAjusteSerializer
    permission_classes = [AllowAny]  # obs1: sin un requisito de seguridad concreto

    def get_queryset(self):
        return apps.get_model("recetario", "Receta").objects.all()

    def retrieve(self, request, *args, **kwargs):
        # R4.3: verificar existencia del ID_RECETA
        try:
            receta = self.get_queryset().get(pk=kwargs["id_receta"])
        except ObjectDoesNotExist:
            raise NotFound("Receta no encontrada. No es posible realizar el ajuste")

        # R4.4: recuperar datos de la receta y sus ingredientes
        serializer = self.get_serializer(receta)
        return Response(serializer.data)
