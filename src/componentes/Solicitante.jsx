import React from 'react';
import CierraSesion from './CierraSesion'; // Actualizado a CierraSesion

const Solicitante = () => {
    return (
        <div>
            <h2>Solicitante</h2>
            <p>Bienvenido solicitante. Aquí puedes solicitar un box.</p>
            <CierraSesion setUsuarioLogueado={() => { }} /> {/* Actualizado para usar CierraSesion */}
        </div>
    );
};

export default Solicitante;

