import React from "react";

function CalificacionReceta({ receta, calificacion }) {
    return (
        <div className="calificacion-container">
            <p className="receta-nombre-receta">{receta.nombre_receta}</p>
            <p className="receta-descripcion-corta">{receta.descripcion_corta}</p>
            <p className="calificacion-promedio-valoracion">{calificacion.promedio_valoracion}</p>
            <p className="calificacion-cantidad-valoraciones">{calificacion.cantidad_valoraciones}</p>
            <button className="link-receta" onClick={() => linkReceta(receta.id)}>
                {receta.nombre_receta}
            </button>
        </div>
    );
}

export default CalificacionReceta