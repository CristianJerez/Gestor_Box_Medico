// SolicitarBox.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../FirebaseConfig'; // Importar auth para el usuario actual
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const SolicitarBox = () => {
    const [boxes, setBoxes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [boxSeleccionado, setBoxSeleccionado] = useState('');
    const [fecha, setFecha] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Cargar boxes y reservas desde Firestore
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError('No se pudo identificar al usuario.');
                    return;
                }

                const boxesSnapshot = await getDocs(collection(db, 'boxes'));
                const boxesList = boxesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setBoxes(boxesList);

                const reservasQuery = query(
                    collection(db, 'reservas'),
                    where('userId', '==', user.uid) // Filtra por el usuario actual
                );
                const reservasSnapshot = await getDocs(reservasQuery);
                const reservasList = reservasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReservas(reservasList);
            } catch (error) {
                setError('Error al cargar los datos: ' + error.message);
            }
        };

        fetchData();
    }, []);

    // Validar disponibilidad
    const validarDisponibilidad = async () => {
        setError('');
        setSuccess('');

        if (!boxSeleccionado || !fecha || !horaInicio || !horaFin) {
            setError('Por favor, completa todos los campos.');
            return false;
        }

        try {
            const reservasQuery = query(
                collection(db, 'reservas'),
                where('boxId', '==', boxSeleccionado),
                where('fecha', '==', fecha)
            );
            const reservasSnapshot = await getDocs(reservasQuery);

            const conflictos = reservasSnapshot.docs.some(doc => {
                const reserva = doc.data();
                return (
                    (horaInicio >= reserva.horaInicio && horaInicio < reserva.horaFin) ||
                    (horaFin > reserva.horaInicio && horaFin <= reserva.horaFin)
                );
            });

            if (conflictos) {
                setError('El box seleccionado no está disponible en el horario especificado.');
                return false;
            }

            return true;
        } catch (error) {
            setError('Error al validar la disponibilidad: ' + error.message);
            return false;
        }
    };

    // Solicitar box
    const handleSolicitarBox = async () => {
        const disponible = await validarDisponibilidad();

        if (!disponible) return;

        try {
            const user = auth.currentUser;
            if (!user) {
                setError('No se pudo identificar al usuario.');
                return;
            }

            await addDoc(collection(db, 'reservas'), {
                userId: user.uid, // Agregar el ID del usuario actual
                boxId: boxSeleccionado,
                fecha,
                horaInicio,
                horaFin,
                estado: 'reservado'
            });
            setSuccess('Box reservado con éxito.');
            setBoxSeleccionado('');
            setFecha('');
            setHoraInicio('');
            setHoraFin('');

            // Actualizar reservas
            const reservasQuery = query(
                collection(db, 'reservas'),
                where('userId', '==', user.uid)
            );
            const reservasSnapshot = await getDocs(reservasQuery);
            const reservasList = reservasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReservas(reservasList);
        } catch (error) {
            setError('Error al reservar el box: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Solicitar Box</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <div>
                <label>Box:</label>
                <select
                    value={boxSeleccionado}
                    onChange={(e) => setBoxSeleccionado(e.target.value)}
                >
                    <option value="">Seleccione un box</option>
                    {boxes.map(box => (
                        <option key={box.id} value={box.id}>{`Box ${box.numero} - Pasillo ${box.pasillo}`}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Fecha:</label>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
            </div>

            <div>
                <label>Hora de inicio:</label>
                <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
            </div>

            <div>
                <label>Hora de fin:</label>
                <input
                    type="time"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                />
            </div>

            <button onClick={handleSolicitarBox}>Solicitar Box</button>

            <button onClick={() => navigate('/')}>Regresar</button>

            <h2>Mis Reservas</h2>
            <div>
                {reservas.length > 0 ? (
                    reservas.map(reserva => (
                        <div key={reserva.id}>
                            <p>{`Box: ${reserva.boxId}`}</p>
                            <p>{`Fecha: ${reserva.fecha}`}</p>
                            <p>{`Horario: ${reserva.horaInicio} - ${reserva.horaFin}`}</p>
                            <p>{`Estado: ${reserva.estado}`}</p>
                        </div>
                    ))
                ) : (
                    <p>No tienes reservas registradas.</p>
                )}
            </div>
        </div>
    );
};

export default SolicitarBox;
