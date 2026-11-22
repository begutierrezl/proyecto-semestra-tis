import { useState, useEffect } from "react";
import api from "../api";
import LoadingIndicator from "./LoadingIndicator"
import RecetaCard from "./RecetaCalificacion";
import "../styles/theme.css";
import '../styles/ListadoRecetasPopulares.css';

class Receta {
    constructor() {
        this.idReceta;
        this.nombreReceta;
        this.descripcionCorta;
        this.ingredientes;
        this.imagenReferencial;
        this.cantidadPersonas;
        this.categoria;
        this.regimenAlimenticio;
        this.instruccionesPreparacion;
        this.enlaceReceta;
    }
    loadFromRecetaJSON( receta ) {
        this.idReceta = receta.id;
        this.nombreReceta = receta.nombre_receta;
        this.descripcionCorta = receta.descripcion_corta;
        this.ingredientes = receta.ingrediente_receta;
        this.imagenReferencial = receta.imagen_referencial;
        this.cantidadPersonas = receta.cantidad_personas;
        this.categoria = receta.categoria;
        this.regimenAlimenticio = receta.regimen_alimenticio;
        this.instruccionesPreparacion = receta.instrucciones_preparacion;
        this.enlaceReceta = receta.enlace_receta;
    }
}

class Calificacion {
    constructor(id_receta, cantidad_valoraciones, promedio_valoracion ) {
        this.idReceta = id_receta;
        this.cantidadValoraciones = cantidad_valoraciones;
        this.promedioValoracion = promedio_valoracion;
    }
}

class CalificacionReceta {
    constructor(receta, calificacion) {
        this.idReceta = receta.idReceta;
        this.nombreReceta = receta.nombreReceta;
        this.descripcionCorta = receta.descripcionCorta;
        this.ingredientes = receta.ingredientes;
        this.imagenReferencial = receta.imagenReferencial;
        this.cantidadPersonas = receta.cantidadPersonas;
        this.categoria = receta.categoria;
        this.regimen_alimenticio = receta.regimen_alimenticio;
        this.instruccionesPreparacion = receta.instruccionesPreparacion;
        this.enlaceReceta = receta.enlaceReceta;
        this.cantidadValoraciones = calificacion.cantidadValoraciones;
        this.promedioValoracion = calificacion.promedioValoracion;
    }
}

