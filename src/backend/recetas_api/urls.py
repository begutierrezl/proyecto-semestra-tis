"""
URL configuration for recetas_api project.

The `urlpatterns` list routes URLs to views. For more information please see:
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
from recetario.views import CreateRecetaView
from recetario.views import CreateCalificacionView, RetrieveCalifiacionView, RetrieveUpdateCalificacionView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/insert/receta/", CreateRecetaView.as_view(), name="create_receta"),
    path("api/get/calificacion/<int:id>/", RetrieveCalifiacionView.as_view(), name="get_calificacion"),
    path("api/get/calificacion/<int:id_receta>/", RetrieveCalifiacionView.as_view(), name="get_calificacion_receta"),
    path("api/insert/calificacion/", CreateCalificacionView.as_view(), name="get_calificaciones"),
    path("api/update/calificacion/<int:id>/", RetrieveUpdateCalificacionView.as_view(), name="update_calificacion"),
]
