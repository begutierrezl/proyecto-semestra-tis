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
        const string = String(valor)
        const regex= /^\d+(\.\d{0,2})?$/
        if(regex.test(string))
        {
            return true
        }else{
            return `Cantidad Ingrediente ${MENSAJES.maxDecimales}`
        }
    }
    return (
        <div>
        <br></br>
            <div>
            <label >
                Nombre Ingrediente:
                <input
                    type="text"
                    id="nombre_ingrediente"
                    {...register(`${nombre}.nombre_ingrediente`,
                        {
                            required : {
                                value : true,
                                message: `El nombre del ingrediente ${MENSAJES.obligatorio}`
                            },
                              validate: (value) => {
                                    if (!minimoSinEspacios(value, 3)) {
                                        return `El nombre del ingrediente ${MENSAJES.minimo(3)}`
                                    }
                                    const invalidos = incluyeInvalidos(value, "[^\\w\\sñÑáéíóúÁÉÍÓÚ]")
                                    if (invalidos.length != 0)
                                    {
                                        return `El nombre del ingrediente ${MENSAJES.invalidos(invalidos)}`
                                    }
                            },
                            maxLength: {
                                value: 80,
                                message: `El nombre de la receta ${MENSAJES.maximo(80)}`
                            }
                        }
                    )}
                    />
            </label>
                {err?.nombre_ingrediente && <span>{err.nombre_ingrediente.message}</span>}
            </div>
            <div>
            <label >
                Cantidad Ingrediente:
                <input
                    type="number"
                    step="any"
                    id="cantidad_ingrediente"
                    readOnly={unidad==="AL_GUSTO"}
                    {...register(`${nombre}.cantidad_ingrediente`,
                        {
                            required: `La cantidad del ingrediente ${MENSAJES.obligatorio}`,
                            validate: (valor)=> compruebaDecimales(valor)
                        }
                    )}
                />
            </label>
                {err?.cantidad_ingrediente && <span>{err.cantidad_ingrediente.message}</span>}
            </div>
            <div>
            <label >
                Unidad de medida:
                <select id="unidad_medida" 
                {...register(`${nombre}.unidad_medida`,
                    {
                        required: `La unidad de medida ${MENSAJES.obligatorio}`,

                        onChange: (e) => {
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
                <button type="button" onClick={eliminarIng}>Eliminar Ingrediente</button>
            </label>
            </div>
                {err?.unidad_medida && <span>{err.unidad_medida.message}</span>}
            <br></br>
        </div>

    )
} export default Ingrediente