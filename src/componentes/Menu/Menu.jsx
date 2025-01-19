import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { GestionBox } from "../GestionBox/GestionBox";
import { GestionPasillo } from "../GestionPasillos/GestionPasillos";
import { GestionUsuarios } from "../GestionUsuarios/GestionUsuarios";
import { MenuAdministrador } from "./MenuAdministrador";
import { MenuSolicitante } from "./MenuSolicitante";
import { ReservarBox } from "../ReservaBox/ReservarBox";
import "./Menu.css";
import { OcupacionBoxes } from "../OcupacionBoxes";

function Menu() {
  const { state, logout } = useContext(UserContext);
  const [renderizar, setRenderizar] = useState("nada");
  const HandleExit = () => {
    console.log("salir");
    logout();
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="container">
      <header className="header">
        <div className="menu-toggle" onClick={toggleMenu}>
          &#9776; {/* Icono de menú */}
        </div>
        <h1>Portal Menu</h1>
        <h2>Bienvenido, {state.user ? state.user.nombre : "Guest"}</h2>
        <button onClick={HandleExit}> Cerrar sesion </button>
      </header>
      <aside className={`sidebar ${menuOpen ? "show" : ""}`}>
        <nav>
          {state.user && state.user.rol === true ? (
            <MenuAdministrador setRenderizar={setRenderizar} />
          ) : (
            ""
          )}
          <MenuSolicitante setRenderizar={setRenderizar} />
          {/* <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul> */}
        </nav>
      </aside>
      <main className="content">
        {/* Aquí puedes renderizar el contenido seleccionado */}
        {renderizar === "gestionUsuario" && <GestionUsuarios />}
        {renderizar === "gestionPasillo" && <GestionPasillo />}
        {renderizar === "gestionBox" && <GestionBox />}
        {renderizar === "reservarBox" && <ReservarBox />}
        {renderizar === "ocupacionBoxes" && <OcupacionBoxes />}
      </main>
    </div>
  );
}

export { Menu };
