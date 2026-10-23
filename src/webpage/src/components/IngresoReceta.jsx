import { useState } from "react"
import api from "../api"
function IngresoReceta() {
    //estados de valores
    const [nombre_receta, setNombreReceta] = useState('');
    const [descripcion_corta, setDescripcionCorta] = useState('');
    const [imagen_referencial, setImagenRefencial] = useState('');
    const [cantidad_personas, setCantidadPersonas] = useState('');
    const [categoria, setCategoria] = useState('');
    const [regimen_alimenticio,setRegimenAlimenticio] = useState('');
    const [instrucciones_preparacion,setInstruccionesPreparacion] = useState('');
    const [mensaje,SetMensaje]= useState('');//para mensajes de error
    const handleSubmit =async (e) =>{
        const url="http://localhost:8000/api/receta/insert/" //Para desarrollo
        e.preventDefault(); //para que no se pierda al subir los datos
        const formData = new FormData(e.target);//le entregamos lo que sube el evento que es la form
        formData.set("nombre_receta",nombre_receta.toUpperCase())//Mayusculas R1.14
        formData.append("ingrediente_receta", JSON.stringify([{ nombre_ingrediente: "Harina", cantidad_ingrediente: 500, unidad_medida: "GRAMOS"}]));
        console.log(formData);
        try
        {
        const respuesta = await api.post(url,formData);
        }catch(error)
        {
        console.log(error.response);

        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label >
                    Nombre de la Receta:
                    <input
                        type="text"
                        id="nombre_receta"
                        name="nombre_receta"
                        value={nombre_receta}
                        onChange={(e) => setNombreReceta(e.target.value)}
                        required />
                </label>
                <label >
                    Descripcion:
                    <input
                        type="text"
                        id="descripcion_corta"
                        name="descripcion_corta"
                        value={descripcion_corta}
                        onChange={(e)=> setDescripcionCorta(e.target.value)}
                        required />
                </label>
                <label >
                    Imagen Referencial:
                    <input
                        type="file"
                        id="imagen_referencial"
                        name="imagen_referencial"
                        value={imagen_referencial}
                        onChange={(e)=>setImagenRefencial(e.target.files)}
                        required
                        accept=".png,.jpg" />
                </label>
                <label >
                    Cantidad de Personas:
                    <input
                        type="number"
                        id="cantidad_personas"
                        name="cantidad_personas"
                        value={cantidad_personas}
                        onChange={(e)=>setCantidadPersonas(e.target.value)}
                        required
                    />
                </label>
                <label >
                    Categoria:
                    <select id="categoria" name="categoria" 
                    value={categoria}
                    onChange={(e)=>setCategoria(e.target.value)}>
                        <option value="POSTRES">Postres</option>
                        <option value="ENSALADAS">Ensaladas</option>
                        <option value="PLATO_FONDO">Plato de fondo</option>
                        <option value="SOPAS">Sopas</option>
                        <option value="ENTRADAS">Entradas</option>
                        <option value="BEBIDAS">Bebidas</option>
                        <option value="DESAYUNOS">Desayunos</option>
                    </select>
                </label>
                <label >
                    Regimen Alimenticio:
                    <select name="regimen_alimenticio"
                    id="regimen_alimenticio"
                    value={regimen_alimenticio}
                    onChange={(e)=>setRegimenAlimenticio(e.target.value)}>
                        <option value="NORMAL">Normal</option>
                        <option value="DIABETICO">Diabético</option>
                        <option value="CELIACO">Celíaco</option>
                        <option value="VEGETARIANO">Vegetariano</option>
                        <option value="VEGANO">Vegano</option>
                        <option value="SIN_LACTOSA">Sin Lactosa</option>
                    </select>
                </label>
                <label >
                    Instrucciones de Preparación:
                    <input
                        type="text"
                        name="instrucciones_preparacion"
                        id="instrucciones_preparacion" 
                        value={instrucciones_preparacion}
                        onChange={(e)=>setInstruccionesPreparacion(e.target.value)}
                        />

                </label>
                <button type="submit">
                    Ingresar Receta
                </button>
            </form>
        </div>
    )
} export default IngresoReceta
