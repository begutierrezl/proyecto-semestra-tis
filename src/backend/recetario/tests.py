from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import Receta, Ingrediente
from .models import CalificacionReceta

# Create your tests here.

class IdCalificacionTestCase(TestCase):

    @classmethod
    def setUpTestData(self):
        self.receta = Receta.objects.create(nombre="placeholder")
    
    def testValidarIdCalificacion_UT_R31_01(self):
        calificacion = CalificacionReceta(
            id=1,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
        )
        self.assertEqual(calificacion.id, 1)

    def testValidarIdCalificacion_UT_R31_02(self):
        calificacion = CalificacionReceta(
            id=4587,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
        )
        self.assertEqual(calificacion.id, 4587)

    def testValidarIdCalificacion_UT_R31_03(self):
        calificacion = CalificacionReceta(
            id=999999999999,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
        )
        self.assertEqual(calificacion.id, 999999999999)

    def testValidarIdCalificacion_UT_R31_04(self):
        self.assertRaisesMessage(
            CalificacionReceta(
            id=0,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
            ),
            "ID_CALIFICACION invalido: debe ser > 0"
        )

    def testValidarIdCalificacion_UT_R31_05(self):
        self.assertRaisesMessage(
            CalificacionReceta(
            id=-5,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
            ),
            "ID_CALIFICACION invalido: debe ser > 0"
        )

    def testValidarIdCalificacion_UT_R31_06(self):
        self.assertRaisesMessage(CalificacionReceta(
            id=1000000000000,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
            ),
            "ID_CALIFICACION invalido: maximo 12 digitos"
        )

    def testValidarIdCalificacion_UT_R31_07(self):
        self.assertRaisesMessage(CalificacionReceta(
            id=3.5,
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
            ),
            "ID_CALIFICACION invalido: debe ser entero"
        )

    def testValidarIdCalificacion_UT_R31_08(self):
        self.assertRaisesMessage(CalificacionReceta(
            id="abc",
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0
            ),
            "ID_CALIFICACION invalido: debe ser entero"
        )
    
