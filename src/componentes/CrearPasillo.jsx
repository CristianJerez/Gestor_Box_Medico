import React, { useState } from 'react';
import { db } from '../FirebaseConfig'; // Asegúrate de importar la configuración de Firebase
import { collection, addDoc } from 'firebase/firestore';

const CrearPasillo = () => {
    const [pasilloDetails, setPasilloDetails] = useState({
        pasilloNumber: '',
        specialtyName: '',
        corridorHead: '',
        phoneExtension: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasilloDetails({
            ...pasilloDetails,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await addDoc(collection(db, 'corridors'), pasilloDetails);
            alert('Pasillo creado correctamente');
            // Limpiar el formulario
            setPasilloDetails({
                pasilloNumber: '',
                specialtyName: '',
                corridorHead: '',
                phoneExtension: ''
            });
        } catch (error) {
            console.error('Error al crear el pasillo: ', error);
            alert('Error al crear el pasillo');
        }
    };

    return (
        <div>
            <h1>Crear Pasillo</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Número de Pasillo:</label>
                    <input
                        type="text"
                        name="pasilloNumber"
                        value={pasilloDetails.pasilloNumber}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Especialidad Médica:</label>
                    <input
                        type="text"
                        name="specialtyName"
                        value={pasilloDetails.specialtyName}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Nombre de la Jefa de Pasillo:</label>
                    <input
                        type="text"
                        name="corridorHead"
                        value={pasilloDetails.corridorHead}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Anexo Telefónico:</label>
                    <input
                        type="text"
                        name="phoneExtension"
                        value={pasilloDetails.phoneExtension}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit">Crear Pasillo</button>
            </form>
        </div>
    );
};

export default CrearPasillo;
