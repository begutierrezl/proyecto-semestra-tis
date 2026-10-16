import { useState, useEffect } from "react";
import api from "../api";
import CalificacionReceta from "./CalificacionReceta";

const TEST_RECETA_DATA = [
    {
        id:1,
        nombre_receta:"Lorem ipsum",
        descripcion_corta:"Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam.",
        ingredientes:[{nombre_ingrediente:"Lorem ipsum", cantidad_ingrediente:1,unidad_medida:"gramos (g)"}],
        imagen_referencial:null, // Sin implementar aun
        cantidad_personas:4,
        categoria:"Postres",
        regimen_alimentacio:"Normal",
        instrucciones_preparacion:"Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis nulla molestie mattis scelerisque maximus eget fermentum odio phasellus non purus est efficitur laoreet mauris pharetra vestibulum fusce dictum risus.",
        enlace_receta:"www.libroderecetas.com/receta/1"
    },
    {
        id:2,
        nombre_receta:"Lorem ipsum",
        descripcion_corta:"Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas.",
        ingredientes:[{nombre_ingrediente:"Lorem ipsum dolor sit amet consectetur.", cantidad_ingrediente:1,unidad_medida:"gramos (g)"},{nombre_ingrediente:"Lorem ipsum", cantidad_ingrediente:1,unidad_medida:"gramos (g)"},{nombre_ingrediente:"Lorem ipsum", cantidad_ingrediente:1,unidad_medida:"gramos (g)"}],
        imagen_referencial:null, // Sin implementar aun
        cantidad_personas:6,
        categoria:"Ensaladas",
        regimen_alimentacio:"Vegetariano",
        instrucciones_preparacion:"Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis.",
        enlace_receta:"www.libroderecetas.com/receta/2"
    },
    {
        id:3,
        nombre_receta:"Lorem ipsum dolor sit amet consectetur.",
        descripcion_corta:"Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas.",
        ingredientes:[{nombre_ingrediente:"Lorem ipsum dolor sit amet consectetur.", cantidad_ingrediente:1,unidad_medida:"gramos (g)"},{nombre_ingrediente:"Lorem ipsum", cantidad_ingrediente:1,unidad_medida:"gramos (g)"},{nombre_ingrediente:"Lorem ipsum", cantidad_ingrediente:1,unidad_medida:"gramos (g)"}],
        imagen_referencial:null, // Sin implementar aun
        cantidad_personas:3,
        categoria:"Sopas",
        regimen_alimentacio:"Vegano",
        instrucciones_preparacion:"Lorem ipsum dolor sit amet consectetur adipiscing elit quisque faucibus ex sapien vitae pellentesque sem placerat in id cursus mi pretium tellus duis convallis tempus leo eu aenean sed diam urna tempor pulvinar vivamus fringilla lacus nec metus bibendum egestas iaculis massa nisl malesuada lacinia integer nunc posuere ut hendrerit semper vel class aptent taciti sociosqu ad litora torquent per conubia nostra inceptos himenaeos orci varius natoque penatibus et magnis dis parturient montes nascetur ridiculus mus donec rhoncus eros lobortis.",
        enlace_receta:"www.libroderecetas.com/receta/3"
    },
]

const TEST_CALIFICACION_DATA = [
    {
        id:1,
        id_receta:1,
        promedio_valoracion:3.2,
        cantidad_valoraciones:74,
    },
    {
        id:2,
        id_receta:2,
        promedio_valoracion:4.8,
        cantidad_valoraciones:12,
    },
    {
        id:3,
        id_receta:4,
        promedio_valoracion:4.1,
        cantidad_valoraciones:230,
    },
]

function ListadoRecetas() {

    const recetas = TEST_RECETA_DATA;

    return (
        <div>
            <div>
                <h2>Recetas</h2>
                {recetas.map((receta) => (
                    <CalificacionReceta receta={receta} calificacion={TEST_CALIFICACION_DATA[0]} key={receta.id}/>
                ))}
            </div>
        </div>
    );
}

export default ListadoRecetas;