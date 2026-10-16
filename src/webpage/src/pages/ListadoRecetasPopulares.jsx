import { useState, useEffect, useRef } from "react";
import api from "../api";

function Calificacion(id_receta, cantidad_valoraciones, promedio_valoracion ) {
    this.idReceta = id_receta;
    this.cantidadValoraciones = cantidad_valoraciones;
    this.promedioValoracion = promedio_valoracion;
}

function ListadoRecetasPopulares() {

    const recetas_id = useRef([]);
    const calificaciones = useRef([]);
    // Calificacion de una receta, por receta en 'recetas'
    const listado_recetas_populares = useRef([]);
 
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
        return suma/cantidad_valoraciones; 
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
        calificacion.promedioValoracion = (calificacion.cantidad_valoraciones >= 1) ? promedioValoracion(valoraciones) : 0;
        return calificacion;
    }

    // Implementacion de caso negativo del requisito 3.10: 
    // "..., De lo contrario, el sistema ingresara los campos ID_CALIFICACION, ID_RECETA, CANTIDAD_VALORACIONES, PROMEDIO_VALORACION; ..."
    const createCalificacion = (id_receta, cantidad_valoraciones, promedio_valoracion) => {
        api.post("api/calificacion/insert/", {id_receta, cantidad_valoraciones, promedio_valoracion})
        .then((respuesta) => {
            const message = (respuesta.status === 201) ? "Calificacion creada" : "Error al crear calificacion";
            console.log(message);
        })
        .catch((err) => alert(err))
    }

    // Implementacion de caso positivo del requisito 3.10:
    // "En caso de que R3.9 sea exitoso, el sistema actualizará los campos CANTIDAD_VALORACIONES, PROMEDIO_VALORACION, ..."
    const updateCalificacion = (id_receta, cantidad_valoraciones, promedio_valoracion) => {
        let sonDiferentes = false
        getCalificacionReceta(id_receta)
        .then((calificacion) => { if (
            !(calificacion.cantidad_valoraciones === cantidad_valoraciones)
            || !(calificacion.promedio_valoracion === promedio_valoracion)
        ) sonDiferentes = true; 
        });
        if (!sonDiferentes) { 
            console.log("Nada que actualizar, valores no son diferentes"); 
            return false; 
        } else {
            api.put(`/api/calificacion/update/from_receta/${id_receta}/`, { cantidad_valoraciones, promedio_valoracion})
            .then(response => {
                const message = (response.status === 201) ? "Calificacion actualizada" : "Califiacion no pudo ser actualizada";
                console.log(message);
            })
            .catch(err => alert(err));
            return true;    
        }
    }

    const updateCalificaciones = () => {
        // Recupera todas las recetas
        getRecetas()
        .then(data => { for (let index = 0; index < data.length; index++) {
            const receta = data[index];
            // Validacion no especificada adicional para evitar duplicacion de datos
            if (receta.id in recetas_id.current) continue;
            recetas_id.current.push(receta.id);
            // Recupera las valoraciones de una receta en particular
            getValoracionesDeReceta(receta.id)
            .then(data => {
                // Validacion exigida por el requisito 3.8.2, cantidad_valoraciones >= 1
                // donde cantidad_valoraciones = data.length en este caso
                if (!(data.length === 0))
                    calificaciones.current.push(calculateDatosCalificacion(data, receta.id));
                else 
                    console.log(`No existen valoraciones para la receta de id:${receta.id}`);
            })
            .catch(err => {
                alert(err);
            });
        }});
        console.log(calificaciones.current);
    }

    // Implementacion de requisito funcional R3.9
    // mejorar el codigo, los errores no estan siendo manejados correctamente
    const checkCalificacionExiste = (id_receta) => {
        let existe = true;
        api.get(`/api/calificacion/get/from_receta/${id_receta}/`)
        .then(data => {
            data === null ? existe = false : existe = true;
        })
        .catch(err => {
            alert(err);
            existe = false;
        });
        return existe
    }

    // Implementacion de requisito de obligatoriedad y opcionalidad de los datos R3.6
    // La validacion es necesaria dado que los datos son opcionales, por lo que es necesario
    // obtener una garantia de su validez antes de subirlos a la base de datos
    const isDatosCalificacionValidos = (calificacion) => {
        if (!(calificacion === Calificacion)) return false;
        if (
            !(calificacion.idReceta === 0) && // El ID_RECETA es un ID valido
            (calificacion.cantidadValoraciones > 0) && // CANTIDAD_VALORACIONES 
            (calificacion.promedioValoracion >= 1 && calificacion.promedioValoracion) // PROMEDIO_VALORACION
        ) return true;
        return false;
    }

    // Implementacion de requisito funcional R3.13
    const ordenarRecetasCalificadas = () => {
        return []
    };

    const getListadoRecetasPopulares = () => {
        
    };

    // Se ejectua al cargar la pagina
    useEffect(() => {
        updateCalificaciones();
    }, [])

    return (
        <div>
            <div>
                <h1>Lista de recetas populares</h1>
            </div>
        </div>
    );
}

export default ListadoRecetasPopulares;