class PromedioValoracionTestCase(TestCase):

    @classmethod
    def setUpTestData(self):
        self.receta = Receta.objects.create(nombre="placeholder")

    def testValidarPromedioValoracion_UT_R32_01(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=1.1,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 1.1)

    def testValidarPromedioValoracion_UT_R32_02(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=4.9,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 4.9)

    def testValidarPromedioValoracion_UT_R32_03(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=3.5,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 3.5)

    def testValidarPromedioValoracion_UT_R32_04(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=4,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 4.0)

    def testValidarPromedioValoracion_UT_R32_05(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=1.0,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 1.0)

    def testValidarPromedioValoracion_UT_R32_06(self):
        self.assertRaisesMessage(CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=0,
            cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION invalido: debe ser >= 1, en escala de Likert"
        )

    def testValidarPromedioValoracion_UT_R32_07(self):
        self.assertRaisesMessage(CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=-1.2,
            cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION invalido: debe ser >= 1, en escala de Likert"
        )

    def testValidarPromedioValoracion_UT_R32_08(self):
        self.assertRaisesMessage(
            CalificacionReceta(
                receta=self.receta,
                promedio_valoracion=3.55,
                cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION invalido: debe ser flotante con 1 decimal"
        )

    def testValidarPromedioValoracion_UT_R32_09(self):
        self.assertRaisesMessage(
            CalificacionReceta(
                receta=self.receta,
                promedio_valoracion=0.95,
                cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION invalido: debe ser flotante con 1 decimal"
        )

    def testValidarPromedioValoracion_UT_R32_10(self):
        self.assertRaisesMessage(CalificacionReceta(
            receta=self.receta,
            promedio_valoracion="abc",
            cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION invalido: debe ser flotante en escala de Likert"
        )

    def testValidarPromedioValoracion_UT_R32_11(self):
        self.assertRaisesMessage(CalificacionReceta(
            receta=self.receta,
            cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION faltante: campo obligatorio"
        )

    def testValidarPromedioValoracion_UT_R32_12(self):
        self.assertRaisesMessage(CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=5.1,
            cantidad_valoraciones=0,
            ),
            "PROMEDIO_VALORACION invalido: debe ser <= 5, en escala de Likert"
        )

class CantidadValoracionesTestCase(TestCase):

    @classmethod
    def setUpTestData(self):
        self.receta = Receta.objects.create(nombre="placeholder")

    def testValidarCantidadValoraciones_UT_R33_01(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=1,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.cantidad_valoraciones, 0)

    def testValidarCantidadValoraciones_UT_R33_02(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=1,
            cantidad_valoraciones=1,
        )
        self.assertEqual(calificacion.cantidad_valoraciones, 1)


    def testValidarCantidadValoraciones_UT_R33_03(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=1,
            cantidad_valoraciones=250,
        )
        self.assertEqual(calificacion.cantidad_valoraciones, 250)

    def testValidarCantidadValoraciones_UT_R33_04(self):
        self.assertRaisesMessage(CalificacionReceta(
                receta=self.receta,
                promedio_valoracion=1,
                cantidad_valoraciones=-1,
            ),
            "CANTIDAD_VALORACIONES invalida: Debe ser >=0"
        )

    def testValidarCantidadValoraciones_UT_R33_05(self):
        self.assertRaisesMessage(CalificacionReceta(
                receta=self.receta,
                promedio_valoracion=1,
                cantidad_valoraciones=2.5,
            ),
            "CANTIDAD_VALORACIONES invalida: Debe ser entero"
        )

    def testValidarCantidadValoraciones_UT_R33_06(self):
        self.assertRaisesMessage(CalificacionReceta(
                receta=self.receta,
                promedio_valoracion=1,
                cantidad_valoraciones="abc",
            ),
            "CANTIDAD_VALORACIONES invalida: Debe ser entero"
        )

    def testValidarCantidadValoraciones_UT_R33_07(self):
        self.assertRaisesMessage(CalificacionReceta(
                receta=self.receta,
                promedio_valoracion=1,
            ),
            "CANTIDAD_VALORACIONES faltante: Campo Obligatorio"
        )

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


# ----------------------------------------------------------------------
# Funcion 4: Ajuste de ingredientes segun cantidad de personas (R4)
# Pruebas unitarias U-01 a U-13 (documento "Pruebas unitarias R4")
#
# Para ejecutar solo estas pruebas (dentro del contenedor del backend):
#   python manage.py test recetario.tests.AjusteIngredientesTestCase
# ----------------------------------------------------------------------
class AjusteIngredientesTestCase(TestCase):

    MENSAJE_ORIGINAL = (
        "Las cantidades mostradas corresponden a la cantidad de personas "
        "original de la receta"
    )
    MENSAJE_NO_ENCONTRADA = "Receta no encontrada. No es posible realizar el ajuste"

    def setUp(self):
        self.client = APIClient()

    # --- Funciones de apoyo -------------------------------------------

    def crearReceta(self, nombre, cantidad_personas, ingredientes):
        """Crea una receta con sus ingredientes.
        ingredientes: lista de tuplas (nombre, cantidad, unidad_medida)."""
        receta = Receta.objects.create(
            nombre_receta=nombre,
            descripcion_corta="Receta de prueba para el ajuste de ingredientes",
            cantidad_personas=cantidad_personas,
            categoria="PLATO_FONDO",
            regimen_alimenticio="NORMAL",
            instrucciones_preparacion="Mezclar todos los ingredientes y cocinar por veinte minutos",
        )
        for nombre_ing, cantidad, unidad in ingredientes:
            Ingrediente.objects.create(
                receta=receta,
                nombre_ingrediente=nombre_ing,
                cantidad_ingrediente=cantidad,
                unidad_medida=unidad,
            )
        return receta

    def pedirAjuste(self, id_receta, cantidad_deseada=None):
        """Hace el GET al endpoint de ajuste. Si cantidad_deseada es None,
        no se envia el parametro."""
        url = reverse("ajuste_ingredientes", kwargs={"id_receta": id_receta})
        if cantidad_deseada is None:
            return self.client.get(url)
        return self.client.get(url, {"cantidad_personas_deseada": cantidad_deseada})

    def ingredientesPorNombre(self, respuesta):
        """Devuelve {nombre_ingrediente: ingrediente_ajustado} de la respuesta."""
        return {
            ing["nombre_ingrediente"]: ing
            for ing in respuesta.json()["ingredientes_ajustados"]
        }

    def mensajeDeErrorCantidad(self, respuesta):
        return " ".join(respuesta.json()["cantidad_personas_deseada"])

    # --- U-01: calculo proporcional correcto (R4.5) -------------------

    def testAjuste_U01_CalculoProporcionalCorrecto(self):
        receta = self.crearReceta("RECETA U01", 4, [("Harina", "200", "GRAMOS")])
        respuesta = self.pedirAjuste(receta.id, 8)
        self.assertEqual(respuesta.status_code, 200)
        ingredientes = self.ingredientesPorNombre(respuesta)
        self.assertEqual(ingredientes["Harina"]["cantidad_ajustada"], 400.00)
        self.assertEqual(respuesta.json()["cantidad_personas_deseada"], 8)

    # --- U-02: redondeo a 2 decimales (R4.5) --------------------------

    def testAjuste_U02_RedondeoADosDecimales(self):
        receta = self.crearReceta("RECETA U02", 3, [("Harina", "100", "GRAMOS")])
        respuesta = self.pedirAjuste(receta.id, 2)
        self.assertEqual(respuesta.status_code, 200)
        ingredientes = self.ingredientesPorNombre(respuesta)
        # (100 / 3) * 2 = 66.666... -> 66.67
        self.assertEqual(ingredientes["Harina"]["cantidad_ajustada"], 66.67)

    # --- U-03: cantidad deseada igual a la original (R4.7) ------------

    def testAjuste_U03_CantidadDeseadaIgualALaOriginal(self):
        receta = self.crearReceta("RECETA U03", 4, [("Harina", "200", "GRAMOS")])
        # R4.7: no se debe ejecutar el calculo de R4.5
        with patch("recetario.models.calcular_cantidad_ajustada") as calculo:
            respuesta = self.pedirAjuste(receta.id, 4)
            calculo.assert_not_called()
        self.assertEqual(respuesta.status_code, 200)
        ingredientes = self.ingredientesPorNombre(respuesta)
        self.assertEqual(ingredientes["Harina"]["cantidad_ajustada"], 200.00)
        self.assertEqual(respuesta.json()["mensaje"], self.MENSAJE_ORIGINAL)

    # --- U-04: receta con multiples ingredientes ----------------------

    def testAjuste_U04_RecetaConMultiplesIngredientes(self):
        receta = self.crearReceta("RECETA U04", 2, [
            ("Harina", "200", "GRAMOS"),
            ("Leche", "500", "MILILITROS"),
            ("Huevos", "3", "UNIDADES"),
        ])
        respuesta = self.pedirAjuste(receta.id, 5)
        self.assertEqual(respuesta.status_code, 200)
        ingredientes = self.ingredientesPorNombre(respuesta)
        self.assertEqual(len(ingredientes), 3)
        # Cada ingrediente se calcula con su propio valor: (cantidad / 2) * 5
        self.assertEqual(ingredientes["Harina"]["cantidad_ajustada"], 500.00)
        self.assertEqual(ingredientes["Harina"]["unidad_medida"], "GRAMOS")
        self.assertEqual(ingredientes["Leche"]["cantidad_ajustada"], 1250.00)
        self.assertEqual(ingredientes["Leche"]["unidad_medida"], "MILILITROS")
        self.assertEqual(ingredientes["Huevos"]["cantidad_ajustada"], 7.50)
        self.assertEqual(ingredientes["Huevos"]["unidad_medida"], "UNIDADES")

    # --- U-05: ID_RECETA inexistente (R4.3) ---------------------------

    def testAjuste_U05_IdRecetaInexistente(self):
        with patch("recetario.views.generar_receta_ajustada") as calculo:
            respuesta = self.pedirAjuste(999999, 4)
            calculo.assert_not_called()
        self.assertEqual(respuesta.status_code, 404)
        self.assertEqual(respuesta.json()["detail"], self.MENSAJE_NO_ENCONTRADA)

    # --- U-06 a U-11: validacion de CANTIDAD_PERSONAS_DESEADA (R4.1) --

    def verificarCantidadRechazada(self, valor, texto_esperado):
        """El valor debe rechazarse con error 400 (controlado), con el
        mensaje esperado, y sin ejecutar el calculo."""
        receta = self.crearReceta("RECETA RECHAZO", 4, [("Harina", "200", "GRAMOS")])
        with patch("recetario.views.generar_receta_ajustada") as calculo:
            respuesta = self.pedirAjuste(receta.id, valor)
            calculo.assert_not_called()
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn(texto_esperado, self.mensajeDeErrorCantidad(respuesta))

    def testAjuste_U06_CantidadDeseadaIgualACero(self):
        self.verificarCantidadRechazada(0, "debe ser mayor a cero")

    def testAjuste_U07_CantidadDeseadaNegativa(self):
        self.verificarCantidadRechazada(-3, "debe ser mayor a cero")

    def testAjuste_U08_CantidadDeseadaEnElLimiteSuperior(self):
        receta = self.crearReceta("RECETA U08", 4, [("Harina", "200", "GRAMOS")])
        respuesta = self.pedirAjuste(receta.id, 100)
        self.assertEqual(respuesta.status_code, 200)
        ingredientes = self.ingredientesPorNombre(respuesta)
        # (200 / 4) * 100 = 5000
        self.assertEqual(ingredientes["Harina"]["cantidad_ajustada"], 5000.00)

    def testAjuste_U09_CantidadDeseadaSobreElLimite(self):
        self.verificarCantidadRechazada(101, "no puede ser superior a 100")

    def testAjuste_U10_CantidadDeseadaDecimal(self):
        self.verificarCantidadRechazada("3.5", "debe ser un numero entero")

    def testAjuste_U11_CantidadDeseadaNoNumerica(self):
        # Debe devolver un error manejado (400), no una falla del servidor (500)
        self.verificarCantidadRechazada("cuatro", "debe ser un numero entero")

    # --- U-12: CANTIDAD_PERSONAS_DESEADA obligatoria (R4.2) -----------

    def testAjuste_U12_CantidadDeseadaFaltante(self):
        receta = self.crearReceta("RECETA U12", 4, [("Harina", "200", "GRAMOS")])
        respuesta = self.pedirAjuste(receta.id)
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("es obligatoria", self.mensajeDeErrorCantidad(respuesta))

    # --- U-13: la salida contiene todos los datos de R4.6 -------------

    def testAjuste_U13_SalidaContieneLosDatosDeR46(self):
        receta = self.crearReceta("RECETA U13", 4, [("Harina", "200", "GRAMOS")])
        respuesta = self.pedirAjuste(receta.id, 6)
        self.assertEqual(respuesta.status_code, 200)
        datos = respuesta.json()
        self.assertEqual(datos["nombre_receta"], "RECETA U13")
        self.assertEqual(datos["descripcion_corta"], receta.descripcion_corta)
        self.assertEqual(datos["categoria"], "PLATO_FONDO")
        self.assertEqual(datos["regimen_alimenticio"], "NORMAL")
        self.assertEqual(datos["cantidad_personas_deseada"], 6)
        self.assertEqual(datos["instrucciones_preparacion"], receta.instrucciones_preparacion)
        self.assertEqual(
            datos["mensaje"], "Las cantidades mostradas corresponden a 6 personas"
        )
        ingrediente = datos["ingredientes_ajustados"][0]
        self.assertEqual(
            set(ingrediente.keys()),
            {"nombre_ingrediente", "cantidad_ajustada", "unidad_medida"},
        )
