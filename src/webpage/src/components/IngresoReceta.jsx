import { useState } from "react"
import {useForm, useFieldArray} from "react-hook-form"
import Ingrediente from "./IngresoIngrediente";
import api from "../api"


const MENSAJES = {
    obligatorio: "no es un ingreso valido, este campo es obligatorio.",
    minimo: (n) => `no es un ingreso valido, debe tener al menos ${n} caracteres (sin contar espacios).`,
    maximo: (n) => `no es un ingreso valido, no puede superar los ${n} caracteres.`,
    invalidos: (c) => `no es un ingreso valido, incluye caracteres no permitidos: ${c}`,
    numero: "no es un ingreso valido, Campo debe ser un numero",
    mayorACero: "no es un ingreso valido, debe ser mayor a cero.",
    maxDecimales: "no es un ingreso valido, máximo 2 decimales.",
    soloImagen: "no es un ingreso valido, solo se aceptan archivos JPG o PNG.",
    imagenGrande: "no es un ingreso valido, la imagen no puede superar los 5 MB.",
    rangoPersonas: "no es un ingreso valido, debe estar entre 1 y 100.",
};
function IngresoReceta() {
    //estados de valores
    const {register,handleSubmit,formState: {errors},control} = useForm()
    const { fields, append, remove } = useFieldArray({ control, name: "ingredientes", rules : {required: "Minimo un ingrediente"} });
    
    const minimoSinEspacios= (dato,min)=>{
        const sinEspacios=dato.replace(/ /g,"");
        if(sinEspacios.length<min)
        {
            return false
        }else{
            return true
        }
    }
    const nombreUnico = (value) =>
    {
        return true
    }
    const incluyeInvalidos= (value,er) =>
    {
        const exreg= new RegExp(er,"g")
        const invalidos = value.match(exreg) ?? []
        return invalidos
        
    }
    //itera por la lista de ingredientes que hay para mostrar en la pagina
    const iterableIngredientes = fields.map((ingrediente,i)=> (
        
    <Ingrediente
        key={ingrediente.id}
        i={i}
        register={register}
        errors={errors}
        eliminarIng={() => remove(i)}
        MENSAJES={MENSAJES}
    />
))
    const crearIngredienteNuevo = () => ({
        nombre_ingrediente: "", cantidad_ingrediente: "", unidad_medida: ""
    });

    const addIngrediente = () => append(crearIngredienteNuevo());


    const subir =handleSubmit (async(datos) =>{
        const url="http://localhost:8000/api/receta/insert/" //Para desarrollo
        const formData = new FormData(datos.target);//le entregamos lo que sube el evento que es la form
        formData.append("nombre_receta",datos.nombre_receta.toUpperCase())//Mayusculas R1.14
        formData.append("descripcion_corta", datos.descripcion_corta);
        formData.append("imagen_referencial", datos.imagen_referencial[0]);  // FileList -> archivo
        formData.append("cantidad_personas", datos.cantidad_personas);
        formData.append("categoria", datos.categoria);
        formData.append("regimen_alimenticio", datos.regimen_alimenticio);
        formData.append("instrucciones_preparacion", datos.instrucciones_preparacion);
        formData.append("ingrediente_receta", JSON.stringify(datos.ingredientes));//añadidos manualmente
        console.log(formData);
        try
        {
        const respuesta = await api.post(url,formData);
        }catch(error)
        {
        console.log(error.response);
        }
        console.log(formData)
    })

    return (
        <div>
            <form onSubmit={subir}>
                <div>
                    <label >
                        Nombre de la Receta:
                        <input
                            type="text"
                            id="nombre_receta"
                            name="nombre_receta"
                            {...register("nombre_receta", {
                                required: {
                                    value: true,
                                    message: `El nombre de la receta ${MENSAJES.obligatorio}`
                                },
                                validate: (value) => {
                                    if (!minimoSinEspacios(value, 3)) {
                                        return `El nombre de la receta ${MENSAJES.minimo(3)}`
                                    }
                                    if (!nombreUnico(value)) {
                                        return "Ya existe una receta con ese  nombre. Por favor, utilice un nombre diferente.";
                                    }
                                    const invalidos = incluyeInvalidos(value, "[^\\w\\sñÑáéíóúÁÉÍÓÚ]")
                                    if (invalidos.length != 0)
                                    {
                                        return `El nombre de la receta ${MENSAJES.invalidos(invalidos)}`
                                    }
                            },
                            maxLength: {
                                value: 80,
                                message: `El nombre de la receta ${MENSAJES.maximo(80)}`
                            },
                            }
                            )
                            }
                        />
                    </label>
                    {errors.nombre_receta && <span>{errors.nombre_receta.message}</span>}
                </div>
                <div>
                <label >
                    Descripcion:
                    <input
                        type="text"
                        id="descripcion_corta"
                        name="descripcion_corta"
                        {...register("descripcion_corta", {
                                required: {
                                    value: true,
                                    message: `La descripcion ${MENSAJES.obligatorio}`
                                },
                                validate: (value) => {
                                    const min=10
                                    if (!minimoSinEspacios(value, min)) {
                                        return `La descripcion ${MENSAJES.minimo(min)}`
                                    }
                                    const invalidos = incluyeInvalidos(value, "[^\\w\\sñÑáéíóúÁÉÍÓÚ.,:;°]")
                                    if (invalidos.length != 0)
                                    {
                                        return `La descripcion ${MENSAJES.invalidos(invalidos)}`
                                    }
                            },
                            maxLength: {
                                value: 300,
                                message: `La descripcion ${MENSAJES.maximo(300)}`
                            },
                            }
                        )
                    }
                        />
                </label>
                {errors.descripcion_corta && <span>{errors.descripcion_corta.message}</span>}
                </div>
                
                <div>
                <label >
                    Imagen Referencial:
                    <input
                        type="file"
                        id="imagen_referencial"
                        name="imagen_referencial"
                        {...register("imagen_referencial", {
                            required: {
                                value: true,
                                message: `La imagen ${MENSAJES.obligatorio}`
                            }
                        }
                        )
                    }
                        />
                </label>
                {errors.imagen_referencial && <span>{errors.imagen_referencial.message}</span>}
                </div>
                <div>
                <label >
                    Cantidad de Personas:
                    <input
                        type="number"
                        id="cantidad_personas"
                        name="cantidad_personas"
                        {...register("cantidad_personas", {
                            required: {
                                value: true,
                                message: `La cantidad de personas ${MENSAJES.obligatorio}`
                            },
                            max: {
                                value: 100,
                                message: `Cantidad ${MENSAJES.rangoPersonas}`
                            },
                            min: {
                                value: 0,
                                message: `Cantidad ${MENSAJES.rangoPersonas}`
                            },
                            valueAsNumber: true
                        }
                    )
                    }
                    />
                </label>
                {errors.cantidad_personas && <span>{errors.cantidad_personas.message}</span>}
                </div>
                <br></br>
                <div>
                <label >
                    Categoria:
                    <select id="categoria" name="categoria" 
                        {...register("categoria", {
                            required: {
                                value: true,
                                message: `La categoria ${MENSAJES.obligatorio}`

                            }
                        }
                        )
                    }
                        >
                        <option value="">Elegir</option>
                        <option value="POSTRES">Postres</option>
                        <option value="ENSALADAS">Ensaladas</option>
                        <option value="PLATO_FONDO">Plato de fondo</option>
                        <option value="SOPAS">Sopas</option>
                        <option value="ENTRADAS">Entradas</option>
                        <option value="BEBIDAS">Bebidas</option>
                        <option value="DESAYUNOS">Desayunos</option>
                    </select>
                </label>
                <br></br>
                {errors.categoria && <span>{errors.categoria.message}</span>}
                </div>
                <label >
                    Regimen Alimenticio:
                    <select name="regimen_alimenticio"
                    id="regimen_alimenticio"
                        {...register("regimen_alimenticio", {
                            required: {
                                value: true,
                                message: `El regimen alimenticio ${MENSAJES.obligatorio}`
                            }
                        }
                        )
                    }
                    >
                        <option value="">Elegir</option>
                        <option value="NORMAL">Normal</option>
                        <option value="DIABETICO">Diabético</option>
                        <option value="CELIACO">Celíaco</option>
                        <option value="VEGETARIANO">Vegetariano</option>
                        <option value="VEGANO">Vegano</option>
                        <option value="SIN_LACTOSA">Sin Lactosa</option>
                    </select>
                </label>
                <br></br>
                {errors.regimen_alimenticio && <span>{errors.regimen_alimenticio.message}</span>}
                <div>
                <label >
                    Instrucciones de Preparación:
                    <input
                        type="text"
                        name="instrucciones_preparacion"
                        id="instrucciones_preparacion" 
                        {...register("instrucciones_preparacion", {
                                required: {
                                    value: true,
                                    message: `Las instrucciones ${MENSAJES.obligatorio}`
                                },
                                validate: (value) => {
                                    const min=20
                                    if (!minimoSinEspacios(value, min)) {
                                        return `Las instrucciones ${MENSAJES.minimo(min)}`
                                    }
                                    const invalidos = incluyeInvalidos(value, "[^\\w\\sñÑáéíóúÁÉÍÓÚ.,:;°]")
                                    if (invalidos.length != 0)
                                    {
                                        return `Las instrucciones ${MENSAJES.invalidos(invalidos)}`
                                    }
                            },
                            maxLength: {
                                value: 5000,
                                message: `Las instrucciones ${MENSAJES.maximo(5000)}`
                            },
                            }
                        )
                    }
                        />

                </label>
                {errors.instrucciones_preparacion && <span>{errors.instrucciones_preparacion.message}</span>}
                </div>
                <div>
                    <label >
                        Ingredientes:
                    </label>
                        <button onClick={addIngrediente} type="button">+

                        </button>
                </div>
                        {errors.ingredientes?.root && <span>{errors.ingredientes.root.message}</span>}
                    <div>
                        {iterableIngredientes}
                    </div>
                <button type="submit">
                    Ingresar Receta
                </button>
            </form>
        </div>
    )
} export default IngresoReceta
