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
    const recetas = useRef([]);
 
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
        // "toPrecision" redondea a la alza lo que es compatible con la ER
        // R3.2: "y de máximo 1  decimal (se debe redondear al alza)"
        return parseFloat((suma/cantidad_valoraciones).toPrecision(2)); 
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
        api.post("api/calificacion/insert/", {receta, cantidad_valoraciones, promedio_valoracion})
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
            const message = (response.status == 201) ? `Calificacion ${receta} actualizada` : `Califiacion ${receta} no pudo ser actualizada`;
            console.log(message);
        })
        .catch(err => console.warn(err)); // re intentar operacion maximo 3 veces
        return true;   
    }

    const updateCalificaciones = () => {
        // Recupera todas las recetas
        getRecetas()
        .then(data => { for (let index = 0; index < data.length; index++) {
            const receta = data[index];
            let is_calificacion_creada = false
            // Validacion no especificada adicional para evitar duplicacion de datos
            if (receta.id in recetas_id.current) continue;
            recetas_id.current.push(receta.id);
            // Recupera las valoraciones de una receta en particular
            getValoracionesDeReceta(receta.id)
            .then(data => {
                // Validacion exigida por el requisito 3.8.2, cantidad_valoraciones >= 1
                // donde cantidad_valoraciones = data.length en este caso                
                if (!(data.length == 0)) {
                    const calificacion = calculateDatosCalificacion(data, receta.id)
                    calificaciones.current.push(calificacion);
                    recetas.current.push(receta);
                    return calificacion;
                }    
                else {
                    console.log(`No existen valoraciones para la receta de id:${receta.id}`);
                    return null;
                }
            })
            .then(new_calificacion => {
                // Recupera la calificacion de la receta de id: ID_RECETA
                // sí esta existe, la actualiza de ser necesario
                // de no existir, la ingresa en la base de datos
                if (new_calificacion === null) return;
                getCalificacionReceta(receta.id)
                .then(calificacion => {
                    // compara las calificaciones
                    console.log(new_calificacion);
                    console.log(calificacion);
                    if (!(calificacion.cantidad_valoraciones == new_calificacion.cantidadValoraciones) || !(calificacion.promedio_valoracion == new_calificacion.promedioValoracion)) {
                        // actualizar calificacion
                        console.log(`Actualizando receta. Id: ${receta.id}, esperando respuesta del servidor...`);
                        updateCalificacion(new_calificacion);
                    }
                })
                .catch(err => {
                    // crear calificacion
                    console.log(new_calificacion);
                    console.warn(err+". No existe calificacion registrada en la base de datos de la receta de id: "+receta.id_receta);
                    createCalificacion(new_calificacion)
                });
            })
            .catch(() => {
                console.log(`No existe la receta de id:${receta.id}`);
            });
        }});
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
            (calificacion.promedioValoracion >= 1 && calificacion.promedioValoracion <= 5) // PROMEDIO_VALORACION
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
