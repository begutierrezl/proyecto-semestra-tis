from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from .models import Receta

# Create your views here.

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

# Funcion para buscar las recetas
@require_GET
def buscar_recetas(request):
    nombre = request.GET.get('nombre_receta', '').strip()
    categoria = request.GET.get('categoria', '').strip()
    regimen = request.GET.get('regimen_alimenticio', '').strip()

    if not nombre and not categoria and not regimen:
        return JsonResponse({"error": "Debe ingresar al menos un criterio de búsqueda para continuar"}, status=400)

    resultados = Receta.objects.all()

    if nombre:
        resultados = resultados.filter(nombre_receta__icontains=nombre)

    if categoria:
        resultados = resultados.filter(categoria=categoria.upper())
    
    if regimen:
        resultados = resultados.filter(regimen_alimenticio=regimen.upper())
    
    if not resultados.exists():
        return JsonResponse({"mensaje": "No se encontraron recetas que coincidan con los criterios de búsqueda ingresados"}, status=404)

    resultados = resultados.order_by('nombre_receta')

    lista_resultados = list(resultados.values('id', 'nombre_receta', 'categoria', 'regimen_alimenticio', 'descripcion_corta', 'enlace_receta'))

    return JsonResponse({"resultados": lista_resultados})