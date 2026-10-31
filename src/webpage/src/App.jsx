import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import FormularioValoracion from "./pages/valoracion"
import AjusteIngredientes from "./components/AjusteIngredientes" // Funcion 4: ajuste de ingredientes
import IngresoRecetaPagina from "./pages/IngresoRecetaPagina"
import MostrarRecetaPagina from "./pages/MostrarRecetaPagina"

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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/ajuste" element={<AjusteIngredientes />} />
        <Route path="/ajuste/:idReceta" element={<AjusteIngredientes />} />
        <Route path="/ingreso" element={<IngresoRecetaPagina />} />
        <Route path="/receta/:idReceta" element={<MostrarRecetaPagina/>} />
        <Route path="*" element={<NotFound />}></Route>
        <Route path="/valoracion" element={<FormularioValoracion />} />
        <Route path="/valoracion/:idReceta" element={<FormularioValoracion />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
