// import { useState } from "react";
// import { DBContext } from "./DBContext";

// export function useGlobal() {
//   const [listaUsuarios, setListaUsuarios] = useState([]);
//   const [listaBoxes, setListaBoxes] = useState([]);
//   const [Pasillo, setPasillo] = useState([]);

//   const getUsuarios = async () => {
//     try {
//       const response = await DBContext.getUsers();
//       if (response) {
//         setListaUsuarios(response);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getBoxes = async () => {
//     try {
//       const response = await DBContext.getBoxes();
//       if (response) {
//         setListaBoxes(response);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const getPasillo = async () => {
//     try {
//       const response = await DBContext.getPasillos();
//       if (response) {
//         setPasillos(response);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return {
//     listaUsuarios,
//     listaBoxes,
//     Pasillo,
//     getUsuarios,
//     getBoxes,
//     getPasillo,
//   };
// }
import { useState } from "react";
import { DBContext } from "./DBContext";

export function useGlobal() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaBoxes, setListaBoxes] = useState([]);
  const [listaPasillos, setListaPasillos] = useState([]);

  // Usuarios CRUD
  const getUsuarios = async () => {
    try {
      const response = await DBContext.getUsers();
      if (response) {
        setListaUsuarios(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addUsuario = async (usuario) => {
    try {
      const response = await DBContext.addUser(usuario);
      if (response) {
        setListaUsuarios([...listaUsuarios, response]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUsuario = async (id, usuario) => {
    try {
      await DBContext.updateUser(id, usuario);
      setListaUsuarios(
        listaUsuarios.map((user) => (user.id === id ? { ...user, ...usuario } : user))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await DBContext.deleteUser(id);
      setListaUsuarios(listaUsuarios.filter((user) => user.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Boxes CRUD
  const getBoxes = async () => {
    try {
      const response = await DBContext.getBoxes();
      if (response) {
        setListaBoxes(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addBox = async (box) => {
    try {
      const response = await DBContext.addBox(box);
      if (response) {
        setListaBoxes([...listaBoxes, response]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateBox = async (id, box) => {
    try {
      await DBContext.updateBox(id, box);
      setListaBoxes(
        listaBoxes.map((item) => (item.id === id ? { ...item, ...box } : item))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBox = async (id) => {
    try {
      await DBContext.deleteBox(id);
      setListaBoxes(listaBoxes.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  // Pasillos CRUD
  const getPasillos = async () => {
    try {
      const response = await DBContext.getPasillos();
      if (response) {
        setListaPasillos(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addPasillo = async (pasillo) => {
    try {
      const response = await DBContext.addPasillo(pasillo);
      if (response) {
        setListaPasillos([...listaPasillos, response]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePasillo = async (id, pasillo) => {
    try {
      await DBContext.updatePasillo(id, pasillo);
      setListaPasillos(
        listaPasillos.map((item) => (item.id === id ? { ...item, ...pasillo } : item))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deletePasillo = async (id) => {
    try {
      await DBContext.deletePasillo(id);
      setListaPasillos(listaPasillos.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return {
    listaUsuarios,
    listaBoxes,
    listaPasillos,
    getUsuarios,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    getBoxes,
    addBox,
    updateBox,
    deleteBox,
    getPasillos,
    addPasillo,
    updatePasillo,
    deletePasillo,
  };
}