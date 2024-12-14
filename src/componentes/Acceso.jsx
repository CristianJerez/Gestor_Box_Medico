import React, { useState } from 'react';
import { auth, db } from '../FirebaseConfig';
import { useNavigate } from 'react-router-dom';

const Acceso = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Función para el login
    const login = async () => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Verificar el rol en Firestore
            const userDoc = await db.collection('usuarios').doc(user.uid).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                // Si el usuario es administrador, redirige al panel de administrador
                if (userData.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/usuario'); // Redirige a la página de usuario
                }
            } else {
                setError('Usuario no encontrado en la base de datos.');
            }
        } catch (err) {
            setError('Error al iniciar sesión: ' + err.message);
        }
    };

    return (
        <div>
            <h2>Iniciar sesión</h2>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login}>Iniciar sesión</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default Acceso;
