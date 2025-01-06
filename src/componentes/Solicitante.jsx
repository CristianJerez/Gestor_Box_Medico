import React from "react";
import { useNavigate } from "react-router-dom";
import CierraSesion from './CierraSesion';

const Solicitante = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Solicitante</h2>
            <p>Bienvenido solicitante. Aquí puedes solicitar un box.</p>
            <button onClick={() => navigate('/reservar-box')}>Solicitar Box</button>
            <button onClick={() => navigate('/mis-reservas')}>Mis Reservas</button>
            <button onClick={() => navigate('/gestion-usuarios')}>Gestión de Usuarios</button>
            <button onClick={() => navigate('/gestion-pasillos')}>Gestión de Pasillos</button>
            <button onClick={() => navigate('/gestion-box')}>Gestión de Box</button>
            <button onClick={() => navigate('/ocupacion-boxes')}>Ocupación de Boxes</button>
            <CierraSesion setUsuarioLogueado={() => { }} />
        </div>
    );
};

export default Solicitante;



