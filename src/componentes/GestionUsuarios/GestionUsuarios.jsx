import React, { useEffect, useState } from "react";
import "./GestionUsuarios.css";
import { DBContext } from "../../DBContext";

const GestionUsuarios = () => {
  const [listaUsuarios, setListaUsuarios] = useState([]);

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    rol: false,
  });
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(null);

  const fetchData = async () => {
    const response = await DBContext.getUsers();
    try {
      if (response) {
        setListaUsuarios(response);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Validar formulario
  const validarFormulario = () => {
    let errores = {};
    const nombreRegex = /^[a-zA-Z\s]{6,}$/; // Solo letras y al menos 6 caracteres
    const contrasenaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Alfanumérica y al menos 8 caracteres
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación de formato de email

    if (!nombreRegex.test(nuevoUsuario.nombre)) {
      errores.nombre =
        "El nombre debe contener solo letras y al menos 6 caracteres.";
    }
    if (!contrasenaRegex.test(nuevoUsuario.contrasena)) {
      errores.contrasena =
        "La contraseña debe ser alfanumérica y tener al menos 8 caracteres.";
    }
    if (!emailRegex.test(nuevoUsuario.email)) {
      errores.email = "El correo electrónico no es válido.";
    }

    setErrores(errores);
    return Object.keys(errores).length === 0;
  };

  const deleteUsuario = async (id) => {
    try {
      await DBContext.deleteUser(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  // Guardar usuario
  const guardarUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      if (editando) {
        // await updateUsuario(editando, nuevoUsuario);
        try {
          await DBContext.editUser(editando, nuevoUsuario);
          fetchData();
        } catch (error) {
          console.error(error);
        }
        setEditando(null);
      } else {
        // await addUsuario(nuevoUsuario);
        try {
          const response = await DBContext.addUser(nuevoUsuario);
          if (response) {
            fetchData();
          }
        } catch (error) {
          console.error(error);
        }
      }

      setNuevoUsuario({ nombre: "", email: "", contrasena: "", rol: false });
      setErrores({});
    } catch (error) {
      console.error("Error al guardar usuario:", error);
    }
  };

  // Iniciar edición de usuario
  const editarUsuario = (usuario) => {
    setNuevoUsuario({
      nombre: usuario.nombre,
      email: usuario.email,
      contrasena: "", // No se muestra la contraseña para seguridad
      rol: usuario.rol,
    });
    setEditando(usuario.id);
  };

  return (
    <div className="cuerpo">
      <div className="gestion-usuarios-container">
        <div className="gestion-usuarios">
          <h1>Gestión de Usuarios</h1>
          <div className="formulario">
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoUsuario.nombre}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
              }
            />
            {errores.nombre && <p className="error">{errores.nombre}</p>}

            <input
              type="email"
              placeholder="Email"
              value={nuevoUsuario.email}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
              }
            />
            {errores.email && <p className="error">{errores.email}</p>}

            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.contrasena}
              onChange={(e) =>
                setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })
              }
            />
            {errores.contrasena && (
              <p className="error">{errores.contrasena}</p>
            )}

            <label>
              <input
                type="checkbox"
                checked={nuevoUsuario.rol}
                onChange={(e) =>
                  setNuevoUsuario({ ...nuevoUsuario, rol: e.target.checked })
                }
              />
              ¿Es administrador?
            </label>
            <div className="botones">
              <button onClick={guardarUsuario}>
                {editando ? "Actualizar" : "Guardar"}
              </button>
              <button
                onClick={() =>
                  setNuevoUsuario({
                    nombre: "",
                    email: "",
                    contrasena: "",
                    rol: false,
                  })
                }
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lista-usuarios">
        <h2>Lista de Usuarios</h2>
        {listaUsuarios.map((usuario) => (
          <div key={usuario.id} className="usuario">
            <p>
              <strong>ID:</strong> {usuario.id}
              <br />
              <strong>Nombre:</strong> {usuario.nombre}
              <br />
              <strong>Email:</strong> {usuario.email}
              <br />
              <strong>Rol:</strong> {usuario.rol ? "Administrador" : "Usuario"}
            </p>
            <div className="acciones">
              <button onClick={() => editarUsuario(usuario)}>Editar</button>
              <button onClick={() => deleteUsuario(usuario.id)}>
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { GestionUsuarios };
