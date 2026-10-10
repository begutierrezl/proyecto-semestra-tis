from django.test import TestCase
from .models import CalificacionReceta, Receta

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
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=3.55,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 3.5)

    def testValidarPromedioValoracion_UT_R32_09(self):
        calificacion = CalificacionReceta(
            receta=self.receta,
            promedio_valoracion=0.95,
            cantidad_valoraciones=0,
        )
        self.assertEqual(calificacion.promedio_valoracion, 1.0)

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

