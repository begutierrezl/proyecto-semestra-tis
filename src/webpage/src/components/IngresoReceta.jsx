import { useState } from "react"
import Ingrediente from "./IngresoIngrediente";
import api from "../api"
function IngresoReceta() {
    //estados de valores
    const [nombre_receta, setNombreReceta] = useState('');
    const [descripcion_corta, setDescripcionCorta] = useState('');
    const [imagen_referencial, setImagenReferencial] = useState('');
    const [cantidad_personas, setCantidadPersonas] = useState('');
    const [categoria, setCategoria] = useState('');
    const [regimen_alimenticio,setRegimenAlimenticio] = useState('');
    const [instrucciones_preparacion,setInstruccionesPreparacion] = useState('');
    const [ingrediente_receta, setIngredienteReceta]= useState([]);
    const [mensaje,SetMensaje]= useState('');//para mensajes de error
    
    //funcion para ingrediente vacio
    const crearIngredienteNuevo = () =>(
        {
            nombre_ingrediente :"", cantidad_ingrediente:"",unidad_medida:"GRAMOS"
        }
    )
    const addIngrediente = (e) =>{
        //concadena ingrediente vacio
        setIngredienteReceta(ingrediente_receta.concat(crearIngredienteNuevo()));
        

    }
    const quitarIngrediente = (i) =>{

        //elimina ingrediente i
        setIngredienteReceta(
            //devuelve lista que tiene todo menos elemnto i
            ingrediente_receta.filter((ing,index)=> index != i)
        )
    }
    const cambiarIngrediente = (i, campo, valor) => {
        const copia= [...ingrediente_receta];
        copia[i] = {...copia[i], [campo]: valor};//cambia valor de campo de ingrediente i
        setIngredienteReceta(copia);
    };
    //itera por la lista de ingredientes que hay para mostrar en la pagina
    const iterableIngredientes = ingrediente_receta.map((ingrediente,i)=> (
        <div key={i}>
            <Ingrediente
                //le pasa los prop necesarios
                ingrediente={ingrediente}
                //se los pasa como flecha para saber cual ingrediente y campo cambia
                onChange={(campo, valor) => cambiarIngrediente(i, campo, valor)}
                //flecha para que corra con boton
                eliminarIng={() => quitarIngrediente(i)}
            />
        </div>
    ))

    const handleSubmit =async (e) =>{
        const url="http://localhost:8000/api/receta/insert/" //Para desarrollo
        e.preventDefault(); //para que no se pierda al subir los datos
        const formData = new FormData(e.target);//le entregamos lo que sube el evento que es la form
        formData.set("nombre_receta",nombre_receta.toUpperCase())//Mayusculas R1.14
        formData.append("ingrediente_receta", JSON.stringify(ingrediente_receta));//añadidos manualmente
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
                        onChange={(e)=>setImagenReferencial(e.target.files)}
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
                <label >
                    Ingredientes:
                    <button onClick={addIngrediente} type="button">+

                    </button>
                    {iterableIngredientes}

                </label>
                <button type="submit">
                    Ingresar Receta
                </button>
            </form>
        </div>
    )
} export default IngresoReceta