function ListadoRecetasPopulares() {

    const [recetasPopulares, setRecetasPopulares] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
 
    // Implementacion de requisito 3.8.1
    const contarValoraciones = (valoraciones) => {
        return valoraciones.length;
    }

    // Implementacion de requisito 3.8.2: Aplicacion de formula 
    // SUMA(VALORACION)/CANTIDAD_VALORACIONES = PROMEDIO_VALORACION
    const promedioValoracion = (valoraciones, cantidad_valoraciones) => {
        let suma = 0;
        for (let index = 0; index < valoraciones.length; index++) {
            const valoracion = valoraciones[index];
            suma += valoracion.valoracion;
        }
        // perdida de precision es despreciable dado que la funcion
        // redondea a la alza lo que es compatible con la ER
        // R3.2: "y de máximo 1  decimal (se debe redondear al alza)"
        return parseFloat(Math.ceil((suma * 10) / cantidad_valoraciones) / 10); 
    } 

    // Implementacion de requisito funcional: R3.7
    const getRecetas = () => {
        // crea un promise para el axios request get
        const promise = api.get("/api/receta/");
        // usando .then, crea un nuevo promise que extrae los datos
        const dataPromise = promise.then((response) => response.data);
        // retorna los datos
        return dataPromise;
    }

    // Implementacion parcial de requisito funcional R3.8
    const getValoracionesDeReceta = (id_receta) => {
        const promise = api.get(`/api/valoracion/${id_receta}/`)
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    };

    // Implementacion del requisito funcional 3.9
    const getCalificacionReceta = (id_receta) => {
        const promise = api.get(`/api/calificacion/get/from_receta/${id_receta}/`);
        const dataPromise = promise.then(response => response.data);
        return dataPromise
    }

    // Implementacion abstracta de requisto 3.8
    // Realiza las operaciones descritas en los requisitos R3.8.1, R3.8.2 sobre las
    // valoraciones de una receta (id_receta) en particular
    const calculateDatosCalificacion = (valoraciones, id_receta) => {
        const calificacion = new Calificacion(0, 0, 0);
        calificacion.idReceta = id_receta;
        calificacion.cantidadValoraciones = contarValoraciones(valoraciones);
        calificacion.promedioValoracion = (calificacion.cantidadValoraciones >= 1) 
            ? promedioValoracion(valoraciones, calificacion.cantidadValoraciones) 
            : 0;
        return calificacion;
    }

    // Implementacion de caso negativo del requisito 3.10: 
    // "..., De lo contrario, el sistema ingresara los campos ID_CALIFICACION, ID_RECETA, CANTIDAD_VALORACIONES, PROMEDIO_VALORACION; ..."
    const createCalificacion = (calificacion) => {
        const receta = calificacion.idReceta;
        const cantidad_valoraciones = calificacion.cantidadValoraciones;
        const promedio_valoracion = calificacion.promedioValoracion;
        api.post("/api/calificacion/insert/", {receta, cantidad_valoraciones, promedio_valoracion})
        .then((respuesta) => {
            const message = (respuesta.status == 201) ? "Calificacion creada" : "Error al crear calificacion";
            console.log(message);
        })
        .catch((err) => console.warn(err)) // re intentar operacion maximo 3 veces
    }

    // Implementacion de caso positivo del requisito 3.10:
    // "En caso de que R3.9 sea exitoso, el sistema actualizará los campos CANTIDAD_VALORACIONES, PROMEDIO_VALORACION, ..."
    const updateCalificacion = (calificacion) => {
        const receta = calificacion.idReceta;
        const cantidad_valoraciones = calificacion.cantidadValoraciones;
        const promedio_valoracion = calificacion.promedioValoracion;
        api.put(`/api/calificacion/update/from_receta/${receta}/`, { cantidad_valoraciones, promedio_valoracion})
        .then(response => {
            const message = (response.status == 200) ? `Calificacion ${receta} actualizada` : `Califiacion ${receta} no pudo ser actualizada`;
            console.log(message);
        })
        .catch(err => console.warn(err)); // re intentar operacion maximo 3 veces
        return true;   
    }

    const updateCalificaciones = async () => {
        const dataRecetas = await getRecetas(); // Recupera todas las recetas
        const resultado = [];
        
        // para optimizar las consultas al servidor, en vez de realizar cada consulta getValoraciones() por Receta
        // Al utilizar promise.all forzamos que todas las consultas se disparen al mismo tiempo y 
        // forzamos al mismo tiempo que el flujo de datos espere a la respuesta del servidor (usando await)
        await Promise.all(dataRecetas.map(async (json) => {
            const receta = new Receta();
            receta.loadFromRecetaJSON(json);
            
            // Recupera las valoraciones de una receta en particular
            const valoraciones = await getValoracionesDeReceta(receta.idReceta);
            // Validacion exigida por el requisito 3.8.2, cantidad_valoraciones >= 1
            // donde cantidad_valoraciones = data.length en este caso   
            if (valoraciones.length === 0) return;
            
            const calificacion = calculateDatosCalificacion(valoraciones, receta.idReceta);
            resultado.push(new CalificacionReceta(receta, calificacion));
            
            // sincronizar con el backend (sin bloquear el listado)
            try {
                // Implementacion de requisito funcional R3.9
                // Recupera la calificacion de la receta de id: ID_RECETA
                const existente = await getCalificacionReceta(receta.idReceta);
                if (existente.cantidad_valoraciones != calificacion.cantidadValoraciones ||
                    parseFloat(existente.promedio_valoracion) !== calificacion.promedioValoracion) {
                        // sí esta existe, la actualiza de ser necesario
                        updateCalificacion(calificacion);
                    }
            } catch (err) {
                // de no existir, la ingresa en la base de datos
                if (err.response?.status === 404) createCalificacion(calificacion);
                // cualquier otro error (conexion o bad request) se advierte
                else console.warn(err);
            }
            }));
            return resultado;
        }

    // Implementacion de requisito funcional R3.13
    const ordenarRecetasCalificadas = (lista) => {
        return lista
            // No es necesario comprobar nuevamente la cantidad de valoraciones la funcion updateCalificaciones 
            // realiza una comprobacion de las valoraciones recuperadas por lo que la operacion es implicita
            .toSorted((a, b) => 
                b.promedioValoracion - a.promedioValoracion || // orden por promedio valoracion
                a.nombreReceta.localeCompare(b.nombreReceta, "es") // caso empate: ordena por nombre
            )
            // obtiene las 10 recetas mejor rankeadas
            .slice(0, 10)
    };

    // Actua como la funcion getListadoRecetasPopulares
    // por exigencias de React, esta funcion debe ser implementada de forma implicita
    useEffect(() => {
        const cargar = async () => {
            try {
                const lista = await updateCalificaciones();
                setRecetasPopulares(ordenarRecetasCalificadas(lista));
            } catch (err) {
                const status = err.response?.status;                
                setError(status === 401 || status === 403 ? "auth" : "red");
                console.warn(err)
            } finally {
                setCargando(false);
            }
        };
        cargar();
    }, [])
    
        if (cargando) {
        return (
            <div className="recetas-populares">
                <p className="recetas-populares__mensaje">Cargando recetas populares...</p>
                <LoadingIndicator />
            </div>
        );
    }

    if (error === "auth") {
        return <p className="recetas-populares__mensaje recetas-populares__mensaje--error">Debe iniciar sesión para ver las recetas populares.</p>;
    }
    if (error === "red") {
        return <p className="recetas-populares__mensaje recetas-populares__mensaje--error">No se pudo cargar el listado. Intente nuevamente.</p>;
    }

    // R3.14
    if (recetasPopulares.length === 0) {
        return (
            <div className="recetas-populares">
                <h1 className="recetas-populares__titulo">Lista de recetas populares</h1>
                <p className="recetas-populares__mensaje">
                    Aún no hay recetas valoradas. Sea el primero en calificar una receta
                </p>
            </div>
        );
    }

    // R3.13
    return (
        <div className="recetas-populares">
            <h1 className="recetas-populares__titulo">Lista de recetas populares</h1>
            <div className="recetas-populares__lista">
                {recetasPopulares.map((receta) => (
                    <RecetaCard key={receta.idReceta} receta={receta} />
                ))}
            </div>
        </div>
    );
}

export default ListadoRecetasPopulares;
