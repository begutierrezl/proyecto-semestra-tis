import { Link, NavLink } from "react-router-dom";
import "../styles/theme.css";
import "../styles/NavBar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Recetario</Link>
      <div className="navbar-botones">
        <NavLink to="/ingreso" className="navbar-boton">
          Ingresar receta
        </NavLink>
      </div>
    </nav>
  );
}

export default Navbar;