import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { GestionBox } from "../GestionBox/GestionBox";
import { GestionPasillo } from "../GestionPasillos/GestionPasillos";
import { GestionUsuarios } from "../GestionUsuarios/GestionUsuarios";
import { MenuAdministrador } from "./MenuAdministrador";
import { MenuSolicitante } from "./MenuSolicitante";
import { ReservarBox } from "../ReservaBox/ReservarBox";
import "./Menu.css";
import { OcupacionBoxes } from "../Ocupacion/OcupacionBoxes";
import { ManualUso } from "../ManualUso";
import { DisponibilidadDia } from "./DisponibilidadDia";

function Menu() {
  const { state, logout } = useContext(UserContext);
  const [renderizar, setRenderizar] = useState("inicio");
  const HandleExit = () => {
    console.log("salir");
    logout();
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      <header className="header">
        
        <div className="menu-toggle" onClick={toggleSidebar}>
          &#9776; {/* Icono de menú */}
        </div>

        <h1>Portal Menu</h1>
        <h2>Bienvenido/a, {state.user ? state.user.nombre : "Guest"}</h2>
        <button onClick={HandleExit}> Cerrar sesion </button>
      </header>
      <aside className={`sidebar ${isSidebarOpen ? "show" : ""}`}>
        <nav>
          <ul className="menu-listado">
            <li>
              <button onClick={() => setRenderizar("inicio")}>Inicio</button>
            </li>
          </ul>
          {state.user && state.user.rol === true ? (
            <MenuAdministrador setRenderizar={setRenderizar} />
          ) : (
            ""
          )}
          <MenuSolicitante setRenderizar={setRenderizar} />
        </nav>
      </aside>
      <main className="content">
        {renderizar === "inicio" && <DisponibilidadDia />}

        {renderizar === "gestionUsuario" && <GestionUsuarios />}
        {renderizar === "gestionPasillo" && <GestionPasillo />}
        {renderizar === "gestionBox" && <GestionBox />}
        {renderizar === "reservarBox" && <ReservarBox />}
        {renderizar === "ocupacionBoxes" && <OcupacionBoxes />}
        {renderizar === "manualUso" && <ManualUso />}
      </main>
      {isModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal">
            <h2>Modal Title</h2>
            <p>Modal Content</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </>
      )}
    </div>
  );
}

export { Menu };
