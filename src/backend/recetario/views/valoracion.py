from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..models.receta import Receta
from ..models.valoracion import Valoracion
from ..serializers.valoracion import UserSerializer, ValoracionInputSerializer
from rest_framework.views import APIView

# Complemento de funcion 2
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# ======================================================================
# Función 2: Valoración de Recetas (R2) — VISTA 1: REGISTRAR
# ======================================================================
class RegistrarValoracionView(generics.GenericAPIView): 
    permission_classes = [AllowAny]
    serializer_class = ValoracionInputSerializer # <-- Esto dibuja el formulario en la web

    def post(self, request, *args, **kwargs):
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
        # R2.9: Verificar que ID_USUARIO exista previamente en la base de datos
        try:
            usuario = User.objects.get(id=id_usuario)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"mensaje": "Usuario no registrado. No es posible realizar la valoración"},
                status=status.HTTP_404_NOT_FOUND
            )
        # R2.10: Verificar que ID_RECETA exista previamente en la base de datos
        try:
            receta = Receta.objects.get(id=id_receta)
        except (Receta.DoesNotExist, ValueError):
            return Response(
                {"mensaje": "Receta no encontrada. No es posible realizar la valoración"},
                status=status.HTTP_404_NOT_FOUND
            )
        # R2.8.1: Consultar si ya existe el par simultáneo (ID_USUARIO, ID_RECETA)
        ya_existe = Valoracion.objects.filter(
            usuario=usuario,
            receta=receta
        ).exists()
        
        if ya_existe:
            return Response(
                {"mensaje": "Ya existe una valoración de este usuario para esta receta. Use el endpoint de actualización."},
                status=status.HTTP_400_BAD_REQUEST
            )
        # R2.8.2: No existe el par -> combinación única, generar nuevo ID_VALORACION
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

# ======================================================================
# Función 2: Valoración de Recetas (R2) — VISTA 2: ACTUALIZAR
# ======================================================================
class ActualizarValoracionView(generics.GenericAPIView):
    """
    Actualiza una valoración existente.
    Cumple con R2.8.1, R2.8.3, R2.9 y R2.10.
    Método: PUT
    """
    permission_classes = [AllowAny]
    serializer_class = ValoracionInputSerializer # <-- Esto dibuja el formulario en la web

    def put(self, request, *args, **kwargs):
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
        # R2.9: Verificar que ID_USUARIO exista previamente en la base de datos
        try:
            usuario = User.objects.get(id=id_usuario)
        except (User.DoesNotExist, ValueError):
            return Response(
                {"mensaje": "Usuario no registrado. No es posible realizar la valoración"},
                status=status.HTTP_404_NOT_FOUND
            )
        # R2.10: Verificar que ID_RECETA exista previamente en la base de datos
        try:
            receta = Receta.objects.get(id=id_receta)
        except (Receta.DoesNotExist, ValueError):
            return Response(
                {"mensaje": "Receta no encontrada. No es posible realizar la valoración"},
                status=status.HTTP_404_NOT_FOUND
            )
        # R2.8.1: Consultar si ya existe el par simultáneo (ID_USUARIO, ID_RECETA)
        valoracion_existente = Valoracion.objects.filter(
            usuario=usuario,
            receta=receta
        ).first()
        
        if not valoracion_existente:
            return Response(
                {"mensaje": "No existe una valoración previa de este usuario para esta receta. Use el endpoint de registro."},
                status=status.HTTP_404_NOT_FOUND
            )
        # R2.8.3: Registro existente -> impedir nuevo ID y actualizar VALORACION
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
