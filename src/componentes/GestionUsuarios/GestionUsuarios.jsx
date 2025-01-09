// import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { db } from '../../FirebaseConfig';
// import './GestionUsuarios.css';

// const GestionUsuarios = () => {
//     const [usuarios, setUsuarios] = useState([]);
//     const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', contraseña: '', rol: false });
//     const [errores, setErrores] = useState({});
//     const [editando, setEditando] = useState(null);

//     const usuariosCollectionRef = collection(db, 'usuarios');

//     // Leer usuarios desde Firestore
//     useEffect(() => {
//         const obtenerUsuarios = async () => {
//             try {
//                 const data = await getDocs(usuariosCollectionRef);
//                 setUsuarios(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//             } catch (error) {
//                 console.error('Error al obtener usuarios:', error);
//             }
//         };
//         obtenerUsuarios();
//     }, []);

//     // Validar formulario
//     const validarFormulario = () => {
//         let errores = {};
//         const nombreRegex = /^[a-zA-Z\s]{6,}$/; // Solo letras y al menos 6 caracteres
//         const contraseñaRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Alfanumérica y al menos 8 caracteres
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación de formato de email

//         if (!nombreRegex.test(nuevoUsuario.nombre)) {
//             errores.nombre = 'El nombre debe contener solo letras y al menos 6 caracteres.';
//         }
//         if (!contraseñaRegex.test(nuevoUsuario.contraseña)) {
//             errores.contraseña = 'La contraseña debe ser alfanumérica y tener al menos 8 caracteres.';
//         }
//         if (!emailRegex.test(nuevoUsuario.email)) {
//             errores.email = 'El correo electrónico no es válido.';
//         }

//         setErrores(errores);
//         return Object.keys(errores).length === 0;
//     };

//     // Crear o actualizar usuario
//     const guardarUsuario = async () => {
//         if (!validarFormulario()) return;

//         try {
//             const userId = editando || `USR-${Date.now()}`; // Genera un ID único si no está editando

//             if (editando) {
//                 await updateDoc(doc(db, 'usuarios', editando), { ...nuevoUsuario });
//                 setUsuarios((prev) =>
//                     prev.map((usuario) =>
//                         usuario.id === editando ? { ...usuario, ...nuevoUsuario } : usuario
//                     )
//                 );
//                 setEditando(null);
//             } else {
//                 await addDoc(usuariosCollectionRef, { ...nuevoUsuario, id: userId });
//                 setUsuarios((prev) => [...prev, { ...nuevoUsuario, id: userId }]);
//             }

//             setNuevoUsuario({ nombre: '', email: '', contraseña: '', rol: false });
//             setErrores({});
//         } catch (error) {
//             console.error('Error al guardar usuario:', error);
//         }
//     };

//     // Eliminar usuario
//     const eliminarUsuario = async (id) => {
//         try {
//             await deleteDoc(doc(db, 'usuarios', id));
//             setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
//         } catch (error) {
//             console.error('Error al eliminar usuario:', error);
//         }
//     };

//     // Iniciar edición de usuario
//     const editarUsuario = (usuario) => {
//         setNuevoUsuario({
//             nombre: usuario.nombre,
//             email: usuario.email,
//             contraseña: '',
//             rol: usuario.rol
//         });
//         setEditando(usuario.id);
//     };

//     return (
//         <div className="gestion-usuarios">
//             <h1>Gestión de Usuarios</h1>
//             <div className="formulario">
//                 <input
//                     type="text"
//                     placeholder="Nombre"
//                     value={nuevoUsuario.nombre}
//                     onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
//                 />
//                 {errores.nombre && <p className="error">{errores.nombre}</p>}

//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={nuevoUsuario.email}
//                     onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
//                 />
//                 {errores.email && <p className="error">{errores.email}</p>}

//                 <input
//                     type="password"
//                     placeholder="Contraseña"
//                     value={nuevoUsuario.contraseña}
//                     onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, contraseña: e.target.value })}
//                 />
//                 {errores.contraseña && <p className="error">{errores.contraseña}</p>}

//                 <label>
//                     <input
//                         type="checkbox"
//                         checked={nuevoUsuario.rol}
//                         onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, rol: e.target.checked })}
//                     />
//                     ¿Es administrador?
//                 </label>
//                 <div className="botones">
//                     <button onClick={guardarUsuario}>{editando ? 'Actualizar' : 'Guardar'}</button>
//                     <button onClick={() => setNuevoUsuario({ nombre: '', email: '', contraseña: '', rol: false })}>Cancelar</button>
//                 </div>
//             </div>

//             <div className="lista-usuarios">
//                 <h2>Lista de Usuarios</h2>
//                 {usuarios.map((usuario) => (
//                     <div key={usuario.id} className="usuario">
//                         <p>
//                             <strong>ID:</strong> {usuario.id}<br />
//                             <strong>Nombre:</strong> {usuario.nombre}<br />
//                             <strong>Email:</strong> {usuario.email}<br />
//                             <strong>Rol:</strong> {usuario.rol ? 'Administrador' : 'Usuario'}
//                         </p>
//                         <div className="acciones">
//                             <button onClick={() => editarUsuario(usuario)}>Editar</button>
//                             <button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export { GestionUsuarios };

import React, { useEffect, useState } from "react";
import { useGlobal } from "../../useGlobal";
import "./GestionUsuarios.css";

const GestionUsuarios = () => {
  const {
    listaUsuarios,
    getUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
  } = useGlobal();

  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    contrasena: "",
    rol: false,
  });
  const [errores, setErrores] = useState({});
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    getUsuarios();
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

  // Guardar usuario
  const guardarUsuario = async () => {
    if (!validarFormulario()) return;

    try {
      if (editando) {
        await updateUsuario(editando, nuevoUsuario);
        setEditando(null);
      } else {
        await addUsuario(nuevoUsuario);
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
        {errores.contrasena && <p className="error">{errores.contrasena}</p>}

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
