import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext"; // Contexto para manejar el login
import "./Acceso.css"; // Estilo personalizado para el login

function Acceso() {
  const [email, setEmail] = useState(""); // Estado para el email del usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña del usuario
  const { loginUser, loading } = useContext(UserContext); // Función de login desde el contexto
  const [error, setError] = useState(""); // Estado para manejar errores

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    try {
      await loginUser(email, password); // Intentar loguear al usuario usando el contexto
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="pantalla">
      <h2>GesBox</h2>
      <h2>Sistema de gestión de box clínicos</h2>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <h1>Iniciar sesión</h1>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br></br>
          {error && <p className="error">{error}</p>} {/* Mensaje de error */}
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
}

export { Acceso };
