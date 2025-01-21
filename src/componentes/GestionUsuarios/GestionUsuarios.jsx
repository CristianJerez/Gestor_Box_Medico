import React, { useEffect, useState } from "react";
import { DBContext } from "../../DBContext";
import "./GestionUsuarios.css";

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

  // Obtener lista de usuarios
  const fetchData = async () => {
    try {
      const users = await DBContext.getUsers();
      setListaUsuarios(users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validaciones del formulario
  const validarFormulario = () => {
    let nuevosErrores = {};
    const nombreRegex = /^[a-zA-Z\s]{6,}$/;
    const contrasenaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nombreRegex.test(nuevoUsuario.nombre)) {
      nuevosErrores.nombre = "El nombre debe contener solo letras y al menos 6 caracteres.";
    }
    if (!contrasenaRegex.test(nuevoUsuario.contrasena) && !editando) {
      nuevosErrores.contrasena = "La contraseña debe ser alfanumérica y tener al menos 8 caracteres.";
    }
    if (!emailRegex.test(nuevoUsuario.email)) {
      nuevosErrores.email = "El correo electrónico no es válido.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar o actualizar usuario
  const guardarUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      if (editando) {
        await DBContext.editUser(editando, {
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          rol: nuevoUsuario.rol ? "admin" : "usuario",
        });
        console.log(`Usuario con ID ${editando} actualizado.`);
      } else {
        await DBContext.addUser({
          nombre: nuevoUsuario.nombre,
          email: nuevoUsuario.email,
          password: nuevoUsuario.contrasena,
          rol: nuevoUsuario.rol ? "admin" : "usuario",
        });
        console.log("Nuevo usuario creado.");
      }
      fetchData();
      setNuevoUsuario({ nombre: "", email: "", contrasena: "", rol: false });
      setEditando(null);
      setErrores({});
    } catch (error) {
      console.error("Error al guardar usuario:", error.message);
    }
  };

  // Preparar usuario para edición
  const editarUsuario = (usuario) => {
    setNuevoUsuario({
      nombre: usuario.nombre,
      email: usuario.email,
      contrasena: "", // No mostrar contraseña
      rol: usuario.rol === "admin",
    });
    setEditando(usuario.id);
  };

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    if (!id) {
      console.error("ID de usuario no proporcionado.");
      return;
    }
    try {
      await DBContext.deleteUser(id);
      console.log(`Usuario con ID ${id} eliminado correctamente.`);
      fetchData(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar usuario:", error.message);
    }
  };
  

  return (
    <div className="cuerpo">
      <div className="gestion-usuarios-container">
        <h1>Gestión de Usuarios</h1>
        <div className="formulario">
          <input
            type="text"
            placeholder="Nombre"
            value={nuevoUsuario.nombre}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
          />
          {errores.nombre && <p className="error">{errores.nombre}</p>}

          <input
            type="email"
            placeholder="Email"
            value={nuevoUsuario.email}
            onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
          />
          {errores.email && <p className="error">{errores.email}</p>}

          {!editando && (
            <input
              type="password"
              placeholder="Contraseña"
              value={nuevoUsuario.contrasena}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contrasena: e.target.value })}
            />
          )}
          {errores.contrasena && <p className="error">{errores.contrasena}</p>}

          <label>
            <input
              type="checkbox"
              checked={nuevoUsuario.rol}
              onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.checked })}
            />
            ¿Es administrador?
          </label>

          <div className="botones">
            <button className="btn-guardar" onClick={guardarUsuario}>
              {editando ? "Actualizar Usuario" : "Guardar Usuario"}
            </button>
            {editando && (
              <button
                className="btn-cancelar"
                onClick={() => {
                  setNuevoUsuario({ nombre: "", email: "", contrasena: "", rol: false });
                  setEditando(null);
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="lista-usuarios">
        <h2>Lista de Usuarios</h2>
        {listaUsuarios.map((usuario) => (
          <div key={usuario.id} className="usuario">
            <p>
              <strong>Nombre:</strong> {usuario.nombre}
              <br />
              <strong>Email:</strong> {usuario.email}
              <br />
              <strong>Rol:</strong> {usuario.rol === "admin" ? "Administrador" : "Usuario"}
            </p>
            <div className="acciones">
              <button className="btn-editar" onClick={() => editarUsuario(usuario)}>
                Editar
              </button>
              <button className="btn-eliminar" onClick={() => eliminarUsuario(usuario.id)}>
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
