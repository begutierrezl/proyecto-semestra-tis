import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/NavBar.jsx"
import "../styles/MostrarRecetaPagina.css";

function MostrarRecetaPagina() {
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
        <div>
            <Navbar />
            <div className="mostrarReceta-container">
                
                <article className="detalle-receta">
                    <h1 className="detalle-receta__nombre">{recetaDatos.nombre_receta}</h1>
                    <p className="detalle-receta__descripcion">{recetaDatos.descripcion_corta}</p>

                    
                    <dl className="detalle-receta__datos">
                        <dt>Para: {recetaDatos.cantidad_personas} personas</dt>
                        <dt>Categoría: {recetaDatos.categoria}</dt>
                        <dt>Régimen alimenticio: {recetaDatos.regimen_alimenticio}</dt>
                    </dl>

                    <p className="detalle-receta__subtitulo">Ingredientes</p>
                    <ul className="detalle-receta__ingredientes">
                        {(recetaDatos.ingrediente_receta ).map((ing, i) => (
                            <li key={i} className="titulo-receta">
                                {ing.nombre_ingrediente}:{" "}
                                {ing.unidad_medida === "AL_GUSTO"
                                    ? "al gusto"
                                    : `${Number(ing.cantidad_ingrediente)} ${ing.unidad_medida}`}
                            </li>
                        ))}
                    </ul>

                    <p className="detalle-receta__subtitulo">Instrucciones de preparación</p>
                    <p className="detalle-receta__instrucciones">{recetaDatos.instrucciones_preparacion}</p>
                </article>





                <div className="derecha"> 
                    {recetaDatos.imagen_referencial && (
                        <img
                        className="detalle-receta__imagen"
                        src={recetaDatos.imagen_referencial}
                        alt={`Imagen referencial de ${recetaDatos.nombre_receta}`}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default MostrarRecetaPagina

