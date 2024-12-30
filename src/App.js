import React, { useEffect, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./FirebaseConfig";
import { UserContext } from "./context/UserContext";
import Acceso from './componentes/Acceso';
import Administrador from './componentes/Administrador';
import Solicitante from './componentes/Solicitante';
import CierraSesion from './componentes/CierraSesion';
import SolicitarBox from './componentes/SolicitarBox'; // Importamos el componente

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

      {/* Ruta para solicitar un box */}
      <Route
        path="/solicitar-box"
        element={usuarioLogueado && usuarioRol === 'solicitante' ? <SolicitarBox /> : <Navigate to="/" />}
      />

      {/* Ruta para cerrar sesión */}
      <Route path="/cierra-sesion" element={<CierraSesion />} />
    </Routes>
  );
}

export default App;
