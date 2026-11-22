import React from "react";
import { useState } from "react";
import MostrarRecetaDetalle from "./MostrarRecetaDetalle";

function RecetaCard({ receta, no_button = false }) {
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
                hidden={no_button}
            >
                {abierto ? "Ocultar detalles" : "Ver detalles"}
            </button>

            <div id={idDetalles} className="receta-card__detalles" hidden={!abierto}>
                <MostrarRecetaDetalle receta={receta}/>
            </div>
        </article>
    );
}

export default RecetaCard