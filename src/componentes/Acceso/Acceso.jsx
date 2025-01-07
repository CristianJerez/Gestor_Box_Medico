import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext"; // Contexto para manejar el login
import "./Acceso.css"; // Estilo personalizado para el login

function Acceso() {
    const [email, setEmail] = useState(""); // Estado para el email del usuario
    const [password, setPassword] = useState(""); // Estado para la contraseña del usuario
    const { loginUser } = useContext(UserContext); // Función de login desde el contexto
    const [error, setError] = useState(""); // Estado para manejar errores

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        try {
            await loginUser(email, password); // Intentar loguear al usuario usando el contexto
        } catch (err) {
            setError("Error al iniciar sesión. Verifica tus credenciales.");
        }
    };

    return (
        <div className="pantalla">
            <div className="login-container">
                <form onSubmit={handleSubmit}>
                    <h1>Iniciar sesión</h1>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <br></br>
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br></br>
                    {error && <p className="error">{error}</p>} {/* Mensaje de error */}
                    <button type="submit">Iniciar sesión</button>
                </form>
            </div>
        </div>
    );
}

export { Acceso };

// import React, { useState } from 'react'; // Importamos React y el hook useState para manejar estados locales
// import { auth, db } from '../FirebaseConfig'; // Importamos la configuración de Firebase para autenticación y base de datos
// import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir al usuario después del login

// const Acceso = () => {
//     const [email, setEmail] = useState(''); // Estado para almacenar el correo electrónico ingresado
//     const [password, setPassword] = useState(''); // Estado para almacenar la contraseña ingresada
//     const [error, setError] = useState(''); // Estado para manejar mensajes de error
//     const navigate = useNavigate(); // Hook para redirigir entre páginas

//     // Función para manejar el inicio de sesión
//     const login = async () => {
//         // Validamos que los campos de correo y contraseña no estén vacíos
//         if (!email || !password) {
//             setError('Por favor, completa todos los campos.');
//             return; // Si están vacíos, mostramos un error y detenemos la ejecución
//         }

//         try {
//             // Autenticación del usuario con Firebase
//             const userCredential = await auth.signInWithEmailAndPassword(email, password);
//             const user = userCredential.user; // Obtenemos el usuario autenticado

//             // Consultamos Firestore para verificar el rol del usuario
//             const userDoc = await db.collection('usuarios').doc(user.uid).get();
//             if (userDoc.exists) {
//                 const userData = userDoc.data(); // Obtenemos los datos del usuario desde la base de datos
//                 // Redirigimos al panel correspondiente según el rol del usuario
//                 if (userData.role === 'admin') {
//                     navigate('/admin'); // Si es administrador
//                 } else if (userData.role === 'usuario') {
//                     navigate('/usuario'); // Si es un usuario estándar
//                 } else {
//                     setError('Rol de usuario no definido correctamente.');
//                 }
//             } else {
//                 setError('Usuario no encontrado en la base de datos.');
//             }
//         } catch (err) {
//             // Manejamos errores al iniciar sesión, como usuario o contraseña incorrectos
//             setError(
//                 'Error al iniciar sesión: ' +
//                 (err.code === 'auth/user-not-found'
//                     ? 'Usuario no registrado.'
//                     : err.message)
//             );
//         }
//     };

//     return (
//         <div>
//             <h2>Iniciar sesión</h2>
//             {/* Campo para ingresar el correo electrónico */}
//             <input
//                 type="email"
//                 placeholder="Correo electrónico"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//             />
//             {/* Campo para ingresar la contraseña */}
//             <input
//                 type="password"
//                 placeholder="Contraseña"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             {/* Botón para enviar los datos y llamar a la función login */}
//             <button onClick={login}>Iniciar sesión</button>
//             {/* Mostramos un mensaje de error si existe */}
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//         </div>
//     );
// };

// export default Acceso;
