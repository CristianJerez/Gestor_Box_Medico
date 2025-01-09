import React, { useState, useEffect } from "react";
import { db, auth } from "../FirebaseConfig";
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    query,
    where,
    doc,
    getDoc,
} from "firebase/firestore";

const ReservarBox = () => {
    const [pasillos, setPasillos] = useState([]);
    const [boxes, setBoxes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [pasilloSeleccionado, setPasilloSeleccionado] = useState("");
    const [boxSeleccionado, setBoxSeleccionado] = useState("");
    const [fecha, setFecha] = useState("");
    const [horaInicio, setHoraInicio] = useState("");
    const [horaFin, setHoraFin] = useState("");
    const [editandoReserva, setEditandoReserva] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const pasillosCollectionRef = collection(db, "pasillos");
    const boxesCollectionRef = collection(db, "boxes");
    const reservasCollectionRef = collection(db, "reservas");

    // Función para obtener datos del pasillo
    // const obtenerDatosPasillo = async (pasilloId) => {
    //     try {
    //         const pasilloDocRef = doc(db, "pasillos", pasilloId);
    //         const pasilloDoc = await getDoc(pasilloDocRef);

    //         if (pasilloDoc.exists()) {
    //             return {
    //                 numero: pasilloDoc.data().numero_pasillo,
    //                 nombre: pasilloDoc.data().nombre,
    //             };
    //         } else {
    //             return { numero: "Desconocido", nombre: "Desconocido" };
    //         }
    //     } catch (error) {
    //         console.error("Error al obtener datos del pasillo:", error.message);
    //         return { numero: "Desconocido", nombre: "Desconocido" };
    //     }
    // };

    useEffect(() => {
        const fetchPasillos = async () => {
            try {
                const pasillosSnapshot = await getDocs(pasillosCollectionRef);
                setPasillos(
                    pasillosSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            } catch (error) {
                setError("Error al cargar los pasillos: " + error.message);
            }
        };

        const fetchReservas = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const reservasQuery = query(
                    reservasCollectionRef,
                    where("usuarioId", "==", user.uid)
                );
                const reservasSnapshot = await getDocs(reservasQuery);

                const reservasConDetalles = await Promise.all(
                    reservasSnapshot.docs.map(async (reservaDoc) => {
                        const reserva = { id: reservaDoc.id, ...reservaDoc.data() };

                        // Obtener datos del box
                        const boxDocRef = doc(db, "boxes", reserva.boxId);
                        const boxDoc = await getDoc(boxDocRef);

                        if (boxDoc.exists()) {
                            const boxData = boxDoc.data();

                            // Obtener datos del pasillo
                            const pasilloData = await obtenerDatosPasillo(boxData.pasilloId);

                            reserva.boxNumero = boxData.numero;
                            reserva.pasilloNumero = pasilloData.numero;
                            reserva.pasilloNombre = pasilloData.nombre;
                        } else {
                            reserva.boxNumero = "Desconocido";
                            reserva.pasilloNumero = "Desconocido";
                            reserva.pasilloNombre = "Desconocido";
                        }

                        return reserva;
                    })
                );

                setReservas(reservasConDetalles);
            } catch (error) {
                setError("Error al cargar las reservas: " + error.message);
            }
        };

        fetchPasillos();
        fetchReservas();
    }, []);

    const handlePasilloChange = async (pasilloId) => {
        setPasilloSeleccionado(pasilloId);
        setBoxSeleccionado("");

        if (pasilloId) {
            try {
                const boxesQuery = query(
                    boxesCollectionRef,
                    where("pasilloId", "==", pasilloId)
                );
                const boxesSnapshot = await getDocs(boxesQuery);
                setBoxes(
                    boxesSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            } catch (error) {
                setError("Error al cargar los boxes: " + error.message);
            }
        } else {
            setBoxes([]);
        }
    };

    const handleReservarBox = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                setError("Usuario no autenticado.");
                return;
            }

            if (editandoReserva) {
                await updateDoc(doc(db, "reservas", editandoReserva), {
                    boxId: boxSeleccionado,
                    usuarioId: user.uid,
                    fecha,
                    horaInicio,
                    horaFin,
                    estado: true,
                });
                setSuccess("Reserva actualizada con éxito.");
                setEditandoReserva(null);
            } else {
                await addDoc(reservasCollectionRef, {
                    boxId: boxSeleccionado,
                    usuarioId: user.uid,
                    fecha,
                    horaInicio,
                    horaFin,
                    estado: true,
                });
                setSuccess("Box reservado con éxito.");
            }

            setBoxSeleccionado("");
            setFecha("");
            setHoraInicio("");
            setHoraFin("");
        } catch (error) {
            setError("Error al reservar el box: " + error.message);
        }
    };

    return (
        <div>
            <h1>Reservar Box</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <div>
                <label>Pasillo:</label>
                <select
                    value={pasilloSeleccionado}
                    onChange={(e) => handlePasilloChange(e.target.value)}
                >
                    <option value="">Seleccione un pasillo</option>
                    {pasillos.map((pasillo) => (
                        <option key={pasillo.id} value={pasillo.id}>
                            {`Pasillo ${pasillo.numero_pasillo}`}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Box:</label>
                <select
                    value={boxSeleccionado}
                    onChange={(e) => setBoxSeleccionado(e.target.value)}
                    disabled={!pasilloSeleccionado}
                >
                    <option value="">Seleccione un box</option>
                    {boxes.map((box) => (
                        <option key={box.id} value={box.id}>
                            {`Box ${box.numero}`}
                        </option>
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

            <button onClick={handleReservarBox}>
                {editandoReserva ? "Actualizar Reserva" : "Reservar Box"}
            </button>

            <h2>Mis Reservas</h2>
            {reservas.map((reserva) => (
                <div key={reserva.id}>
                    <p>
                        {`Pasillo: ${reserva.pasilloNumero}, Box: ${reserva.boxNumero}, Fecha: ${reserva.fecha}, Horario: ${reserva.horaInicio} - ${reserva.horaFin}`}
                    </p>
                </div>
            ))}
        </div>
    );
};

export { ReservarBox };
