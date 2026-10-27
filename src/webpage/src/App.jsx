import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import FormularioValoracion from "./pages/valoracion"
import BuscadorRecetas from "./pages/BuscadorRecetas"
import ListadoRecetaPopulares from "./pages/ListadoRecetasPopulares"
import AjusteIngredientes from "./components/AjusteIngredientes" // Funcion 4: ajuste de ingredientes
import IngresoRecetaPagina from "./pages/IngresoRecetaPagina"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListadoRecetaPopulares />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/buscar" element={<BuscadorRecetas />} />
        <Route path="/ajuste" element={<AjusteIngredientes />} />
        <Route path="/receta/:idReceta/ajuste" element={<AjusteIngredientes />} />
        <Route path="/ingreso" element={<IngresoRecetaPagina />} />
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/valoracion" element={<FormularioValoracion />} />
        <Route path="/valoracion/:idReceta" element={<FormularioValoracion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
