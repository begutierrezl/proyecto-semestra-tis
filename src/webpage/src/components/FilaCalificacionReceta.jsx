import React from "react";

function FilaCalificacionReceta({ receta, calificacion }) {
    return (
        <div className="calificacion-container" key={calificacion.id}>
            <p className="calificacion-nombre-receta">{calificacion.nombre_receta}</p>
            <p className="calificacion-promedio-valoracion">{calificacion.promedio_valoracion}</p>
            <p className="calificacion-cantidad-valoraciones">{calificacion.cantidad_valoraciones}</p>
        </div>
    );
}

export default FilaCalificacionReceta