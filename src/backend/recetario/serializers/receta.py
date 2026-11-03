from rest_framework import serializers
from ..models.receta import Receta, Ingrediente
import json
from django.http import QueryDict

class CreateIngredienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingrediente
        fields = [
          "nombre_ingrediente",
          "cantidad_ingrediente",
          "unidad_medida"
        ]

    def create(self, validated_data):
        ingrediente = Ingrediente.objects.create_user(**validated_data)
        return ingrediente
class ReadIngredienteSerializer(serializers.ModelSerializer):
    unidad_medida=serializers.CharField(source="get_unidad_medida_display", read_only=True) 
    class Meta:
        model = Ingrediente
        fields = [
          "nombre_ingrediente",
          "cantidad_ingrediente",
          "unidad_medida"
        ]


#serializador para crear las recetas
class CreateRecetaSerializer(serializers.ModelSerializer):
    #para incluir los ingredientes
    ingrediente_receta = CreateIngredienteSerializer(many=True)
    class Meta:
        model = Receta
        fields = [
            "id",
            "nombre_receta",
            "descripcion_corta",
            "cantidad_personas",
            "categoria",
            "regimen_alimenticio",
            "instrucciones_preparacion",
            "enlace_receta",
            "ingrediente_receta",
            "imagen_referencial",
        ]
        read_only_fields = ["id", "enlace_receta"] #campos que serviran para respuesta no entrada 
        
    def create(self, validated_data):
        #datos ingredientes
        ingrediente_receta_data = validated_data.pop('ingrediente_receta')
        receta= Receta.objects.create(**validated_data)
        for ingred_data in ingrediente_receta_data:
             Ingrediente.objects.create(receta=receta, **ingred_data)
        #con el objeto receta creado y su id asignado, se crea el enlace y se guarda
        #enlace_creado="https://www.libroderecetas.com/receta/"+ str(receta.id) #Para produccion
        enlace_creado="http://127.0.0.1:9000/receta/"+ str(receta.id) #Para desarrollo
        receta.enlace_receta=enlace_creado
        receta.save(update_fields=["enlace_receta"])
        return receta

    # Es necesario cambiar un poco funcion que transforma lo que llega a datos validados 
    # porque los ingredientes anidados llegan como json, hay que hacerlos diccionarios
    # que es lo que espera el serializador
    def to_internal_value(self,data):
        #como se recibe formdata, esta llega al serializer como QueryDict de Django, se revisa para asegurar
        if isinstance(data,QueryDict):
            data=data.dict() # transformacion a diccionario de python para modificar valores ingredientes
            ingredientes_json=data.get("ingrediente_receta")
            if isinstance (ingredientes_json,str):# en caso de que no se haya enviado str se salta para que tire error de que falta
                try:
                    data["ingrediente_receta"]= json.loads(ingredientes_json)
                except json.JSONDecodeError:
                    raise serializers.ValidationError({"ingrediente_receta": "Ingresar json valido"}) # en caso de que haya error con json
        return super().to_internal_value(data)# con esto se llama funcion original con datos como diccionario que es lo que espera serializador
                    


#serializador para recuperar recetas
class ReadRecetaSerializer(serializers.ModelSerializer):
    ingrediente_receta = ReadIngredienteSerializer(many=True, read_only=True)
    #muestran nombres para mostrar 
    categoria = serializers.CharField(source="get_categoria_display", read_only=True) 
    regimen_alimenticio = serializers.CharField(source="get_regimen_alimenticio_display", read_only=True)
    class Meta:
        model = Receta
        fields = [
            "id",
            "nombre_receta",
            "descripcion_corta",
            "cantidad_personas",
            "categoria",
            "regimen_alimenticio",
            "instrucciones_preparacion",
            "enlace_receta",
            "ingrediente_receta",
            "imagen_referencial",
        ]
        read_only_fields = ["id", "enlace_receta"] #campos que serviran para respuesta no entrada 
