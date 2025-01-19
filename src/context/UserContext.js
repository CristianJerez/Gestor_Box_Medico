import React, { createContext, useContext, useEffect, useState } from "react";
import { DBContext } from "../DBContext";
import { useLocalStorage } from "../useLocalStorage";

// Crear el contexto
export const UserContext = createContext();

// Crear el proveedor del contexto
export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
  });

  const [ls_user, saveItem] = useLocalStorage("user", {});
  useEffect(() => {
    if (ls_user && Object.keys(ls_user).length > 0) {
      setState((prevState) => ({
        ...prevState,
        user: ls_user,
        isAuthenticated: true,
      }));
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const user = await DBContext.login(email, password);
      console.log("user context ", user);
      if (user && Object.keys(user).length > 0) {
        saveItem(user);
        setState((prevState) => ({
          ...prevState,
          user,
          isAuthenticated: true,
        }));
        console.log(state.listaUsuarios);
      } else {
        setState((prevState) => ({
          ...prevState,
          isAuthenticated: false,
        }));
        console.error("User is empty or invalid");
      }
    } catch (error) {
      console.error(error);
      setState((prevState) => ({
        ...prevState,
        isAuthenticated: false,
      }));
    }
  };

  const logout = () => {
    setState((prevState) => ({
      ...prevState,
      user: null,
      isAuthenticated: false,
    }));
    saveItem({});
  };

  return (
    <UserContext.Provider
      value={{
        state,
        loginUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUserContext = () => {
  return useContext(UserContext);
};
