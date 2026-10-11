import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"

function ListadoRecetasPopulares() {
    // Lista de recetas + estados
    const [recetas, setRecetas] = useState([]);
    // lista de valoraciones de una receta en particular
    const [valoraciones, setValoraciones] = useState([]);
    // Calificacion de una receta, por receta en 'recetas'
    const [calificaciones, setCalificaciones] = useState([]);

    // recupera las recetas de la BD y los pone en la lista recetas
    const getRecetas = () => {
        api
            .get("/api/receta/")
            .then((res) => res.data)
            .then((data) => {
                setRecetas(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const getValoraciones = (id_receta) => {
        api
            .get(`api/valoracion/${id_receta}`)
            .then((res) => res.data)
            .then((data) => {
                setValoraciones(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const contarValoraciones = (lista_valoraciones) => {
        let cantidad_valoraciones = 0;
        lista_valoraciones.map(() => {
            cantidad_valoraciones += 1;
        })
        return cantidad_valoraciones
    }

    const promedioValoracion = (lista_valoraciones, cantidad_valoraciones) => {
        let suma = 0;
        lista_valoraciones.map((valoracion) => {
            suma += valoracion.valoracion;
        })
        return suma/cantidad_valoraciones;
    }

    // obtiene las recetas
    useEffect(() => {
        getRecetas();
        recetas.map(
            (receta) => {
                let cantidad_valoraciones = 0;
                let promedio_valoracion = 0;
                
                getValoraciones(receta.id);
                cantidad_valoraciones = contarValoraciones(valoraciones);
                promedio_valoracion = promedioValoracion(valoraciones);

                console.log(cantidad_valoraciones)
                console.log(promedio_valoracion)
            }
        );
    }, [])

    return (
        <div>
            <h1>Hola mundo</h1>
        </div>
    );
}

export default ListadoRecetasPopulares;

/* 
    ejemplo:

    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");

    // Se ejecuta solo una vez al cargar el modulo
    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { content, title })
            .then((res) => {
                if (res.status === 201) alert("Note created!");
                else alert("Failed to make note.");
                getNotes();
            })
            .catch((err) => alert(err));
    }; */