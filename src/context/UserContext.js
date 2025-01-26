import React, { createContext, useContext, useEffect, useState } from "react";
import { DBContext } from "../DBContext";
import { auth } from "../FirebaseConfig";
import { useLocalStorage } from "../useLocalStorage";

export const UserContext = createContext();

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({
    user: null,
    isAuthenticated: null,
  });
  const [ls_user, saveItem] = useLocalStorage("user", {});

  useEffect(() => {
    const cargaInicial = async () => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        if (firebaseUser) {
          if (ls_user && Object.keys(ls_user).length > 0) {
            console.log("user context entro ", ls_user);
            setState((prevState) => ({
              ...prevState,
              user: ls_user,
              isAuthenticated: true,
            }));
          }
        }
      });
      setLoading(false);
      return () => unsubscribe();
    };
    cargaInicial();
    console.log("recarga contexto", loading);
  }, [ls_user]);

  const loginUser = async (email, password) => {
    try {
      const user = await DBContext.login(email, password);
      saveItem(user);
      setState({
        user,
        isAuthenticated: true,
      });
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setState({
        user: null,
        isAuthenticated: false,
      });
    }
  };

  const logout = async () => {
    try {
      await DBContext.logout();
      saveItem({});
      setState({
        user: null,
        isAuthenticated: false,
      });
      await auth.signOut();
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        state,
        loginUser,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
