from django.test import TestCase
from .models import Receta,Ingrediente
# Create your tests here.
class IngresoRecetaTestCase(TestCase):

    def testIngreso1(self):
        self.assertRaisesMessage( Receta(
            id=1,
            nombre_receta="pan con chancho",
            descripcion_corta="al pan ponerle chancho",
            cantidad_personas=10,
            categoria="POSTRES",
            regimen_alimenticio="DIABETICO",
            instrucciones_preparacion="pan y chancho",
            enlace_receta="https://127.0.0.1:8000/receta/1"
        ),"error validacion de datos???")
    def testIngreso2(self):
        receta=Receta(
            id=1,
            nombre_receta="pan con chancho",
            descripcion_corta="al pan ponerle chancho",
            cantidad_personas=10,
            categoria="POSTRES",
            regimen_alimenticio="DIABETICO",
            instrucciones_preparacion="pan y chancho",
            enlace_receta="https://127.0.0.1:8000/receta/1"
        )
        self.assertRaisesMessage( receta.save() ,"error validacion de datos???")