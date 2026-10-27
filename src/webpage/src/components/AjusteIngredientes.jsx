import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "../styles/theme.css";
import "../styles/AjusteIngredientes.css";

// Funcion 4: Ajuste de ingredientes segun cantidad de personas
// Consume: GET /api/get/receta/<id_receta>/ajuste/?cantidad_personas_deseada=N
// Rutas del front: /ajuste  y  /receta/:idReceta/ajuste
//
// Capa Vista (informe de planificacion): valida los datos antes de enviarlos
// para avisar de inmediato al usuario. Los mensajes son los mismos que devuelve
// el backend (R4.1 y R4.2). El backend sigue haciendo la validacion definitiva.
//
// Donde se cumple cada requisito en este archivo:
// - R4.1 y R4.2: validarCantidadPersonas (entero, > 0, <= 100, obligatoria)
// - R4.3:        obtenerMensajeError (muestra "Receta no encontrada...")
// - R4.4 a R4.6: se reciben desde el backend y se despliegan en el bloque
//                "ajuste-resultado" (Salida 1)
// - R4.7:        resultado.mensaje (mensaje de cantidad original, Salida 2)
// Los calculos (R4.4, R4.5 y R4.7) se hacen en el backend: recetario/models.py

// R4.2 (ID_RECETA es obligatorio para ejecutar el reajuste)
// Devuelve un mensaje de error, o "" si el valor es valido
const validarIdReceta = (valor) => {
    const texto = String(valor).trim();
    if (texto === "") return "ID_RECETA es obligatorio";
    if (!/^\d+$/.test(texto) || Number(texto) < 1) {
        return "ID_RECETA debe ser un numero entero mayor a cero";
    }
    return "";
};

// R4.1: CANTIDAD_PERSONAS_DESEADA es un entero positivo, mayor a cero y no superior a 100
// R4.2: CANTIDAD_PERSONAS_DESEADA es obligatoria
const validarCantidadPersonas = (valor) => {
    const texto = String(valor).trim();
    if (texto === "") return "CANTIDAD_PERSONAS_DESEADA es obligatoria";
    if (!/^-?\d+$/.test(texto)) return "CANTIDAD_PERSONAS_DESEADA debe ser un numero entero";
    const numero = Number(texto);
    if (numero <= 0) return "CANTIDAD_PERSONAS_DESEADA debe ser mayor a cero";
    if (numero > 100) return "CANTIDAD_PERSONAS_DESEADA no puede ser superior a 100";
    return "";
};

function AjusteIngredientes() {
    const { idReceta: idDeLaRuta } = useParams();

    const [idReceta, setIdReceta] = useState(idDeLaRuta ?? "");
    const [cantidadPersonas, setCantidadPersonas] = useState("");
    const [resultado, setResultado] = useState(null);
    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    // Convierte la respuesta de error de la API en un texto legible
    const obtenerMensajeError = (err) => {
        if (!err.response) {
            return "No se pudo conectar con el servidor";
        }
        const data = err.response.data;
        // 404 (R4.3): { detail: "Receta no encontrada. No es posible realizar el ajuste" }
        if (data && data.detail) return data.detail;
        // 400 (R4.1 y R4.2): { cantidad_personas_deseada: ["..."] }
        if (data && data.cantidad_personas_deseada) {
            return data.cantidad_personas_deseada.join(" ");
        }
        return "Ocurrio un error al ajustar la receta";
    };

    const ajustarReceta = (e) => {
        e.preventDefault();
        setError("");
        setResultado(null);

        // R4.1 y R4.2: validacion en la vista, si hay error no se llama a la API
        const errorValidacion = validarIdReceta(idReceta) || validarCantidadPersonas(cantidadPersonas);
        if (errorValidacion) {
            setError(errorValidacion);
            return;
        }

        setCargando(true);

        // Solicitud al backend (controlador Django): verifica la receta (R4.3),
        // recupera sus datos (R4.4), calcula las cantidades (R4.5) y arma la salida (R4.6 y R4.7)
        api
            .get(`/api/get/receta/${idReceta.trim()}/ajuste/`, {
                params: { cantidad_personas_deseada: cantidadPersonas.trim() },
            })
            .then((res) => setResultado(res.data))
            .catch((err) => setError(obtenerMensajeError(err)))
            .finally(() => setCargando(false));
    };

    return (
        <div className="ajuste-container">
            <h1>Ajuste de ingredientes</h1>

            <form className="ajuste-form" onSubmit={ajustarReceta} noValidate>
                <label htmlFor="id_receta">ID de la receta:</label>
                <input
                    type="text"
                    inputMode="numeric"
                    id="id_receta"
                    value={idReceta}
                    onChange={(e) => setIdReceta(e.target.value)}
                />

                <label htmlFor="cantidad_personas">Cantidad de personas deseada:</label>
                <input
                    type="text"
                    inputMode="numeric"
                    id="cantidad_personas"
                    value={cantidadPersonas}
                    onChange={(e) => setCantidadPersonas(e.target.value)}
                />

                <input type="submit" value={cargando ? "Calculando..." : "Ajustar"} disabled={cargando} />
            </form>

            {/* Salida 2: mensajes de error (R4.1, R4.2 y R4.3) */}
            {error && <p className="ajuste-error">{error}</p>}

            {/* Salida 1 (R4.6): NOMBRE_RECETA, DESCRIPCION_CORTA, CATEGORIA y REGIMEN_ALIMENTICIO */}
            {resultado && (
                <div className="ajuste-resultado">
                    <h2>{resultado.nombre_receta}</h2>
                    <p>{resultado.descripcion_corta}</p>
                    <p className="ajuste-etiquetas">
                        {resultado.categoria && <span>{resultado.categoria}</span>}
                        {resultado.regimen_alimenticio && <span>{resultado.regimen_alimenticio}</span>}
                    </p>

                    {/* R4.6: indica para cuantas personas son las cantidades.
                        R4.7: si es la cantidad original, muestra el mensaje correspondiente */}
                    <p className="ajuste-mensaje">{resultado.mensaje}</p>

                    {/* R4.6: NOMBRE_INGREDIENTE, CANTIDAD_AJUSTADA (calculada en R4.5) y UNIDAD_MEDIDA */}
                    <table className="ajuste-tabla">
                        <thead>
                            <tr>
                                <th>Ingrediente</th>
                                <th>Cantidad</th>
                                <th>Unidad</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultado.ingredientes_ajustados.map((ing, index) => (
                                <tr key={index}>
                                    <td>{ing.nombre_ingrediente}</td>
                                    <td>{ing.cantidad_ajustada}</td>
                                    <td>{ing.unidad_medida}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* R4.6: INSTRUCCIONES_PREPARACION */}
                    <h3>Instrucciones de preparación</h3>
                    <p className="ajuste-instrucciones">{resultado.instrucciones_preparacion}</p>
                </div>
            )}
        </div>
    );
}

export default AjusteIngredientes;
