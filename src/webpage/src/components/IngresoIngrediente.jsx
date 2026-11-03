import "../styles/theme.css";
import "../styles/IngresoIngrediente.css"
//props de ingrediente: 
//indice
//register y errors de react hook form,
//forma de eliminar ing
//funciones minimoSinEspacios e incluyeInvalidos para validacion
//setValue para valor por defecto
function Ingrediente({ i,register, errors ,setValue, eliminarIng, MENSAJES,minimoSinEspacios,incluyeInvalidos,watch}) {
    const nombre=`ingredientes.${i}` //para referirse a ingrediente i

    const err=errors?.ingredientes?.[i] // para dar error de ingrediente i

    const unidad=watch(`${nombre}.unidad_medida`)// para cuando sea al gusto no cambie valor cantidad
    const compruebaDecimales= (valor) =>
    {
        //se transforma a string y se comprueba con expresion regular
        const string = String(valor)
        const regex= /^\d+((\.|,)\d{0,2})?$/
        if(regex.test(string))
        {
            return true
        }else{
            return `Cantidad Ingrediente ${MENSAJES.maxDecimales}`
        }
    }
    return (
          <div className="ingrediente">
            <div className="ingrediente-campo">
            <label className="ingrediente-etiqueta">
                Nombre Ingrediente:
                <input className="ingrediente-control"
                    type="text"
                    id="nombre_ingrediente"
                    {...register(`${nombre}.nombre_ingrediente`,
                        {
			    //validaciones y mensajes de error R1.14 nombre_ingrediente R1.4
                            required : {
				//valida que sea obligatoria
                                value : true,
                                message: `El nombre del ingrediente ${MENSAJES.obligatorio}`
                            },
                              validate: (value) => {
				  //valida cantidad minima sin contar espacios
                                    if (!minimoSinEspacios(value, 3)) {
                                        return `El nombre del ingrediente ${MENSAJES.minimo(3)}`
                                    }
				    //Expresion regular= todos los caracteres que no son letras,
				    //espacios, 
				    //ni vocales con tildes
                                    const invalidos = incluyeInvalidos(value, "[^\\w\\sñÑáéíóúÁÉÍÓÚ]")
                                    if (invalidos.length != 0)
                                    {
                                        return `El nombre del ingrediente ${MENSAJES.invalidos(invalidos)}`
                                    }
                            },
                            maxLength: {
				//valida max caracteres
                                value: 80,
                                message: `El nombre de la receta ${MENSAJES.maximo(80)}`
                            }
                        }
                    )}
                    />
            </label>
                {err?.nombre_ingrediente && <span className="ingrediente-error">{err.nombre_ingrediente.message}</span>}
            </div>
            <div className="ingrediente-campo">
            <label className="ingrediente-etiqueta">
                Cantidad Ingrediente:
                <input className="ingrediente-control"
                    type="number"
                    step="any"
                    id="cantidad_ingrediente"
                    readOnly={unidad==="AL_GUSTO"}
                    {...register(`${nombre}.cantidad_ingrediente`,
			//validaciones y mensajes de error R1.14 cantidad_ingrediente R1.5
                        {
			    //obligatorio
                            required: `La cantidad del ingrediente ${MENSAJES.obligatorio}`,
			    //valida que max 2 decimales
                            validate: (valor)=> compruebaDecimales(valor),
                            max:{
				//valida max 1000
                                value: 1000,
                                message: `La cantidad del ingrediente ${MENSAJES.rangoCantidad}`
                            },
                            min:{
				//valida minimo 0.01
                                value:0.01,
                                message: `La cantidad del ingrediente ${MENSAJES.rangoCantidad}`
                            }
                        }
                    )}
                />
            </label>
                {err?.cantidad_ingrediente && <span className="ingrediente-error">{err.cantidad_ingrediente.message}</span>}
            </div>
            <div className="ingrediente-campo">
            <label className="ingrediente-etiqueta">
                Unidad de medida:
                <select className="ingrediente-control" id="unidad_medida" 
                {...register(`${nombre}.unidad_medida`,
		    //validaciones y mensajes de error R1.14 unidad_medida R1.6
                    {
			//obligatorio
                        required: `La unidad de medida ${MENSAJES.obligatorio}`,
 
                        onChange: (e) => {
			    //En caso de que sea al gusto, sete cantidad en 1 R1.14
                            if (e.target.value === "AL_GUSTO") {
                                setValue(`${nombre}.cantidad_ingrediente`, 1, { shouldValidate: true })
                            }
                        }
                    }
 
                        )
                    }
                    >
                    <option value="">Elegir</option>
                    <option value="GRAMOS">gramos (g)</option>
                    <option value="KILOGRAMOS">kilogramos (kg)</option>
                    <option value="MILILITROS">mililitros(ml)</option>
                    <option value="LITROS">litros(l)</option>
                    <option value="TAZAS">tazas</option>
                    <option value="CUCHARADAS">cucharadas</option>
                    <option value="CUCHARADITAS">cucharaditas</option>
                    <option value="UNIDADES">unidades</option>
                    <option value="AL_GUSTO">al gusto</option>
                </select>
                <button type="button" className="ingrediente-eliminar" onClick={eliminarIng}>Eliminar Ingrediente</button>
            </label>
            </div>
                {err?.unidad_medida && <span className="ingrediente-error">{err.unidad_medida.message}</span>}
        </div>
 
    )
} export default Ingrediente
