from django.shortcuts import render
from django.apps import apps
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import generar_receta_ajustada
from .serializers import (
    UserSerializer,
    ParametrosAjusteSerializer,
    RecetaAjustadaSerializer,
)

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# GET api/get/receta/<id_receta>/ajuste/?cantidad_personas_deseada=N
# ----------------------------------------------------------------------
# Dependencia de funcion 1 ingresar receta -> Definicion de modelo Receta
# (se obtiene de forma perezosa para no depender del orden de implementacion)
class AjusteIngredientesView(generics.RetrieveAPIView):
    serializer_class = RecetaAjustadaSerializer
    permission_classes = [AllowAny]  # obs1: sin un requisito de seguridad concreto

    def get_queryset(self):
        return apps.get_model("recetario", "Receta").objects.all()

    def retrieve(self, request, *args, **kwargs):
        # R4.1 y R4.2: validacion de CANTIDAD_PERSONAS_DESEADA
        parametros = ParametrosAjusteSerializer(data=request.query_params)
        parametros.is_valid(raise_exception=True)
        cantidad_deseada = parametros.validated_data["cantidad_personas_deseada"]

        # R4.3: verificar existencia del ID_RECETA
        try:
            receta = self.get_queryset().get(pk=kwargs["id_receta"])
        except ObjectDoesNotExist:
            raise NotFound("Receta no encontrada. No es posible realizar el ajuste")

        # R4.4 a R4.7: recuperar datos, calcular y armar la salida
        datos = generar_receta_ajustada(receta, cantidad_deseada)
        serializer = self.get_serializer(datos)
        return Response(serializer.data)