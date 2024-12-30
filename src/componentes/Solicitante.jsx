import React from "react";
import { useNavigate } from "react-router-dom";
import CierraSesion from './CierraSesion';

const Solicitante = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Solicitante</h2>
            <p>Bienvenido solicitante. Aquí puedes solicitar un box.</p>
            <button onClick={() => navigate('/solicitar-box')}>Solicitar Box</button>
            <button onClick={() => navigate('/ver-reservas')}>Mis Reservas</button>
            <CierraSesion setUsuarioLogueado={() => { }} />
        </div>
    );
};

export default Solicitante;



