import React, { useState } from 'react'; // Importamos React y el hook useState para manejar estados
import { db } from '../FirebaseConfig'; // Importamos la configuración de Firebase
import { collection, addDoc } from 'firebase/firestore'; // Importamos funciones para trabajar con Firestore

const CrearPasillo = () => {
    // Estado inicial para almacenar los detalles del pasillo
    const [pasilloDetails, setPasilloDetails] = useState({
        pasilloNumber: '', // Número del pasillo
        specialtyName: '', // Nombre de la especialidad médica asociada al pasillo
        corridorHead: '', // Nombre de la persona encargada del pasillo
        phoneExtension: '' // Extensión telefónica del pasillo
    });

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target; // Obtenemos el nombre y el valor del input
        setPasilloDetails({
            ...pasilloDetails, // Mantenemos los valores actuales del estado
            [name]: value // Actualizamos el campo correspondiente con el nuevo valor
        });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página al enviarse

        try {
            // Agrega un nuevo documento a la colección 'corridors' en Firestore
            await addDoc(collection(db, 'corridors'), pasilloDetails);
            alert('Pasillo creado correctamente'); // Muestra un mensaje de éxito al usuario

            // Limpia el formulario después de crear el pasillo
            setPasilloDetails({
                pasilloNumber: '',
                specialtyName: '',
                corridorHead: '',
                phoneExtension: ''
            });
        } catch (error) {
            // Maneja errores si ocurre algún problema al agregar el documento
            console.error('Error al crear el pasillo: ', error);
            alert('Error al crear el pasillo'); // Muestra un mensaje de error al usuario
        }
    };

    return (
        <div>
            <h1>Crear Pasillo</h1>
            {/* Formulario para ingresar los detalles del pasillo */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Número de Pasillo:</label>
                    <input
                        type="text" // Campo de texto para el número del pasillo
                        name="pasilloNumber"
                        value={pasilloDetails.pasilloNumber}
                        onChange={handleChange} // Llama a la función handleChange al cambiar el valor
                        required // Campo obligatorio
                    />
                </div>

                <div>
                    <label>Especialidad Médica:</label>
                    <input
                        type="text" // Campo de texto para el nombre de la especialidad médica
                        name="specialtyName"
                        value={pasilloDetails.specialtyName}
                        onChange={handleChange}
                        required // Campo obligatorio
                    />
                </div>

                <div>
                    <label>Nombre de la Jefa de Pasillo:</label>
                    <input
                        type="text" // Campo de texto para el nombre de la persona encargada
                        name="corridorHead"
                        value={pasilloDetails.corridorHead}
                        onChange={handleChange}
                        required // Campo obligatorio
                    />
                </div>

                <div>
                    <label>Anexo Telefónico:</label>
                    <input
                        type="text" // Campo de texto para la extensión telefónica
                        name="phoneExtension"
                        value={pasilloDetails.phoneExtension}
                        onChange={handleChange}
                        required // Campo obligatorio
                    />
                </div>

                {/* Botón para enviar el formulario */}
                <button type="submit">Crear Pasillo</button>
            </form>
        </div>
    );
};

export default CrearPasillo;
