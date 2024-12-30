import { addDoc, collection } from 'firebase/firestore'; // Importamos funciones para agregar documentos y trabajar con colecciones en Firestore
import React, { useState } from 'react'; // Importamos React y el hook useState para manejar estados
import { db } from '../FirebaseConfig'; // Importamos la configuración de Firebase

const CrearBox = () => {
    // Estado inicial para almacenar los detalles del box clínico
    const [boxDetails, setBoxDetails] = useState({
        boxNumber: '', // Número del box clínico
        hasBed: false, // Indica si el box tiene camilla
        hasDesk: false, // Indica si el box tiene escritorio
        chairs: '', // Número de sillas en el box
        hasComputer: false, // Indica si el box tiene computadora
        hasPrinter: false // Indica si el box tiene impresora
    });

    // Maneja los cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target; // Obtenemos los atributos del elemento que generó el evento
        setBoxDetails({
            ...boxDetails, // Mantenemos los valores actuales del estado
            [name]: type === 'checkbox' ? checked : value // Actualizamos el estado dependiendo del tipo de input
        });
    };

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evitamos el comportamiento predeterminado del formulario (recargar la página)

        try {
            // Agregamos un nuevo documento a la colección 'boxes' en Firestore
            await addDoc(collection(db, 'boxes'), boxDetails);
            alert('Box clínico creado correctamente'); // Mostramos un mensaje de éxito al usuario

            // Limpiamos el formulario para que esté listo para otro registro
            setBoxDetails({
                boxNumber: '',
                hasBed: false,
                hasDesk: false,
                chairs: '',
                hasComputer: false,
                hasPrinter: false
            });
        } catch (error) {
            // Capturamos y mostramos errores si el registro falla
            console.error('Error al crear el box clínico: ', error);
            alert('Error al crear el box clínico'); // Mostramos un mensaje de error al usuario
        }
    };

    return (
        <div>
            <h1>Crear Box Clínico</h1>
            {/* Formulario para ingresar los detalles del box */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Número de Box:</label>
                    <input
                        type="text" // Campo de texto para el número del box
                        name="boxNumber"
                        value={boxDetails.boxNumber}
                        onChange={handleChange} // Llama a la función handleChange para actualizar el estado
                        required // Campo obligatorio
                    />
                </div>

                <div>
                    <label>¿Tiene Camilla?</label>
                    <input
                        type="checkbox" // Checkbox para indicar si tiene camilla
                        name="hasBed"
                        checked={boxDetails.hasBed}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>¿Tiene Escritorio?</label>
                    <input
                        type="checkbox" // Checkbox para indicar si tiene escritorio
                        name="hasDesk"
                        checked={boxDetails.hasDesk}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>¿Cuántas sillas tiene?</label>
                    <input
                        type="number" // Campo numérico para indicar el número de sillas
                        name="chairs"
                        value={boxDetails.chairs}
                        onChange={handleChange}
                        required // Campo obligatorio
                    />
                </div>

                <div>
                    <label>¿Tiene Computador?</label>
                    <input
                        type="checkbox" // Checkbox para indicar si tiene computadora
                        name="hasComputer"
                        checked={boxDetails.hasComputer}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>¿Tiene Impresora?</label>
                    <input
                        type="checkbox" // Checkbox para indicar si tiene impresora
                        name="hasPrinter"
                        checked={boxDetails.hasPrinter}
                        onChange={handleChange}
                    />
                </div>

                {/* Botón para enviar el formulario */}
                <button type="submit">Crear Box Clínico</button>
            </form>
        </div>
    );
};

export default CrearBox;

