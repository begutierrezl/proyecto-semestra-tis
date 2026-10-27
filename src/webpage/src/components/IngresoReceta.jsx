import {useForm, useFieldArray} from "react-hook-form"
import Ingrediente from "./IngresoIngrediente";
import api from "../api"
import "../styles/IngresoReceta.css"


const MENSAJES = {
    obligatorio: "no es un ingreso valido, este campo es obligatorio.",
    minimo: (n) => `no es un ingreso valido, debe tener al menos ${n} caracteres (sin contar espacios).`,
    maximo: (n) => `no es un ingreso valido, no puede superar los ${n} caracteres.`,
    invalidos: (c) => `no es un ingreso valido, incluye caracteres no permitidos: ${c}`,
    numero: "no es un ingreso valido, Campo debe ser un numero",
    mayorACero: "no es un ingreso valido, debe ser mayor a cero.",
    maxDecimales: "no es un ingreso valido, máximo 2 decimales.",
    tipoImagen: "no es un ingreso valido, solo se aceptan archivos JPG o PNG.",
    imagenGrande: "no es un ingreso valido, la imagen no puede superar los 5 MB.",
    rangoPersonas: "no es un ingreso valido, debe estar entre 1 y 100.",
};
function IngresoReceta() {
    //estados de valores
    const {register,handleSubmit,formState: {errors},control,setValue,watch} = useForm()
    const { fields, append, remove } = useFieldArray({ control, name: "ingredientes", rules : {required: "Minimo un ingrediente"} });
    
    //Validaciones hechas usado react-hook-form y llamando las siguientes funciones cuando es necesario

    //cuenta caracteres string sin espacios
    const minimoSinEspacios= (dato,min)=>{
        const sinEspacios=dato.replace(/ /g,"");
        if(sinEspacios.length<min)
        {
            return false
        }else{
            return true
        }
    }
    //recupera todos los caracteres invalidos del valor
    const incluyeInvalidos= (value,er) =>
    {
        const exreg= new RegExp(er,"g")
        const invalidos = value.match(exreg) ?? []
        return invalidos
        
    }
    //revisa que tamaño de imagen no sea mas de 5 MB
    const sizeImagen = (imagen) =>{
        const size= imagen.size
        if(size> 5 * 1024 * 1024)
        {
            return `La imagen ${MENSAJES.imagenGrande}`
        }else
        {
            return true
        }
    }
    //revisa el tipo de imagen
    const tipoImagen = (imagen) =>
    {
        const tipo = imagen.type
        if(tipo == "image/jpeg" || tipo == "image/png"){
            return true
        }else{
            return `La imagen ${MENSAJES.tipoImagen}`
        }
    }

    //itera por la lista de ingredientes que hay y los retorna como el componente ingrediente
    const iterableIngredientes = fields.map((ingrediente,i)=> (
        
    <Ingrediente
        key={ingrediente.id}
        i={i}
        register={register}
        errors={errors}
        eliminarIng={() => remove(i)}
        MENSAJES={MENSAJES}
        minimoSinEspacios={minimoSinEspacios}
        incluyeInvalidos={incluyeInvalidos}
        setValue={setValue}
        watch={watch}
    />
))
    const crearIngredienteNuevo = () => ({
        nombre_ingrediente: "", cantidad_ingrediente: "", unidad_medida: ""
    });

    const addIngrediente = () => append(crearIngredienteNuevo());

    //funcion encargada de enviar al backend como formData
    const subir =handleSubmit (async(datos) =>{
        const url="http://localhost:8000/api/receta/insert/" //Para desarrollo
        const formData = new FormData();// se crea form para enviar como form
        formData.append("nombre_receta",datos.nombre_receta.toUpperCase())//R1.14: se envia nombre como mayusculas
        formData.append("descripcion_corta", datos.descripcion_corta);
        formData.append("imagen_referencial", datos.imagen_referencial[0]);  //file es arreglo, [0] es archivo
        formData.append("cantidad_personas", datos.cantidad_personas);
        formData.append("categoria", datos.categoria);
        formData.append("regimen_alimenticio", datos.regimen_alimenticio);
        formData.append("instrucciones_preparacion", datos.instrucciones_preparacion);
        formData.append("ingrediente_receta", JSON.stringify(datos.ingredientes));// ingredientes como json
        try
        {
        const respuesta = await api.post(url,formData);
        alert("Receta registrada existosamente") //R1.18
        }catch(error)
        {
            const mensajeError = error.response?.data;
            //forma de colocar error de django en alert
            //Uso principal para R1.15: no se repita nombre de receta
            const texto = Object.entries(mensajeError).map(([campo, msj]) => `${Array.isArray(msj) ? msj.join(" ") : msj}`).join("\n");
            alert(texto);
        }
    })

    return (
           <div>
            <form onSubmit={subir} className="receta-form">
                <div className="receta-campo">
                    <label className="receta-etiqueta">
                        Nombre de la Receta:
                        <input className="receta-control"
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
                    {errors.nombre_receta && <span className="receta-error">{errors.nombre_receta.message}</span>}
                </div>
                <div className="receta-campo">
                <label className="receta-etiqueta">
                    Descripcion:
                    <input className="receta-control"
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
                {errors.descripcion_corta && <span className="receta-error">{errors.descripcion_corta.message}</span>}
                </div>
                
                <div className="receta-campo">
                <label className="receta-etiqueta">
                    Imagen Referencial:
                    <input className="receta-control receta-archivo"
                        type="file"
                        id="imagen_referencial"
                        name="imagen_referencial"
                        {...register("imagen_referencial", {
                            required: {
                                value: true,
                                message: `La imagen ${MENSAJES.obligatorio}`
                            },
                            validate:{
                                tipo: (imagen) => tipoImagen(imagen[0]),
                                size: (imagen) => sizeImagen(imagen[0])
 
                            }
                        }
                        )
                    }
                        />
                </label>
                {errors.imagen_referencial && <span className="receta-error">{errors.imagen_referencial.message}</span>}
                </div>
                <div className="receta-campo">
                <label className="receta-etiqueta">
                    Cantidad de Personas:
                    <input className="receta-control"
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
                                message: `La cantidad de personas ${MENSAJES.rangoPersonas}`
                            },
                            min: {
                                value: 0,
                                message: `La cantidad de personas ${MENSAJES.rangoPersonas}`
                            },
                            valueAsNumber: true //no deja continuar si no es numero
                        }
                    )
                    }
                    />
                </label>
                {errors.cantidad_personas && <span className="receta-error">{errors.cantidad_personas.message}</span>}
                </div>
                <div className="receta-campo">
                <label className="receta-etiqueta">
                    Categoria:
                    <select className="receta-control" id="categoria" name="categoria" 
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
                {errors.categoria && <span className="receta-error">{errors.categoria.message}</span>}
                </div>
                <label className="receta-campo receta-etiqueta">
                    Regimen Alimenticio:
                    <select className="receta-control" name="regimen_alimenticio"
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
                {errors.regimen_alimenticio && <span className="receta-error">{errors.regimen_alimenticio.message}</span>}
                <div className="receta-campo">
                <label className="receta-etiqueta">
                    Instrucciones de Preparación:
                    <input className="receta-control"
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
                {errors.instrucciones_preparacion && <span className="receta-error">{errors.instrucciones_preparacion.message}</span>}
                </div>
                <div className="receta-ingredientes-encabezado">
                    <label className="receta-subtitulo">
                        Ingredientes:
                    </label>
                        <button onClick={addIngrediente} type="button" className="receta-boton-agregar">+
 
                        </button>
                </div>
                        {errors.ingredientes?.root && <span className="receta-error">{errors.ingredientes.root.message}</span>}
                    <div className="receta-lista-ingredientes">
                        {iterableIngredientes}
                    </div>
                <button type="submit" className="receta-boton-enviar">
                    Ingresar Receta
                </button>
            </form>
        </div>
    )
} export default IngresoReceta
 

