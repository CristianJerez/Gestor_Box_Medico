// src/context/UserContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [usuarioLogueado, setUsuarioLogueado] = useState(false); // Estado de autenticación
    const [usuarioRol, setUsuarioRol] = useState(null); // Estado para el rol del usuario

    return (
        <UserContext.Provider value={{ usuarioLogueado, setUsuarioLogueado, usuarioRol, setUsuarioRol }}>
            {children} {/* Renderiza los componentes hijos */}
        </UserContext.Provider>
    );
};
