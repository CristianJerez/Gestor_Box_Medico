import React, { useEffect } from 'react'; // Importamos React y el hook useEffect para manejar efectos secundarios
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para redirigir al usuario si no tiene acceso
import CrearBox from './CrearBox'; // Importamos el componente para crear un box clínico
import CrearPasillo from './CrearPasillo'; // Importamos el componente para crear un pasillo

const Administrador = () => {
    const navigate = useNavigate(); // Hook para redirigir entre páginas

    // Efecto para verificar si el usuario tiene acceso como administrador
    useEffect(() => {
        const userRole = localStorage.getItem('userRole'); // Simulación: obtenemos el rol del usuario desde localStorage
        if (userRole !== 'admin') {
            navigate('/'); // Redirigimos al login si el usuario no es administrador
        }
    }, []); // El arreglo vacío asegura que este efecto solo se ejecute una vez, al cargar el componente

    return (
        <div className="admin-panel">
            <h1>Panel de Administración</h1>
            {/* Sección para crear un box clínico */}
            <div className="admin-section">
                <h2>Crear Box Clínico</h2>
                <CrearBox /> {/* Renderizamos el componente para crear un box clínico */}
            </div>
            {/* Sección para crear un pasillo */}
            <div className="admin-section">
                <h2>Crear Pasillo</h2>
                <CrearPasillo /> {/* Renderizamos el componente para crear un pasillo */}
            </div>
        </div>
    );
};

export default Administrador;

