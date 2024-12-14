import React, { useState } from 'react';
import firebase from 'firebase/compat/app';  // Importa firebase de manera global
import 'firebase/compat/auth';               // Asegúrate de importar auth
import 'firebase/compat/firestore';          // Asegúrate de importar firestore
import { auth, db } from '../FirebaseConfig'; // Verifica la ruta a tu archivo de configuración

const CrearUsuario = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('solicitante'); // Por defecto, los usuarios serán solicitantes
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Función para manejar la creación del usuario
    const handleCreateUser = async (e) => {
        e.preventDefault();

        try {
            // Crear el usuario en Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Guardar el usuario en la base de datos Firestore
            await db.collection('usuarios').doc(user.uid).set({
                email: email,
                role: role,
                status: 'pendiente' // Podrías agregar más datos como el estado del usuario
            });

            setSuccess(true);
            setEmail('');
            setPassword('');
            setRole('solicitante');
        } catch (error) {
            setError('Error al crear el usuario: ' + error.message);
        }
    };

    return (
        <div>
            <h2>Crear Nuevo Usuario</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Usuario creado con éxito</p>}
            <form onSubmit={handleCreateUser}>
                <div>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Clave de Acceso</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="role">Rol del Usuario</label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="solicitante">Solicitante</option>
                        <option value="administrador">Administrador</option>
                    </select>
                </div>
                <button type="submit">Crear Usuario</button>
            </form>
        </div>
    );
};

export default CrearUsuario;
