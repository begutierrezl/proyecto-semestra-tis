import "../styles/theme.css";
import "../styles/MostrarRecetaCompleta.css";

function MostrarRecetaCompleta( recetaDatos ) {
    if (!recetaDatos) return <p>No se ha ingreso los datos de una receta</p>;
    return ( 
    <article className="mostrar-receta">
            <h1 className="mostrar-receta__nombre">{recetaDatos.nombreReceta}</h1>
            <p className="mostrar-receta__descripcion">{recetaDatos.descripcionCorta}</p>

            {recetaDatos.imagenReferencial && (
                <img
                    className="mostrar-receta__imagen"
                    src={recetaDatos.imagenReferencial}
                    alt={`Imagen referencial de ${recetaDatos.nombreReceta}`}
                />
            )}

            <dl className="mostrar-receta__datos">
                <dt>Para</dt>
                <dd>{recetaDatos.cantidadPersonas} personas</dd>
                <dt>Categoría</dt>
                <dd>{recetaDatos.categoria}</dd>
                <dt>Régimen alimenticio</dt>
                <dd>{recetaDatos.regimenAlimenticio}</dd>
            </dl>

            <h2 className="mostrar-receta__subtitulo">Ingredientes</h2>
            <ul className="mostrar-receta__ingredientes">
                {(recetaDatos.ingredientes ).map((ing, i) => (
                    <li key={i}>
                        {ing.nombre_ingrediente}:{" "}
                        {ing.unidad_medida === "AL_GUSTO"
                            ? "al gusto"
                            : `${Number(ing.cantidad_ingrediente)} ${ing.unidad_medida}`}
                    </li>
                ))}
            </ul>

            <h2 className="mostrar-receta__subtitulo">Instrucciones de preparación</h2>
            <p className="mostrar-receta__instrucciones">{recetaDatos.instruccionesPreparacion}</p>
        </article>
    );
}

export default MostrarRecetaCompleta;