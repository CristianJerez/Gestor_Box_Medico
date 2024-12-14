import React, { useState } from 'react';
import { db } from '../FirebaseConfig'; // Asegúrate de importar la configuración de Firebase
import { collection, addDoc } from 'firebase/firestore';

const CrearBox = () => {
    const [boxDetails, setBoxDetails] = useState({
        boxNumber: '',
        hasBed: false,
        hasDesk: false,
        chairs: '',
        hasComputer: false,
        hasPrinter: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setBoxDetails({
            ...boxDetails,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'boxes'), boxDetails);
            alert('Box clínico creado correctamente');
            // Limpiar el formulario
            setBoxDetails({
                boxNumber: '',
                hasBed: false,
                hasDesk: false,
                chairs: '',
                hasComputer: false,
                hasPrinter: false
            });
        } catch (error) {
            console.error('Error al crear el box clínico: ', error);
            alert('Error al crear el box clínico');
        }
    };

    return (
        <div>
            <h1>Crear Box Clínico</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Número de Box:</label>
                    <input
                        type="text"
                        name="boxNumber"
                        value={boxDetails.boxNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>¿Tiene Camilla?</label>
                    <input
                        type="checkbox"
                        name="hasBed"
                        checked={boxDetails.hasBed}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>¿Tiene Escritorio?</label>
                    <input
                        type="checkbox"
                        name="hasDesk"
                        checked={boxDetails.hasDesk}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>¿Cuántas sillas tiene?</label>
                    <input
                        type="number"
                        name="chairs"
                        value={boxDetails.chairs}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>¿Tiene Computador?</label>
                    <input
                        type="checkbox"
                        name="hasComputer"
                        checked={boxDetails.hasComputer}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>¿Tiene Impresora?</label>
                    <input
                        type="checkbox"
                        name="hasPrinter"
                        checked={boxDetails.hasPrinter}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">Crear Box Clínico</button>
            </form>
        </div>
    );
};

export default CrearBox;

