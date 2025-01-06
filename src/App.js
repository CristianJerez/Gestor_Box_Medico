import React, { useContext, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { auth } from "./FirebaseConfig";
import Acceso from './componentes/Acceso';
import Administrador from './componentes/Administrador';
import CierraSesion from './componentes/CierraSesion';
import GestionBox from "./componentes/GestionBox";
import GestionPasillos from "./componentes/GestionPasillos";
import GestionUsuarios from "./componentes/GestionUsuarios";
import MisReservas from "./componentes/MisReservas";
import OcupacionBoxes from "./componentes/OcupacionBoxes";
import ReservarBox from "./componentes/ReservarBox";
import Solicitante from './componentes/Solicitante';
import { UserContext } from "./context/UserContext";

function App() {
  const { usuarioLogueado, usuarioRol, setUsuarioLogueado, setUsuarioRol } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUsuarioLogueado(true);
        if (user.email === "admin@example.com") {
          setUsuarioRol("admin");
        } else {
          setUsuarioRol("solicitante");
        }
      } else {
        setUsuarioLogueado(false);
        setUsuarioRol(null);
      }
    });
    return () => unsubscribe();
  }, [setUsuarioLogueado, setUsuarioRol]);

  return (
    <Routes>
      {/* Ruta para la pantalla de login */}
      <Route path="/" element={!usuarioLogueado ? <Acceso /> : <Navigate to={`/${usuarioRol}`} />} />

      {/* Ruta para el administrador */}
      <Route
        path="/admin"
        element={usuarioLogueado && usuarioRol === 'admin' ? <Administrador /> : <Navigate to="/" />}
      />

      {/* Ruta para el solicitante */}
      <Route
        path="/solicitante"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <Solicitante /> : <Navigate to="/" />}
      />

      {/* Ruta para la gestion de usuarios */}
      <Route
        path="/gestion-usuarios"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <GestionUsuarios /> : <Navigate to="/" />}
      />

      {/* Ruta para la gestion de pasillos */}
      <Route
        path="/gestion-pasillos"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <GestionPasillos /> : <Navigate to="/" />}
      />

      {/* Ruta para gestionar un box */}
      <Route
        path="/gestion-box"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <GestionBox /> : <Navigate to="/" />}
      />

      {/* Ruta para reservar un box */}
      <Route
        path="/reservar-box"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <ReservarBox /> : <Navigate to="/" />}
      />

      {/* Ruta para reservar un box */}
      <Route
        path="/ocupacion-boxes"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <OcupacionBoxes /> : <Navigate to="/" />}
      />

            {/* Ruta para ver mis reservas*/}
            <Route
        path="/mis-reservas"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <MisReservas /> : <Navigate to="/" />}
      />

      {/* Ruta para cerrar sesión */}
      <Route path="/cierra-sesion" element={<CierraSesion />} />
    </Routes>

  );
}

export default App;
