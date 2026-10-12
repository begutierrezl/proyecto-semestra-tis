from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.views.decorators.http import require_GET

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Datos falsos para simular la base de datos temporalmente
RECETAS_MOCK = [
    {"ID_RECETA": 1, "NOMBRE_RECETA": "Tarta de Manzana", "CATEGORIA": "postres", "REGIMEN_ALIMENTICIO": "normal", "DESCRIPCION_CORTA": "Deliciosa tarta dulce.", "ENLACE_RECETA": "https://www.libroderecetas.com/receta/1"},
    {"ID_RECETA": 2, "NOMBRE_RECETA": "Ensalada Cesar", "CATEGORIA": "ensaladas", "REGIMEN_ALIMENTICIO": "normal", "DESCRIPCION_CORTA": "Con pollo y crutones.", "ENLACE_RECETA": "https://www.libroderecetas.com/receta/2"},
    {"ID_RECETA": 3, "NOMBRE_RECETA": "Sopa de Verduras", "CATEGORIA": "sopas", "REGIMEN_ALIMENTICIO": "vegano", "DESCRIPCION_CORTA": "Sopa muy nutritiva.", "ENLACE_RECETA": "https://www.libroderecetas.com/receta/3"},
]

# Funcion para buscar las recetas
@require_GET
def buscar_recetas(request):
    nombre = request.GET.get('NOMBRE_RECETA', '').strip()
    categoria = request.GET.get('CATEGORIA', '').strip()
    regimen = request.GET.get('REGIMEN_ALIMENTICIO', '').strip()

    if not nombre and not categoria and not regimen:
        return JsonResponse({"error": "Debe ingresar al menos un criterio de búsqueda para continuar"}, status=400)

    resultados = RECETAS_MOCK

    if nombre:
        resultados = [r for r in resultados if nombre.lower() in r['NOMBRE_RECETA'].lower()]
    
    if categoria:
        resultados = [r for r in resultados if r['CATEGORIA'] == categoria]
    
    if regimen:
        resultados = [r for r in resultados if r['REGIMEN_ALIMENTICIO'] == regimen]
    
    if not resultados:
        return JsonResponse({"mensaje": "No se encontraron recetas que coincidan con los criterios de búsqueda ingresados"}, status=404)

    resultados = sorted(resultados, key=lambda x: x['NOMBRE_RECETA'])

    return JsonResponse({"resultados": resultados})