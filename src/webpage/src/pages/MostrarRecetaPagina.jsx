import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api";
import Navbar from "../components/NavBar.jsx"
import FormularioValoracion from "../components/Valoracion.jsx";
import AjusteIngredientes from "../components/AjusteIngredientes.jsx";
import Calificacion from "../components/Calificacion.jsx";
import "../styles/MostrarRecetaPagina.css";

function MostrarRecetaPagina() {
    const {idReceta} = useParams()
    const [receta, setReceta] = useState(null);
    const [calificacion, setCalificacion] = useState(null);

    const fetchReceta = async () => {
        const url = `http://localhost:8000/api/receta/${idReceta}`;
        try {
            const receta = await api.get(url);
            setReceta(receta.data);
        } catch(error) {
            console.warn(error.response);
        }
    }

    const fetchCalificacion = async () => {
        try {
            const calificacion = await api.get(`/api/calificacion/get/from_receta/${idReceta}/`);
            setCalificacion(calificacion.data);
        }
        catch (error) {
            console.warn(error);
        }
    }

    useEffect(() => {
        fetchReceta();
        fetchCalificacion();
    },[idReceta])

    if (!receta) return <p>Cargando...</p>;
    return (
        <div>
            <Navbar />
            <div className="mostrarReceta-container">
                
                <article className="mostrarReceta-receta">
                    <h1 className="mostrarReceta-receta__nombre">{receta.nombre_receta}</h1>
                    <p className="mostrarReceta-receta__descripcion">{receta.descripcion_corta}</p>

                    
                    <dl className="mostrarReceta-receta__datos">
                        <dt>Para: {receta.cantidad_personas} personas</dt>
                        <dt>Categoría: {receta.categoria}</dt>
                        <dt>Régimen alimenticio: {receta.regimen_alimenticio}</dt>
                    </dl>

                    <p className="mostrarReceta-receta__subtitulo">Ingredientes</p>
                    <ul className="mostrarReceta-receta__ingredientes">
                        {(receta.ingrediente_receta ).map((ing, i) => (
                            <li key={i} className="titulo-receta">
                                {ing.nombre_ingrediente}:{" "}
                                {ing.unidad_medida === "AL_GUSTO"
                                    ? "al gusto"
                                    : `${Number(ing.cantidad_ingrediente)} ${ing.unidad_medida}`}
                            </li>
                        ))}
                    </ul>

                    <p className="mostrarReceta-receta__subtitulo">Instrucciones de preparación</p>
                    <p className="mostrarReceta-receta__instrucciones">{receta.instrucciones_preparacion}</p>
                </article>

                <div className="derecha"> 
                    {receta.imagen_referencial && (
                        <img
                        className="mostrarReceta-receta__imagen"
                        src={receta.imagen_referencial}
                        alt={`Imagen referencial de ${receta.nombre_receta}`}
                        />
                    )}
                    <Calificacion calificacion={calificacion} />

                    <AjusteIngredientes />

                    <FormularioValoracion />

                </div>
            </div>
        </div>
    )
}

export default MostrarRecetaPagina

