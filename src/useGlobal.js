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
        getUsuarios();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateUsuario = async (id, usuario) => {
    try {
      await DBContext.editUser(id, usuario);
      getUsuarios();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUsuario = async (id) => {
    try {
      await DBContext.deleteUser(id);
      getUsuarios();
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
        getBoxes();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateBox = async (id, box) => {
    try {
      await DBContext.editBox(id, box);
      getBoxes();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBox = async (id) => {
    try {
      await DBContext.deleteBox(id);
      getBoxes();
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
        getPasillos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePasillo = async (id, pasillo) => {
    try {
      await DBContext.editPasillo(id, pasillo);
      getPasillos();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePasillo = async (id) => {
    try {
      await DBContext.deletePasillo(id);
      getPasillos();
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
