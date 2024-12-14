import React, { useState } from 'react';

function CrearBox() {
    const [nombreBox, setNombreBox] = useState('');
    const [pasillo, setPasillo] = useState('');
    const [horario, setHorario] = useState('');

    const manejarCrearBox = (e) => {
        e.preventDefault();
        // Aquí iría el código para guardar el nuevo box en la base de datos (Firebase)
        console.log({ nombreBox, pasillo, horario });
    };

    return (
        <div>
            <h2>Crear Box</h2>
            <form onSubmit={manejarCrearBox}>
                <div>
                    <label>Nombre del Box</label>
                    <input
                        type="text"
                        value={nombreBox}
                        onChange={(e) => setNombreBox(e.target.value)}
                    />
                </div>
                <div>
                    <label>Pasillo</label>
                    <input
                        type="text"
                        value={pasillo}
                        onChange={(e) => setPasillo(e.target.value)}
                    />
                </div>
                <div>
                    <label>Horario</label>
                    <input
                        type="text"
                        value={horario}
                        onChange={(e) => setHorario(e.target.value)}
                    />
                </div>
                <button type="submit">Crear Box</button>
            </form>
        </div>
    );
}

export default CrearBox;
