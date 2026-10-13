from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, CreateRecetaSerializer, ReadRecetaSerializer
from .models import Receta, Ingrediente
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

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
class ListRecetaidView(generics.RetrieveAPIView):
    queryset = Receta.objects.all()
    serializer_class = ReadRecetaSerializer
    permission_classes = [AllowAny]
    lookup_field="id"
