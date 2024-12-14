import React, { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { auth } from "./FirebaseConfig";
import Acceso from './componentes/Acceso';
import Administrador from './componentes/Administrador';
import CierraSesion from './componentes/CierraSesion';
import Solicitante from './componentes/Solicitante';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <nav>
            <Link to="/cierra-sesion">Cerrar sesión</Link>
          </nav>
          {user.email === "admin@example.com" ? (
            <Routes>
              <Route path="/" element={<Administrador />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Solicitante />} />
            </Routes>
          )}
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Acceso />} />
        </Routes>
      )}
      <Routes>
        <Route path="/cierra-sesion" element={<CierraSesion />} />
      </Routes>
    </div>
  );
}

export default App;
