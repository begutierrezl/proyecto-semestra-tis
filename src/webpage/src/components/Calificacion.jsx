import "../styles/Calificacion.css"

function Calificacion({ calificacion }) {

    const n = calificacion?.cantidad_valoraciones ?? 0;
    const promedio = calificacion?.promedio_valoracion ?? 0;
    return (
        <article className="calificacion">
            <div className="calificacion__fila-principal">
                <span className="calificacion__promedio" title="Valoración promedio">
                    <span>Calificacion: </span>
                    <span className="calificacion__estrella" aria-hidden="true">★</span>
                    <span className="calificacion__sr-only">Valoración promedio: </span>
                    {Number(promedio).toFixed(1)}
                </span>

                <span className="calificacion__cantidad">
                    ({n} {n === 1 ? "valoración" : "valoraciones"})
                </span>
            </div>
        </article>
    );
}

export default Calificacion