import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import "../styles/Receta.css";
function Receta() {
    const {idReceta}= useParams()
    const [recetaDatos, setRecetaDatos]= useState(null);
    useEffect(()=>
    {
        const fetchReceta = async ()=>{
            const url = `http://localhost:8000/api/receta/${idReceta}`
            try{
            const receta = await api.get(url);
            setRecetaDatos(receta.data)
            }catch(error)
            {
                alert(error.response)
            }
        console.log(recetaDatos)
        }
        fetchReceta();
    },[idReceta])
    if (!recetaDatos) return <p>Cargando...</p>;
    return ( 
    <article className="detalle-receta">
            <h1 className="detalle-receta__nombre">{recetaDatos.nombre_receta}</h1>
            <p className="detalle-receta__descripcion">{recetaDatos.descripcion_corta}</p>

            {recetaDatos.imagen_referencial && (
                <img
                    className="detalle-receta__imagen"
                    src={recetaDatos.imagen_referencial}
                    alt={`Imagen referencial de ${recetaDatos.nombre_receta}`}
                />
            )}

            <dl className="detalle-receta__datos">
                <dt>Para</dt>
                <dd>{recetaDatos.cantidad_personas} personas</dd>
                <dt>Categoría</dt>
                <dd>{recetaDatos.categoria}</dd>
                <dt>Régimen alimenticio</dt>
                <dd>{recetaDatos.regimen_alimenticio}</dd>
            </dl>

            <h2 className="detalle-receta__subtitulo">Ingredientes</h2>
            <ul className="detalle-receta__ingredientes">
                {(recetaDatos.ingrediente_receta ).map((ing, i) => (
                    <li key={i}>
                        {ing.nombre_ingrediente}:{" "}
                        {ing.unidad_medida === "AL_GUSTO"
                            ? "al gusto"
                            : `${Number(ing.cantidad_ingrediente)} ${ing.unidad_medida}`}
                    </li>
                ))}
            </ul>

            <h2 className="detalle-receta__subtitulo">Instrucciones de preparación</h2>
            <p className="detalle-receta__instrucciones">{recetaDatos.instrucciones_preparacion}</p>
        </article>
    );
}

export default Receta;