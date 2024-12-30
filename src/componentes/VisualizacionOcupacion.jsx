// VisualizacionOcupacion.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const VisualizacionOcupacion = () => {
    const [pasillos, setPasillos] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Cargar pasillos y boxes desde Firestore
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Obtener pasillos
                const pasillosSnapshot = await getDocs(collection(db, 'pasillos'));
                const pasillosList = pasillosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPasillos(pasillosList);

                // Obtener boxes
                const boxesSnapshot = await getDocs(collection(db, 'boxes'));
                const boxesList = boxesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBoxes(boxesList);
            } catch (error) {
                setError('Error al cargar los datos: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calcular porcentaje de ocupación por pasillo
    const calcularOcupacionPorPasillo = (pasilloId) => {
        const boxesEnPasillo = boxes.filter(box => box.pasillo === pasilloId);
        const ocupados = boxesEnPasillo.filter(box => box.ocupado).length;
        return ((ocupados / boxesEnPasillo.length) * 100).toFixed(2);
    };

    return (
        <div>
            <h1>Visualización de Ocupación</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {loading ? (
                <p>Cargando datos...</p>
            ) : (
                <div>
                    <h2>Ocupación por Pasillo</h2>
                    {pasillos.map((pasillo) => (
                        <div key={pasillo.id}>
                            <h3>{`Pasillo ${pasillo.numero} - ${pasillo.especialidad}`}</h3>
                            <p>{`Jefe: ${pasillo.jefe}`}</p>
                            <p>{`Teléfono: ${pasillo.telefono}`}</p>
                            <p>{`Porcentaje de ocupación: ${calcularOcupacionPorPasillo(pasillo.id)}%`}</p>
                        </div>
                    ))}

                    <h2>Ocupación por Box</h2>
                    {boxes.map((box) => (
                        <div key={box.id}>
                            <p>{`Box ${box.numero} en Pasillo ${box.pasillo}`}</p>
                            <p>{`Estado: ${box.ocupado ? 'Ocupado' : 'Disponible'}`}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VisualizacionOcupacion;
