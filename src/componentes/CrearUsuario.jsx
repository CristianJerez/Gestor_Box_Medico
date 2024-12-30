import React, { useState } from 'react'; // Importamos React y el hook useState para manejar estados
import firebase from 'firebase/compat/app'; // Importamos Firebase para manejar la creación de usuarios
import 'firebase/compat/auth'; // Importamos la funcionalidad de autenticación de Firebase
import 'firebase/compat/firestore'; // Importamos Firestore de Firebase
import { auth, db } from '../FirebaseConfig'; // Importamos la configuración de Firebase para autenticación y base de datos

const CrearUsuario = () => {
    // Estados para manejar el formulario y mensajes
    const [email, setEmail] = useState(''); // Almacena el correo electrónico del usuario
    const [password, setPassword] = useState(''); // Almacena la contraseña del usuario
    const [role, setRole] = useState('solicitante'); // Rol predeterminado del usuario (solicitante)
    const [error, setError] = useState(''); // Almacena mensajes de error
    const [success, setSuccess] = useState(false); // Almacena el estado de éxito

    // Función para manejar la creación de un nuevo usuario
    const handleCreateUser = async (e) => {
        e.preventDefault(); // Evita que el formulario recargue la página

        try {
            // Crea el usuario en Firebase Authentication
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user; // Obtenemos el usuario creado

            // Guarda los datos del usuario en Firestore
            await db.collection('usuarios').doc(user.uid).set({
                email: email, // Correo electrónico del usuario
                role: role, // Rol seleccionado del usuario
                status: 'pendiente' // Estado inicial del usuario, se puede personalizar
            });

            // Si todo se crea correctamente, limpiamos los campos y mostramos el éxito
            setSuccess(true);
            setError(''); // Reseteamos los errores
            setEmail('');
            setPassword('');
            setRole('solicitante'); // Reiniciamos el rol al valor predeterminado
        } catch (error) {
            // Manejo de errores, mostrando el mensaje al usuario
            setError('Error al crear el usuario: ' + error.message);
            setSuccess(false); // Aseguramos que el mensaje de éxito no se muestre
        }
    };

    return (
        <div>
            <h2>Crear Nuevo Usuario</h2>

            {/* Mensaje de error si existe */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Mensaje de éxito si el usuario se creó correctamente */}
            {success && <p style={{ color: 'green' }}>Usuario creado con éxito</p>}

            {/* Formulario para la creación del usuario */}
            <form onSubmit={handleCreateUser}>
                <div>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email" // Campo de correo electrónico
                        id="email"
                        value={email} // Conectado al estado
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado al escribir
                        required // Campo obligatorio
                    />
                </div>
                <div>
                    <label htmlFor="password">Clave de Acceso</label>
                    <input
                        type="password" // Campo de contraseña
                        id="password"
                        value={password} // Conectado al estado
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado al escribir
                        required // Campo obligatorio
                    />
                </div>
                <div>
                    <label htmlFor="role">Rol del Usuario</label>
                    <select
                        id="role"
                        value={role} // Conectado al estado
                        onChange={(e) => setRole(e.target.value)} // Actualiza el estado al seleccionar un rol
                    >
                        {/* Opciones de rol disponibles */}
                        <option value="solicitante">Solicitante</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>
                {/* Botón para enviar el formulario */}
                <button type="submit">Crear Usuario</button>
            </form>
        </div>
    );
};

export default CrearUsuario;
