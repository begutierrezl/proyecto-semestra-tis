import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import Likert from 'react-likert-scale';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import { jwtDecode } from 'jwt-decode';
import "../styles/theme.css";
import '../styles/Valoracion.css';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function FormularioValoracion() {
  const { idReceta: paramIdReceta } = useParams();
  const [searchParams] = useSearchParams();

  const getUsuarioInicial = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const uid = decoded.user_id || decoded.id;
        if (uid) return String(uid);
      } catch (err) {
        console.warn('No se pudo decodificar el token:', err);
      }
    }
    return '';
  };

  const getRecetaInicial = () => {
    const queryReceta = searchParams.get('idReceta') || searchParams.get('receta') || searchParams.get('id');
    return String(paramIdReceta || queryReceta || '');
  };

  const [formData, setFormData] = useState(() => ({
    idUsuario: getUsuarioInicial(),
    idReceta: getRecetaInicial(),
    valoracion: '' // Escala Likert de 1 a 5 (R2.2)
  }));

  // Estados de feedback y carga
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState(''); // 'success' | 'error'
  const [cargando, setCargando] = useState(false);

  // R2.10: Detalle completo de la receta previo a la valoración
  const [recetaDetalle, setRecetaDetalle] = useState(null);
  const [cargandoReceta, setCargandoReceta] = useState(false);
  const [errorReceta, setErrorReceta] = useState('');

  // Salida 1: ID_USUARIO, ID_VALORACION (ID_RECETA, VALORACION)
  const [datosSalida, setDatosSalida] = useState(null);

  // R2.10: Desplegar automáticamente el detalle completo de la receta
  useEffect(() => {
    const idRecetaNum = parseInt(formData.idReceta, 10);
    if (!formData.idReceta || isNaN(idRecetaNum) || idRecetaNum <= 0) {
      return;
    }

    let isMounted = true;
    const fetchReceta = async () => {
      setCargandoReceta(true);
      try {
        const res = await api.get(`${BASE_URL}/api/receta/${idRecetaNum}`);
        if (isMounted) {
          setRecetaDetalle(res.data);
          setErrorReceta('');
        }
      } catch (err) {
        if (isMounted) {
          setRecetaDetalle(null);
          if (err.response?.status === 404) {
            setErrorReceta("Receta no encontrada. No es posible realizar la valoración");
          } else {
            setErrorReceta("Error de conexión al cargar la receta.");
          }
        }
      } finally {
        if (isMounted) {
          setCargandoReceta(false);
        }
      }
    };

    fetchReceta();

    return () => {
      isMounted = false;
    };
  }, [formData.idReceta]);

  // R2.2: Escala Likert cerrada de 5 puntos
  const likertOptions = {
    id: 'likert-escala-receta',
    question: "¿Qué te pareció esta receta?",
    responses: [
      { value: 1, text: "No gusta para nada" },
      { value: 2, text: "No me gusta" },
      { value: 3, text: "Indiferente" },
      { value: 4, text: "Me gusta" },
      { value: 5, text: "Me gusta mucho" }
    ],
    onChange: val => {
      if (val && typeof val.value !== 'undefined') {
        setFormData(prevData => ({
          ...prevData,
          valoracion: String(val.value)
        }));
      }
    }
  };

  const subirABaseDeDatos = async (e) => {
    e.preventDefault();

    const idUsuarioInt = parseInt(formData.idUsuario, 10);
    const idRecetaInt = parseInt(formData.idReceta, 10);
    const valoracionInt = parseInt(formData.valoracion, 10);

    // R2.1: Para ID_USUARIO número entero positivo estrictamente mayor a cero (>0), máx 12 dígitos
    if (!formData.idUsuario || isNaN(idUsuarioInt) || idUsuarioInt <= 0 || idUsuarioInt > 999999999999) {
      setMensaje("ID_USUARIO debe ser un número entero positivo mayor a cero (máximo 12 dígitos).");
      setTipoMensaje("error");
      setDatosSalida(null);
      return;
    }

    // R1.1: Para ID_RECETA número entero positivo estrictamente mayor a cero (>0), máx 12 dígitos
    if (!formData.idReceta || isNaN(idRecetaInt) || idRecetaInt <= 0 || idRecetaInt > 999999999999) {
      setMensaje("ID_RECETA debe ser un número entero positivo mayor a cero (máximo 12 dígitos).");
      setTipoMensaje("error");
      setDatosSalida(null);
      return;
    }

    // R2.2: VALORACION en escala cerrada de 1 a 5
    if (!formData.valoracion || isNaN(valoracionInt) || valoracionInt < 1 || valoracionInt > 5) {
      setMensaje("Debe seleccionar una valoración obligatoria en la escala Likert (1 a 5).");
      setTipoMensaje("error");
      setDatosSalida(null);
      return;
    }

    setCargando(true);
    setMensaje('');
    setTipoMensaje('');
    setDatosSalida(null);

    const payload = {
      id_usuario: idUsuarioInt,
      id_receta: idRecetaInt,
      valoracion: valoracionInt
    };

    try {
      // R2.7.2: Intento de registrar nueva valoración
      const response = await api.post(`${BASE_URL}/api/valoracion/registrar/`, payload);
      setMensaje(response.data?.mensaje || "Valoración registrada exitosamente");
      setTipoMensaje("success");

      // Salida 1: Guardamos los datos de la valoración
      if (response.data) {
        setDatosSalida({
          id_valoracion: response.data.id_valoracion,
          id_usuario: response.data.id_usuario,
          id_receta: response.data.id_receta,
          valoracion: response.data.valoracion
        });
      }
    } catch (err) {
      const errorData = err.response?.data;

      // R2.7.3: Si el par (ID_USUARIO, ID_RECETA) ya existe, actualiza la valoración existente
      if (
        err.response?.status === 400 &&
        errorData?.mensaje &&
        errorData.mensaje.includes("actualización")
      ) {
        try {
          const updateResponse = await api.put(`${BASE_URL}/api/valoracion/actualizar/`, payload);
          setMensaje(updateResponse.data?.mensaje || "Su valoración ha sido actualizada exitosamente");
          setTipoMensaje("success");

          if (updateResponse.data) {
            setDatosSalida({
              id_valoracion: updateResponse.data.id_valoracion,
              id_usuario: updateResponse.data.id_usuario,
              id_receta: updateResponse.data.id_receta,
              valoracion: updateResponse.data.valoracion
            });
          }
        } catch (updateErr) {
          const updateData = updateErr.response?.data;
          setMensaje(updateData?.mensaje || updateData?.error || "Error al actualizar la valoración.");
          setTipoMensaje("error");
          setDatosSalida(null);
        }
      } else {
        // Salida 2: Mensajes de error esperados (R2.8 y R2.9)
        setMensaje(
          errorData?.mensaje ||
          errorData?.error ||
          (err.response ? `Error del servidor (${err.response.status})` : "Error de conexión con el servidor.")
        );
        setTipoMensaje("error");
        setDatosSalida(null);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (name === 'idReceta' && (!value || isNaN(parseInt(value, 10)) || parseInt(value, 10) <= 0)) {
      setRecetaDetalle(null);
      setErrorReceta('');
    }
  };

  return (
    <div className="formulario-valoracion-container">
      <h2>Valoración de Recetas</h2>
      <form onSubmit={subirABaseDeDatos} className="formulario-valoracion">
        
        {/* Entradas: ID_USUARIO (R2.1) */}
        <div className="campo-formulario">
          <label htmlFor="idUsuario">ID Usuario :</label>
          <input 
            type="number" 
            id="idUsuario"
            name="idUsuario" 
            value={formData.idUsuario} 
            onChange={handleChange} 
            placeholder="Ej: 1"
            min="1"
            max="999999999999"
            required
          />
          <span className="campo-ayuda">Identificador del usuario (máximo 12 dígitos).</span>
        </div>

        {/* Entradas: ID_RECETA (R1.1) */}
        <div className="campo-formulario">
          <label htmlFor="idReceta">ID Receta :</label>
          <input 
            type="number" 
            id="idReceta"
            name="idReceta" 
            value={formData.idReceta} 
            onChange={handleChange} 
            placeholder="Ej: 1"
            min="1"
            max="999999999999"
            required
          />
          <span className="campo-ayuda">Identificador de la receta a valorar (máximo 12 dígitos).</span>
        </div>

        {/* R2.10: Despliegue automático del detalle completo de la receta antes de valorar */}
        {cargandoReceta && (
          <div className="receta-cargando">Cargando detalles de la receta...</div>
        )}

        {errorReceta && (
          <div className="mensaje-respuesta error">
            {errorReceta}
          </div>
        )}

        {recetaDetalle && (
          <div className="receta-detalle-card">
            <div className="receta-detalle-header">
              <span className="receta-badge-id">Receta #{recetaDetalle.id}</span>
              <h3 className="receta-titulo">{recetaDetalle.nombre_receta}</h3>
              <p className="receta-descripcion">{recetaDetalle.descripcion_corta}</p>
            </div>

            <div className="receta-tags">
              <span className="receta-tag"><strong>Categoría:</strong> {recetaDetalle.categoria}</span>
              <span className="receta-tag"><strong>Régimen:</strong> {recetaDetalle.regimen_alimenticio}</span>
              <span className="receta-tag"><strong>Porciones:</strong> {recetaDetalle.cantidad_personas} personas</span>
            </div>

            <div className="receta-seccion">
              <h4>Ingredientes:</h4>
              {recetaDetalle.ingrediente_receta && recetaDetalle.ingrediente_receta.length > 0 ? (
                <ul className="receta-ingredientes-lista">
                  {recetaDetalle.ingrediente_receta.map((ing, idx) => (
                    <li key={idx}>
                      <strong>{ing.nombre_ingrediente}</strong>: {ing.cantidad_ingrediente} {ing.unidad_medida}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="campo-ayuda">Sin ingredientes registrados.</p>
              )}
            </div>

            <div className="receta-seccion">
              <h4>Instrucciones de preparación:</h4>
              <p className="receta-instrucciones">{recetaDetalle.instrucciones_preparacion}</p>
            </div>
          </div>
        )}

        {/* R2.2: Escala Likert de 5 puntos */}
        <div className="likert-container">
          <Likert {...likertOptions} />
        </div>

        <button 
          type="submit" 
          className="boton-valorar"
          disabled={cargando}
        >
          {cargando ? "Enviando valoración..." : "Enviar Valoración"}
        </button>
      </form>

      {/* Salida 2: Mensaje de confirmación o error */}
      {mensaje && (
        <div className={`mensaje-respuesta ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}

      {/* Salida 1: Despliegue de datos de confirmación */}
      {datosSalida && (
        <div className="salida-valoracion-card">
          <h4>Resumen de la Valoración Registrada :</h4>
          <div className="salida-grid">
            <div><strong>ID Valoración:</strong> {datosSalida.id_valoracion}</div>
            <div><strong>ID Usuario:</strong> {datosSalida.id_usuario}</div>
            <div><strong>ID Receta:</strong> {datosSalida.id_receta}</div>
            <div><strong>Valoración emitida:</strong> {datosSalida.valoracion} / 5</div>
          </div>
        </div>
      )}

      <Link to="/" className="enlace-volver">
        &larr; Volver al inicio
      </Link>
    </div>
  );
}
