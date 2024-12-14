import React from 'react';
import CierraSesion from './CierraSesion'; // Actualizado a CierraSesion

const Administrador = () => {
    return (
        <div>
            <h2>Administrador</h2>
            <p>Bienvenido administrador. Aquí puedes gestionar pasillos y boxes.</p>
            <CierraSesion setUsuarioLogueado={() => { }} /> {/* Actualizado para usar CierraSesion */}
        </div>
    );
};

export default Administrador;
