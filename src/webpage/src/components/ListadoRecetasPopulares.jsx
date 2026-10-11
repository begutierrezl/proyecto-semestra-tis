import { useState, useEffect, useRef } from "react";
import api from "../api";

function Calificacion(id_receta, cantidad_valoraciones, promedio_valoracion ) {
    this.idReceta = id_receta;
    this.cantidadValoraciones = cantidad_valoraciones;
    this.promedioValoracion = promedio_valoracion;
}

function ListadoRecetasPopulares() {

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

    const updateCalificaciones = () => {
        // queda comprobar si las calificaciones existen antes de calcular

        getRecetas().then(data => {
            // recupera valoraciones de cada receta recuperada
            for (let index = 0; index < data.length; index++) {
                const receta = data[index];
                // recupera las valoraciones de una receta X
                getValoracionesDeReceta(receta.id)
                .then(data => {
                    let cantidad_valoraciones = contarValoraciones(data);
                    let promedio_valoracion = (cantidad_valoraciones != 0) ? promedioValoracion(data) :  0;
                    const calificacion = new Calificacion(receta.id, cantidad_valoraciones, promedio_valoracion)
                    calificaciones.current.push(calificacion);
                });   
            }
        });

        // guardar las calificaciones que tienen valores nuevos
    }

    const ordenarRecetasCalificadas = () => {
        return []
    };

    const getListadoRecetasPopulares = () => {
        
    };

    // Se ejectua al cargar la pagina
    useEffect(() => {
        
        console.log(calificaciones);
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
