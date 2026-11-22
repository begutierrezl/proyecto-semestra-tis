import "../styles/theme.css";
import "../styles/MostrarRecetaDetalle.css";

function MostrarRecetaDetalle({ receta }) {
    return ( 
        <article className="detalle-receta">
            <div className="detalle-grid">
                <div>
                    {receta.imagenReferencial && (
                    <img
                        className="detalle-receta__imagen"
                        src={receta.imagenReferencial}
                        alt={`Imagen referencial de ${receta.nombreReceta}`}
                    />)}
                </div>
                <div>
                    <dl className="detalle-receta__datos">
                        <dt>Para</dt>
                        <dd>{receta.cantidadPersonas} personas</dd>
                        <dt>Categoría</dt>
                        <dd>{receta.categoria}</dd>
                        <dt>Régimen alimenticio</dt>
                        <dd>{receta.regimenAlimenticio}</dd>
                    </dl>
                </div>
            </div>
            
            <h2 className="detalle-receta__subtitulo">Ingredientes</h2>
            <ul className="detalle-receta__ingredientes">
                {(receta.ingredientes ?? []).map((ing, i) => (
                    <li key={i}>
                        {ing.nombre_ingrediente}:{" "}
                        {ing.unidad_medida === "AL_GUSTO"
                            ? "al gusto"
                            : `${Number(ing.cantidad_ingrediente)} ${ing.unidad_medida}`}
                    </li>
                ))}
            </ul>

            <h2 className="detalle-receta__subtitulo">Instrucciones de preparación</h2>
            <p className="detalle-receta__instrucciones">{receta.instruccionesPreparacion}</p>
        </article>
    );
}

export default MostrarRecetaDetalle;