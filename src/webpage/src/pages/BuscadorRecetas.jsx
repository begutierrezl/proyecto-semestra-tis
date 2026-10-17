import { useState } from 'react';
import '../styles/BuscadorRecetas.css';

const BuscadorRecetas = () => {
    const [nombre, setNombre] = useState('');
    const [categoria, setCategoria] = useState('');
    const [regimen, setRegimen] = useState('');

    const [resultados, setResultados] = useState([]);
    const [mensaje, setMensaje] = useState('');

    const handleBuscar = async (e) => {
        e.preventDefault();
        setMensaje('');
        setResultados([]);

        const url = new URL('http://localhost:8000/api/recetas/buscar/');
        if (nombre) url.searchParams.append('nombre_receta', nombre);
        if (categoria) url.searchParams.append('categoria', categoria);
        if (regimen) url.searchParams.append('regimen_alimenticio', regimen);

        try {
            const respuesta = await fetch(url);
            const data = await respuesta.json();

            if (respuesta.ok) {
                setResultados(data.resultados);
            } else {
                setMensaje(data.error || data.mensaje);
            }
        } catch (error) {
            setMensaje("Error al conectar con el servidor.");
        }
    };

    const formatoCategoria = {
        'PLATO_FONDO': 'Plato de Fondo',
        'ENSALADAS': 'Ensaladas',
        'POSTRES': 'Postres',
        'DESAYUNOS': 'Desayunos',
        'SOPAS': 'Sopas'
    };

    const formatoRegimen = {
        'NORMAL': 'Normal',
        'VEGANO': 'Vegano',
        'SIN_LACTOSA': 'Sin Lactosa',
        'DIABETICO': 'Diabético',
        'VEGETARIANO': 'Vegetariano'
    };

    return (
        <div className="buscador-container">
            <h2>Buscador de Recetas</h2>

            <form onSubmit={handleBuscar} className="buscador-form">
                <input
                    type="text"
                    placeholder="Nombre de la receta..."
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="buscador-input"
                />

                <div className="filtros-fila">
                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="buscador-select">
                        <option value="">Cualquier Categoría</option>
                        <option value="postres">Postres</option>
                        <option value="ensaladas">Ensaladas</option>
                        <option value="plato_fondo">Plato de fondo</option>
                        <option value="sopas">Sopas</option>
                        <option value="entradas">Entradas</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="desayunos">Desayunos</option>
                    </select>

                    <select value={regimen} onChange={(e) => setRegimen(e.target.value)} className="buscador-select">
                        <option value="">Cualquier Régimen</option>
                        <option value="normal">Normal</option>
                        <option value="diabetico">Diabético</option>
                        <option value="celiaco">Celíaco</option>
                        <option value="vegetariano">Vegetariano</option>
                        <option value="vegano">Vegano</option>
                        <option value="sin_lactosa">Sin lactosa</option>
                    </select>
                </div>

                <button type="submit" className="buscador-button">Buscar</button>
            </form>

            {mensaje && <p className="error-mensaje">{mensaje}</p>}

            <div className="resultados-lista">
                {resultados.map((receta) => (
                    <div key={receta.id} className="receta-card">
                        <h3>{receta.nombre_receta}</h3>
                        <p><strong>Categoría:</strong> {formatoCategoria[receta.categoria]} | <strong>Régimen:</strong> {formatoRegimen[receta.regimen_alimenticio]}</p>
                        <p>{receta.descripcion_corta}</p>
                        <a href={receta.enlace_receta} target="_blank" rel="noreferrer" className="receta-link">Ver Receta Completa</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BuscadorRecetas;