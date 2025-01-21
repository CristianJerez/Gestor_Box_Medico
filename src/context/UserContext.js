import React, { createContext, useContext, useEffect, useState } from "react";
import { DBContext } from "../DBContext";
import { useLocalStorage } from "../useLocalStorage";
import { auth } from "../FirebaseConfig";

export const UserContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    isAuthenticated: false,
  });

  const [ls_user, saveItem] = useLocalStorage("user", {});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const storedUser = ls_user || {};
        setState({
          user: storedUser,
          isAuthenticated: true,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
        });
      }
    });

    return () => unsubscribe();
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
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
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

export const useUserContext = () => {
  return useContext(UserContext);
};
