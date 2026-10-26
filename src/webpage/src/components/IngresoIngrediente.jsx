//props de ingrediente: indice,register y errors de react hook form y forma de eliminar ing
//definida en el componente padre
function Ingrediente({ i,register, errors , eliminarIng, MENSAJES}) {
    const nombre=`ingredientes.${i}` //para referirse a ingrediente i
    const err=errors?.ingredientes?.[i] // para dar error de ingrediente i

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
                    id="cantidad_ingrediente"
                    {...register(`${nombre}.cantidad_ingrediente`,
                        {
                            required: `La cantidad del ingrediente ${MENSAJES.obligatorio}`
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
                        required: `La unidad de medida ${MENSAJES.obligatorio}`
                    }
                )}
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