import "../styles/Calificacion.css"

function Calificacion({ calificacion }) {
    const n = calificacion.cantidad_valoraciones === null ? 0 : calificacion.cantidad_valoraciones;

    return (
        <article className="calificacion">
            <div className="calificacion__fila-principal">
                <span className="calificacion__promedio" title="Valoración promedio">
                    <span>Calificacion: </span>
                    <span className="calificacion__estrella" aria-hidden="true">★</span>
                    <span className="calificacion__sr-only">Valoración promedio: </span>
                    {Number(calificacion.promedio_valoracion).toFixed(1)}
                </span>

                <span className="calificacion__cantidad">
                    ({n} {n === 1 ? "valoración" : "valoraciones"})
                </span>
            </div>
        </article>
    );
}

export default Calificacion