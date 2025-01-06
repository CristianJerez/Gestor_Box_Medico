import React, { useState, useEffect } from 'react';
import './GestionPasillos.css';
import { collection, addDoc, deleteDoc, doc, getDocs, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

const GestionPasillo = () => {
    const [pasillos, setPasillos] = useState([]);
    const [nuevoPasillo, setNuevoPasillo] = useState({ numero_pasillo: '', especialidad: '', jefe_pasillo: '', anexo_telefono: '' });
    const [editando, setEditando] = useState(null);
    const [errores, setErrores] = useState({});

    const pasillosCollectionRef = collection(db, 'pasillos');

    // Leer pasillos desde Firestore
    useEffect(() => {
        const obtenerPasillos = async () => {
            const data = await getDocs(pasillosCollectionRef);
            setPasillos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        };
        obtenerPasillos();
    }, []);

    // Validadores
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!/^[0-9]+$/.test(nuevoPasillo.numero_pasillo)) {
            nuevosErrores.numero_pasillo = 'El número de pasillo debe contener solo números.';
        }

        if (!nuevoPasillo.especialidad || nuevoPasillo.especialidad.length <= 5) {
            nuevosErrores.especialidad = 'La especialidad debe tener más de 5 caracteres y ser texto.';
        }

        if (!nuevoPasillo.jefe_pasillo || nuevoPasillo.jefe_pasillo.length <= 6) {
            nuevosErrores.jefe_pasillo = 'El nombre del jefe de pasillo debe tener más de 6 caracteres.';
        }

        if (!/^[0-9]{6,}$/.test(nuevoPasillo.anexo_telefono)) {
            nuevosErrores.anexo_telefono = 'El anexo telefónico debe tener al menos 6 números.';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Crear o actualizar pasillo
    const guardarPasillo = async () => {
        if (!validarFormulario()) return;

        if (editando) {
            await updateDoc(doc(db, 'pasillos', editando), nuevoPasillo);
            setEditando(null);
        } else {
            await addDoc(pasillosCollectionRef, nuevoPasillo);
        }

        setNuevoPasillo({ numero_pasillo: '', especialidad: '', jefe_pasillo: '', anexo_telefono: '' });
        window.location.reload();
    };

    // Eliminar pasillo
    const eliminarPasillo = async (id) => {
        await deleteDoc(doc(db, 'pasillos', id));
        window.location.reload();
    };

    // Iniciar edición de pasillo
    const editarPasillo = (pasillo) => {
        setNuevoPasillo({
            numero_pasillo: pasillo.numero_pasillo,
            especialidad: pasillo.especialidad,
            jefe_pasillo: pasillo.jefe_pasillo,
            anexo_telefono: pasillo.anexo_telefono,
        });
        setEditando(pasillo.id);
    };

    return (
        <div className="gestion-pasillo">
            <h1>Gestión de Pasillos</h1>
            <div className="formulario">
                <input
                    type="text"
                    placeholder="Número de Pasillo"
                    value={nuevoPasillo.numero_pasillo}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, numero_pasillo: e.target.value })}
                />
                {errores.numero_pasillo && <span className="error">{errores.numero_pasillo}</span>}

                <input
                    type="text"
                    placeholder="Especialidad"
                    value={nuevoPasillo.especialidad}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, especialidad: e.target.value })}
                />
                {errores.especialidad && <span className="error">{errores.especialidad}</span>}

                <input
                    type="text"
                    placeholder="Jefe de Pasillo"
                    value={nuevoPasillo.jefe_pasillo}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, jefe_pasillo: e.target.value })}
                />
                {errores.jefe_pasillo && <span className="error">{errores.jefe_pasillo}</span>}

                <input
                    type="text"
                    placeholder="Anexo Telefónico"
                    value={nuevoPasillo.anexo_telefono}
                    onChange={(e) => setNuevoPasillo({ ...nuevoPasillo, anexo_telefono: e.target.value })}
                />
                {errores.anexo_telefono && <span className="error">{errores.anexo_telefono}</span>}

                <div className="botones">
                    <button onClick={guardarPasillo}>{editando ? 'Actualizar' : 'Guardar'}</button>
                    <button onClick={() => setNuevoPasillo({ numero_pasillo: '', especialidad: '', jefe_pasillo: '', anexo_telefono: '' })}>Cancelar</button>
                </div>
            </div>

            <div className="lista-pasillos">
                <h2>Lista de Pasillos</h2>
                {pasillos.map((pasillo) => (
                    <div key={pasillo.id} className="pasillo">
                        <p>
                            {pasillo.numero_pasillo} - {pasillo.especialidad} - {pasillo.jefe_pasillo} - {pasillo.anexo_telefono}
                        </p>
                        <div className="acciones">
                            <button onClick={() => editarPasillo(pasillo)}>Editar</button>
                            <button onClick={() => eliminarPasillo(pasillo.id)}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GestionPasillo;
