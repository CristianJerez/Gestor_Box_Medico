import React, { useState, useEffect } from "react";
import { db, auth } from "../FirebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState("");

  // Función para obtener los datos del pasillo
  const obtenerDatosPasillo = async (pasilloId) => {
    try {
      const pasilloDocRef = doc(db, "pasillos", pasilloId);
      const pasilloDoc = await getDoc(pasilloDocRef);

      if (pasilloDoc.exists()) {
        return {
          numero: pasilloDoc.data().numero_pasillo,
          nombre: pasilloDoc.data().nombre,
        };
      } else {
        return { numero: "Desconocido", nombre: "Desconocido" };
      }
    } catch (error) {
      console.error("Error al obtener datos del pasillo:", error.message);
      return { numero: "Desconocido", nombre: "Desconocido" };
    }
  };

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const reservasQuery = query(
          collection(db, "reservas"),
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

    fetchReservas();
  }, []);

  return (
    <div>
      <h1>Mis Reservas</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {reservas.length > 0 ? (
        reservas.map((reserva) => (
          <div key={reserva.id}>
            <p>
              {`Pasillo: ${reserva.pasilloNumero} (${reserva.pasilloNombre}), Box: ${reserva.boxNumero}, Fecha: ${reserva.fecha}, Horario: ${reserva.horaInicio} - ${reserva.horaFin}`}
            </p>
          </div>
        ))
      ) : (
        <p>No tienes reservas realizadas.</p>
      )}
    </div>
  );
};

export default MisReservas;
