"""
URL configuration for recetas_api project.

The urlpatterns list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from recetario.views import CreateUserView
from recetario.views import ListRecetasView, CreateRecetaView, RetrieveRecetaIdView
from recetario.views import RetrieveValoracionView, RegistrarOActualizarValoracionView
from recetario.views import CreateCalificacionView, RetrieveUpdateCalificacionFromIdView, RetrieveUpdateCalifiacionFromRecetaView
from recetario.views import AjusteIngredientesView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/receta/insert/", CreateRecetaView.as_view(), name="create_receta"), #Funcion 1: Ingreso de Recetas
    path("api/receta/", ListRecetasView.as_view(), name="get_recetas"), # Listar todas las recetas
    path("api/receta/<int:id>",RetrieveRecetaIdView.as_view(), name="get_receta"), # Listar receta con id
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    # Valoracion
    path("api/valoracion/<int:receta_id>/", RetrieveValoracionView.as_view(), name="get_valoracion"),
    # Calificacion
    path("api/calificacion/get/from_id/<int:id>/", RetrieveUpdateCalificacionFromIdView.as_view(), name="get_calificacion"),
    path("api/calificacion/get/from_receta/<int:receta_id>/", RetrieveUpdateCalifiacionFromRecetaView.as_view(), name="get_calificacion_receta"),
    path("api/calificacion/insert/", CreateCalificacionView.as_view(), name="insert_calificacion"),
    path("api/calificacion/update/from_receta/<int:receta_id>/", RetrieveUpdateCalifiacionFromRecetaView.as_view(), name="update_calificacion"),
    # Funcion 4: Ajuste de ingredientes segun cantidad de personas
    path("api/get/receta/<int:id_receta>/ajuste/", AjusteIngredientesView.as_view(), name="ajuste_ingredientes"),
    path("api/valoracion/registrar/", RegistrarOActualizarValoracionView.as_view(), name="registrar_valoracion"),
]
