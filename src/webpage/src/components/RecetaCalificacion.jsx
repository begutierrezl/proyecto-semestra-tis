import React from "react";
import { useState } from "react";

function RecetaCard({ receta }) {
    const [abierto, setAbierto] = useState(false);
    const idDetalles = `detalles-receta-${receta.idReceta}`;
    const n = receta.cantidadValoraciones;

    return (
        <article className="receta-card">

            {/* Fila 1: nombre (hipervínculo), promedio y cantidad de valoraciones */}
            <div className="receta-card__fila-principal">
                <h2 className="receta-card__nombre">
                    {receta.enlaceReceta ? (
                        <a
                            className="receta-card__enlace"
                            href={receta.enlaceReceta}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {receta.nombreReceta}
                        </a>
                    ) : (
                        receta.nombreReceta
                    )}
                </h2>

                <span className="receta-card__promedio" title="Valoración promedio">
                    <span className="receta-card__estrella" aria-hidden="true">★</span>
                    <span className="receta-card__sr-only">Valoración promedio: </span>
                    {Number(receta.promedioValoracion).toFixed(1)}
                </span>

                <span className="receta-card__cantidad">
                    ({n} {n === 1 ? "valoración" : "valoraciones"})
                </span>
            </div>

            {/* Fila 2: descripción corta */}
            <p className="receta-card__descripcion">{receta.descripcionCorta}</p>

            {/* Fila 3: botón que despliega el resto de los campos (R3.13) */}
            <button
                type="button"
                className="receta-card__boton"
                aria-expanded={abierto}
                aria-controls={idDetalles}
                onClick={() => setAbierto((prev) => !prev)}
            >
                {abierto ? "Ocultar detalles" : "Ver detalles"}
            </button>

            <div id={idDetalles} className="receta-card__detalles" hidden={!abierto}>
                {receta.imagenReferencial && (
                    <img
                        className="receta-card__imagen"
                        src={receta.imagenReferencial}
                        alt={`Imagen referencial de ${receta.nombreReceta}`}
                    />
                )}

                <dl className="receta-card__datos">
                    <dt>Para</dt>
                    <dd>{receta.cantidadPersonas} personas</dd>
                    <dt>Categoría</dt>
                    <dd>{receta.categoria}</dd>
                    <dt>Régimen alimenticio</dt>
                    <dd>{receta.regimen_alimenticio}</dd>
                </dl>

                <h3 className="receta-card__subtitulo">Ingredientes</h3>
                <ul className="receta-card__ingredientes">
                    {(receta.ingredientes ?? []).map((ing, i) => (
                        <li key={i}>
                            {ing.nombre_ingrediente}: {ing.cantidad_ingrediente} {ing.unidad_medida}
                        </li>
                    ))}
                </ul>

                <h3 className="receta-card__subtitulo">Instrucciones de preparación</h3>
                <p className="receta-card__instrucciones">{receta.instruccionesPreparacion}</p>
            </div>
        </article>
    );
}

export default RecetaCard