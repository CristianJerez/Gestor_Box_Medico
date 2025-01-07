// // src/context/UserContext.js
// import React, { createContext, useState } from 'react';

// // Crear el contexto
// export const UserContext = createContext();

// // Proveedor del contexto
// export const UserProvider = ({ children }) => {
//     const [usuarioLogueado, setUsuarioLogueado] = useState(false); // Estado de autenticación
//     const [usuarioRol, setUsuarioRol] = useState(null); // Estado para el rol del usuario

//     return (
//         <UserContext.Provider value={{ usuarioLogueado, setUsuarioLogueado, usuarioRol, setUsuarioRol }}>
//             {children} {/* Renderiza los componentes hijos */}
//         </UserContext.Provider>
//     );
// };

import React, { createContext, useContext, useState } from "react";
import { DBContext } from "../DBContext";
// Crear el contexto
export const UserContext = createContext();

// Crear el proveedor del contexto
export const AppProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        isAuthenticated: false,
    });

    const loginUser = async (email, password) => {
        try {
            const user = await DBContext.login(email, password);
            if (user && Object.keys(user).length > 0) {
                setState((prevState) => ({
                    ...prevState,
                    user,
                    isAuthenticated: true,
                }));
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
    };

    return (
        <UserContext.Provider value={{ state, loginUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useUserContext = () => {
    return useContext(UserContext);
};