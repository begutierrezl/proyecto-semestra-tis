from rest_framework import generics
from rest_framework.permissions import AllowAny
from ..models.receta import Receta
from ..serializers.receta import CreateRecetaSerializer, ReadRecetaSerializer

# ======================================================================
# Función 1: Ingreso de recetas (R1)
# ======================================================================

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
