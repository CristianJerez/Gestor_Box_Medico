// src/componentes/CierraSesion.jsx
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const CierraSesion = ({ setUsuarioLogueado }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                setUsuarioLogueado(false); // Actualiza el estado de usuario logueado
                console.log('Usuario desconectado');
                navigate('/'); // Redirige al login
            })
            .catch((error) => {
                console.error('Error al cerrar sesión:', error);
            });
    };

    return <button onClick={handleLogout}>Cerrar sesión</button>;
};

export default CierraSesion;
