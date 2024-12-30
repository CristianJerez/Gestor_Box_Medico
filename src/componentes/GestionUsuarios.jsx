// GestionUsuarios.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig'; // Importa la configuración de Firebase
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [nuevoUsuario, setNuevoUsuario] = useState({ email: '', password: '', role: 'solicitante' });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Cargar usuarios desde Firestore
    useEffect(() => {
        const fetchUsuarios = async () => {
            setLoading(true);
            try {
                const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
                const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUsuarios(usuariosList);
            } catch (error) {
                setError('Error al cargar usuarios: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    // Crear un nuevo usuario
    const handleCrearUsuario = async () => {
        setError('');
        // Validación de campos
        if (!nuevoUsuario.email || !nuevoUsuario.role) {
            setError('Por favor, completa todos los campos antes de crear un usuario.');
            return;
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(nuevoUsuario.email)) {
            setError('Por favor, ingresa un correo electrónico válido.');
            return;
        }

        try {
            await addDoc(collection(db, 'usuarios'), {
                email: nuevoUsuario.email,
                role: nuevoUsuario.role,
                status: 'activo',
            });
            alert('Usuario creado con éxito');
            setNuevoUsuario({ email: '', password: '', role: 'solicitante' });
            const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
            const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsuarios(usuariosList);
        } catch (error) {
            setError('Error al crear el usuario: ' + error.message);
        }
    };

    // Eliminar usuario
    const handleEliminarUsuario = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'usuarios', id));
            alert('Usuario eliminado con éxito');
            setUsuarios(usuarios.filter(user => user.id !== id));
        } catch (error) {
            alert('Error al eliminar el usuario: ' + error.message);
        }
    };

    // Actualizar rol del usuario
    const handleActualizarUsuario = async (id, nuevoRol) => {
        try {
            await updateDoc(doc(db, 'usuarios', id), { role: nuevoRol });
            alert('Usuario actualizado con éxito');
            setUsuarios(usuarios.map(user => user.id === id ? { ...user, role: nuevoRol } : user));
        } catch (error) {
            alert('Error al actualizar el usuario: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Gestión de Usuarios</h1>

            {/* Mostrar errores */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Formulario para crear usuarios */}
            <div>
                <h2>Crear Usuario</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                />
                <select
                    value={nuevoUsuario.role}
                    onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })}
                >
                    <option value="solicitante">Solicitante</option>
                    <option value="admin">Administrador</option>
                </select>
                <button onClick={handleCrearUsuario}>Crear Usuario</button>
            </div>

            {/* Indicador de carga */}
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : (
                <div>
                    <h2>Lista de Usuarios</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.email}</td>
                                    <td>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleActualizarUsuario(user.id, e.target.value)}
                                        >
                                            <option value="solicitante">Solicitante</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => handleEliminarUsuario(user.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;
