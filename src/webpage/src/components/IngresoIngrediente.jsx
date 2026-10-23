//props de ingrediente: el ingrediente objeto, la funcion que va a cambiar y funcion para eliminarse
//definida en el componente padre
function Ingrediente({ ingrediente, onChange , eliminarIng}) {

    return (
        <>
        <br></br>
            <label >
                Nombre Ingrediente:
                <input
                    type="text"
                    id="nombre_ingrediente"
                    name="nombre_ingrediente"
                    value={ingrediente.nombre_ingrediente}
                    onChange={(e) => onChange("nombre_ingrediente", e.target.value)}
                    required />
            </label>
            <label >
                Cantidad Ingrediente:
                <input
                    type="number"
                    id="cantidad_ingrediente"
                    name="cantidad_ingrediente"
                    value={ingrediente.cantidad_ingrediente}
                    onChange={(e) => onChange("cantidad_ingrediente", e.target.value)}
                    required
                />
            </label>
            <label >
                Unidad de medida:
                <select id="unidad_medida" name="unidad_medida" 
                    value={ingrediente.unidad_medida}
                    onChange={(e) => onChange("unidad_medida", e.target.value)}
                    >
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
            <br></br>
        </>

    )
} export default Ingrediente