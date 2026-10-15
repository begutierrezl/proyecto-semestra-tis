from django.shortcuts import render
from django.apps import apps
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import (
  Receta, 
  Ingrediente, 
  generar_receta_ajustada,
  Valoracion, 
  CalificacionReceta,
)
from .serializers import UserSerializer
from .serializers import CreateRecetaSerializer, ReadRecetaSerializer
#from .serializers import RecetaSerializer conflicto por resolver con Receta
from .serializers import ValoracionSerializer
from .serializers import CalificacionRecetaCreateSerializer, CalificacionRecetaUpdateSerializer
from .serializers import ParametrosAjusteSerializer, RecetaAjustadaSerializer
from rest_framework.views import APIView

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

#Ingreso receta Funcion R1: Ingreso de Recetas
#ingreso de receta
class CreateRecetaView(generics.CreateAPIView):
    queryset= Receta.objects.all()
    serializer_class = CreateRecetaSerializer
    permission_classes= [AllowAny]
    
#lista de todas las recetas
class ListRecetasView(generics.ListAPIView):
    queryset = Receta.objects.all()
    serializer_class = ReadRecetaSerializer
    permission_classes = [AllowAny]
    
#recupera una receta especifica por id
class RetrieveRecetaIdView(generics.RetrieveAPIView):
    queryset = Receta.objects.all()
    serializer_class = ReadRecetaSerializer
    permission_classes = [AllowAny]
    lookup_field="id"

# Dependencia de funcion 2 valoracion recetas -> Definicion de modelo Valoracion
def get_id_from_path(path: str) -> int:
    path_splited = path.split("/")
    for string in path_splited: 
        if string.isdecimal(): return str(string)
    return -1

class RetrieveValoracionView(generics.ListAPIView):
    serializer_class = ValoracionSerializer
    permission_classes = [AllowAny]
    lookup_field = "receta_id"

    def get_queryset(self):
        id_receta: int = get_id_from_path(self.request.path)
        if (id_receta == -1):
            raise Exception("No se especifico un ID en el path")
        receta = Receta.objects.get(id=id_receta)
        return Valoracion.objects.filter(receta=receta)

# ----------------------------------------------------------------------
# Funcion 3:
# ----------------------------------------------------------------------
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


# ======================================================================
# Función 2: Valoración de Recetas (R2)
# ======================================================================
class RegistrarOActualizarValoracionView(APIView):
    """
    Controlador para procesar la emisión de valoraciones.
    Cumple con R2.8, R2.8.1, R2.8.2, R2.8.3, R2.9 y R2.10.
    """
    permission_classes = [AllowAny]
    def post(self, request, *args, **kwargs):
        # 1. Recuperar los datos del cuerpo de la petición
        id_usuario = request.data.get("id_usuario") or request.data.get("usuario")
        id_receta = request.data.get("id_receta") or request.data.get("receta")
        valor_valoracion = request.data.get("valoracion")
        # Validación del rango Likert (1 a 5)
        try:
            valor_entero = int(valor_valoracion)
            if valor_entero < 1 or valor_entero > 5:
                raise ValueError()
        except (TypeError, ValueError):
            return Response(
                {"error": "VALORACION debe ser un número entero entre 1 y 5."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # ------------------------------------------------------------------
        # R2.9: Verificar que ID_USUARIO exista previamente en la base de datos
        # ------------------------------------------------------------------
        try:
            usuario = User.objects.get(id=id_usuario)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"mensaje": "Usuario no registrado. No es posible realizar la valoración"},
                status=status.HTTP_404_NOT_FOUND
            )
        # ------------------------------------------------------------------
        # R2.10: Verificar que ID_RECETA exista previamente en la base de datos
        # ------------------------------------------------------------------
        try:
            receta = Receta.objects.get(id=id_receta)
        except (Receta.DoesNotExist, ValueError):
            return Response(
                {"mensaje": "Receta no encontrada. No es posible realizar la valoración"},
                status=status.HTTP_404_NOT_FOUND
            )
        # ------------------------------------------------------------------
        # R2.8.1: Consultar si ya existe el par simultáneo (ID_USUARIO, ID_RECETA)
        # ------------------------------------------------------------------
        valoracion_existente = Valoracion.objects.filter(
            usuario=usuario,
            receta=receta
        ).first()
        # ------------------------------------------------------------------
        # R2.8.3: Si la consulta arroja un registro existente
        # ------------------------------------------------------------------
        if valoracion_existente:
            # Impide la creación de un nuevo identificador
            # Actualiza el campo VALORACION sobre el ID_VALORACION ya asociado
            valoracion_existente.valoracion = valor_entero
            valoracion_existente.save(update_fields=["valoracion"])
            return Response(
                {
                    "mensaje": "Su valoración ha sido actualizada exitosamente",
                    "id_valoracion": f"{valoracion_existente.id:012d}",
                    "id_usuario": f"{usuario.id:012d}",
                    "id_receta": receta.id,
                    "valoracion": valoracion_existente.valoracion
                },
                status=status.HTTP_200_OK
            )
        # ------------------------------------------------------------------
        # R2.8.2: Si la consulta no arroja resultados (combinación es única)
        # R2.8: Para ID_VALORACION, el sistema verifica que sea único e irrepetible
        # ------------------------------------------------------------------
        nueva_valoracion = Valoracion(
            usuario=usuario,
            receta=receta,
            valoracion=valor_entero
        )
        nueva_valoracion.save()
        return Response(
            {
                "mensaje": "Valoración registrada exitosamente",
                "id_valoracion": f"{nueva_valoracion.id:012d}",
                "id_usuario": f"{usuario.id:012d}",
                "id_receta": receta.id,
                "valoracion": nueva_valoracion.valoracion
            },
            status=status.HTTP_201_CREATED
        )