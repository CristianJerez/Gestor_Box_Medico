import React from 'react';
import CrearBox from './CrearBox';
import CrearPasillo from './CrearPasillo';

const Administrador = () => {
    return (
        <div>
            <h1>Panel de Administración</h1>
            <div>
                <h2>Crear Box Clínico</h2>
                <CrearBox />
            </div>

            <div>
                <h2>Crear Pasillo</h2>
                <CrearPasillo />
            </div>
        </div>
    );
};

export default Administrador;
