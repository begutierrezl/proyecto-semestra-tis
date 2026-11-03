import NavBar from "../components/NavBar";
import BuscadorRecetas from "../components/BuscadorRecetas";
import ListadoRecetasPopulares from "../components/ListadoRecetasPopulares";
import "../styles/theme.css";
import "../styles/Home.css";


function Home() {
  return (
    <>
      <NavBar />
      <div className="home-container">
        <div className="home-buscador">
          <BuscadorRecetas />
        </div>
        <div className="home-listado">
          <ListadoRecetasPopulares />
        </div>
        
      </div>
    </>
  );
}

export default Home;