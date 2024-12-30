// GestionPasillosBoxes.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const GestionPasillosBoxes = () => {
    const [pasillos, setPasillos] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [nuevoPasillo, setNuevoPasillo] = useState({ numero: '', especialidad: '', jefe: '', telefono: '' });
    const [nuevoBox, setNuevoBox] = useState({ numero: '', pasillo: '', tieneCamilla: false, tieneEscritorio: false });
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
                setError('Error al cargar datos: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Crear un nuevo pasillo
    const handleCrearPasillo = async () => {
        setError('');
        if (!nuevoPasillo.numero || !nuevoPasillo.especialidad || !nuevoPasillo.jefe || !nuevoPasillo.telefono) {
            setError('Por favor, completa todos los campos del pasillo.');
            return;
        }

        try {
            await addDoc(collection(db, 'pasillos'), nuevoPasillo);
            alert('Pasillo creado con éxito');
            setNuevoPasillo({ numero: '', especialidad: '', jefe: '', telefono: '' });
            const pasillosSnapshot = await getDocs(collection(db, 'pasillos'));
            const pasillosList = pasillosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPasillos(pasillosList);
        } catch (error) {
            setError('Error al crear el pasillo: ' + error.message);
        }
    };

    // Crear un nuevo box
    const handleCrearBox = async () => {
        setError('');
        if (!nuevoBox.numero || !nuevoBox.pasillo) {
            setError('Por favor, completa todos los campos del box.');
            return;
        }

        try {
            await addDoc(collection(db, 'boxes'), nuevoBox);
            alert('Box creado con éxito');
            setNuevoBox({ numero: '', pasillo: '', tieneCamilla: false, tieneEscritorio: false });
            const boxesSnapshot = await getDocs(collection(db, 'boxes'));
            const boxesList = boxesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBoxes(boxesList);
        } catch (error) {
            setError('Error al crear el box: ' + error.message);
        }
    };

    // Eliminar un pasillo
    const handleEliminarPasillo = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este pasillo?")) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'pasillos', id));
            alert('Pasillo eliminado con éxito');
            setPasillos(pasillos.filter(pasillo => pasillo.id !== id));
        } catch (error) {
            setError('Error al eliminar el pasillo: ' + error.message);
        }
    };

    // Eliminar un box
    const handleEliminarBox = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este box?")) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'boxes', id));
            alert('Box eliminado con éxito');
            setBoxes(boxes.filter(box => box.id !== id));
        } catch (error) {
            setError('Error al eliminar el box: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Gestión de Pasillos y Boxes</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Formulario para crear pasillos */}
            <div>
                <h2>Crear Pasillo</h2>
                <input
                    type="text"
                    placeholder="Número de pasillo"
                    value={nuevoPasillo.numero}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, numero: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Especialidad"
                    value={nuevoPasillo.especialidad}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, especialidad: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Jefe de pasillo"
                    value={nuevoPasillo.jefe}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, jefe: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Teléfono"
                    value={nuevoPasillo.telefono}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, telefono: e.target.value })}
                />
                <button onClick={handleCrearPasillo}>Crear Pasillo</button>
            </div>

            {/* Formulario para crear boxes */}
            <div>
                <h2>Crear Box</h2>
                <input
                    type="text"
                    placeholder="Número de box"
                    value={nuevoBox.numero}
                    onChange={(e) => setNuevoBox({ ...nuevoBox, numero: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Pasillo asignado"
                    value={nuevoBox.pasillo}
                    onChange={(e) => setNuevoBox({ ...nuevoBox, pasillo: e.target.value })}
                />
                <label>
                    <input
                        type="checkbox"
                        checked={nuevoBox.tieneCamilla}
                        onChange={(e) => setNuevoBox({ ...nuevoBox, tieneCamilla: e.target.checked })}
                    />
                    Tiene camilla
                </label>
                <label>
                    <input
                        type="checkbox"
                        checked={nuevoBox.tieneEscritorio}
                        onChange={(e) => setNuevoBox({ ...nuevoBox, tieneEscritorio: e.target.checked })}
                    />
                    Tiene escritorio
                </label>
                <button onClick={handleCrearBox}>Crear Box</button>
            </div>

            {/* Listado de pasillos */}
            <div>
                <h2>Lista de Pasillos</h2>
                {pasillos.map((pasillo) => (
                    <div key={pasillo.id}>
                        <p>{`Número: ${pasillo.numero}, Especialidad: ${pasillo.especialidad}, Jefe: ${pasillo.jefe}, Teléfono: ${pasillo.telefono}`}</p>
                        <button onClick={() => handleEliminarPasillo(pasillo.id)}>Eliminar</button>
                    </div>
                ))}
            </div>

            {/* Listado de boxes */}
            <div>
                <h2>Lista de Boxes</h2>
                {boxes.map((box) => (
                    <div key={box.id}>
                        <p>{`Número: ${box.numero}, Pasillo: ${box.pasillo}, Camilla: ${box.tieneCamilla ? 'Sí' : 'No'}, Escritorio: ${box.tieneEscritorio ? 'Sí' : 'No'}`}</p>
                        <button onClick={() => handleEliminarBox(box.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GestionPasillosBoxes;
