import React, { useState } from "react"; // Importamos React y el hook useState para manejar estados locales
import { signOut } from "firebase/auth"; // Importamos el método signOut de Firebase para cerrar sesión
import { auth } from "../FirebaseConfig"; // Importamos la configuración de Firebase
import { useNavigate } from "react-router-dom"; // Importamos useNavigate para redirigir a otras páginas

const CierraSesion = ({ setUsuarioLogueado }) => {
  const [error, setError] = useState(""); // Estado para almacenar posibles errores al cerrar sesión
  const navigate = useNavigate(); // Hook para navegar entre rutas

  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    // Muestra una confirmación antes de cerrar sesión
    const confirmLogout = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );
    if (confirmLogout) {
      signOut(auth) // Llama a la función de Firebase para cerrar sesión
        .then(() => {
          setUsuarioLogueado(false); // Actualiza el estado de usuario logueado en el componente padre
          console.log("Usuario desconectado"); // Mensaje en la consola como retroalimentación
          navigate("/"); // Redirige al usuario a la página principal (login)
        })
        .catch((error) => {
          // Maneja cualquier error que ocurra al intentar cerrar sesión
          setError("No se pudo cerrar sesión. Intenta de nuevo más tarde."); // Muestra un mensaje de error al usuario
          console.error("Error al cerrar sesión:", error); // Detalles del error en la consola para depuración
        });
    }
  };

  return (
    <div>
      {/* Muestra un mensaje de error si existe */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Botón para cerrar sesión, que llama a la función handleLogout al hacer clic */}
      <button className="logout-button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default CierraSesion;
