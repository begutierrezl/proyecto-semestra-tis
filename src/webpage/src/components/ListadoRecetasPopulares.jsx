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
 
    // captura la promesa de informacion y obtiene la cantidad de valoraciones
    const contarValoraciones = (valoraciones) => {
        return valoraciones.length;
    }

    // captura la promesa de informacion y obtiene el promedio de valoraciones
    const promedioValoracion = (valoraciones, cantidad_valoraciones) => {
        let suma = 0;
        for (let index = 0; index < valoraciones.length; index++) {
            const valoracion = valoraciones[index];
            suma += valoracion.valoracion;
        }
        return suma/cantidad_valoraciones; 
    } 

    const getRecetas = () => {
        // crea un promise para el axios request get
        const promise = api.get("/api/receta/");
        // usando .then, crea un nuevo promise que extrae los datos
        const dataPromise = promise.then((response) => response.data);
        // retorna los datos
        return dataPromise;
    }

    const getValoracionesDeReceta = (id_receta) => {
        const promise = api.get(`/api/valoracion/${id_receta}/`)
        const dataPromise = promise.then((response) => response.data);
        return dataPromise;
    };

    const getCalificacionReceta = (id_receta) => {
        const promise = api.get(`/api/calificacion/get/from_receta/${id_receta}/`);
        const dataPromise = promise.then(response => response.data);
        return dataPromise
    }

    const calculateDatosCalificacion = (valoraciones, id_receta) => {
        const calificacion = new Calificacion(0, 0, 0);
        calificacion.idReceta = id_receta;
        calificacion.cantidadValoraciones = contarValoraciones(valoraciones);
        calificacion.promedioValoracion = (calificacion.cantidad_valoraciones >= 1) ? promedioValoracion(valoraciones) : 0;
        return calificacion;
    }

    const createCalificacion = (id_receta, cantidad_valoraciones, promedio_valoracion) => {
        api.post("api/calificacion/insert/", {id_receta, cantidad_valoraciones, promedio_valoracion})
        .then((respuesta) => {
            const message = (respuesta.status === 201) ? "Calificacion creada" : "Error al crear calificacion";
            console.log(message);
        })
        .catch((err) => alert(err))
    }

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
        // recupera valoraciones de cada receta recuperada
        getRecetas()
        .then(data => { for (let index = 0; index < data.length; index++) {
            const receta = data[index];
            if (receta.id in recetas_id.current) continue;
            recetas_id.current.push(receta.id);
            getValoracionesDeReceta(receta.id)
            .then(data => {
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

    const isDatosCalificacionValidos = (calificacion) => {
        if (!(calificacion === Calificacion)) return false;
        if (
            !(calificacion.idReceta === 0) && // El ID_RECETA es un ID valido
            (calificacion.cantidadValoraciones > 0) && // CANTIDAD_VALORACIONES 
            (calificacion.promedioValoracion >= 1 && calificacion.promedioValoracion) // PROMEDIO_VALORACION
        ) return true;
        return false;
    }

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
