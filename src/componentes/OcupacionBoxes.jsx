// import React, { useState, useEffect } from "react";
// import { db } from "../FirebaseConfig";
// import { collection, getDocs } from "firebase/firestore";

// const OcupacionBoxes = () => {
//   const [boxes, setBoxes] = useState([]);
//   const [reservas, setReservas] = useState([]);
//   const [ocupacionPasillos, setOcupacionPasillos] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Obtener datos de boxes
//         const boxesSnapshot = await getDocs(collection(db, "boxes"));
//         const boxesData = boxesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBoxes(boxesData);

//         // Obtener datos de reservas
//         const reservasSnapshot = await getDocs(collection(db, "reservas"));
//         const reservasData = reservasSnapshot.docs.map((doc) => doc.data());
//         setReservas(reservasData);

//         // Calcular ocupación por pasillo
//         const pasilloOcupacion = calcularOcupacionPasillos(
//           boxesData,
//           reservasData
//         );
//         setOcupacionPasillos(pasilloOcupacion);
//       } catch (error) {
//         setError("Error al cargar los datos: " + error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calcular porcentaje de ocupación diaria por box
//   const calcularPorcentajeOcupacionBox = (box, fecha) => {
//     const reservasBox = reservas.filter(
//       (reserva) => reserva.boxId === box.id && reserva.fecha === fecha
//     );
//     const tiempoTotal = calcularDiferenciaHoras(box.horaInicio, box.horaFin);
//     const tiempoOcupado = reservasBox.reduce((acumulado, reserva) => {
//       return (
//         acumulado + calcularDiferenciaHoras(reserva.horaInicio, reserva.horaFin)
//       );
//     }, 0);

//     return Math.round((tiempoOcupado / tiempoTotal) * 100) || 0;
//   };

//   // Calcular promedio de ocupación diaria por pasillo
//   const calcularOcupacionPasillos = (boxes, reservas) => {
//     const pasillos = {};
//     const fechaHoy = new Date().toISOString().split("T")[0];

//     boxes.forEach((box) => {
//       const porcentajeOcupacion = calcularPorcentajeOcupacionBox(box, fechaHoy);

//       if (!pasillos[box.pasilloId]) {
//         pasillos[box.pasilloId] = {
//           totalBoxes: 0,
//           porcentajeTotal: 0,
//         };
//       }

//       pasillos[box.pasilloId].totalBoxes += 1;
//       pasillos[box.pasilloId].porcentajeTotal += porcentajeOcupacion;
//     });

//     return Object.entries(pasillos).map(([pasilloId, datos]) => ({
//       pasilloId,
//       porcentajeOcupacion: Math.round(datos.porcentajeTotal / datos.totalBoxes),
//     }));
//   };

//   // Calcular diferencia de horas entre dos horarios (en horas)
//   const calcularDiferenciaHoras = (horaInicio, horaFin) => {
//     const [hInicio, mInicio] = horaInicio.split(":").map(Number);
//     const [hFin, mFin] = horaFin.split(":").map(Number);

//     return hFin + mFin / 60 - (hInicio + mInicio / 60);
//   };

//   const fechaHoy = new Date().toISOString().split("T")[0];

//   return (
//     <div>
//       <h1>Ocupación de Boxes y Pasillos</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <h2>Boxes</h2>
//       {boxes.map((box) => {
//         const porcentajeOcupacion = calcularPorcentajeOcupacionBox(
//           box,
//           fechaHoy
//         );
//         return (
//           <div
//             key={box.id}
//             style={{
//               border: "1px solid black",
//               margin: "10px",
//               padding: "10px",
//             }}
//           >
//             <p>
//               <strong>Box:</strong> {box.numero}
//             </p>
//             <p>
//               <strong>Pasillo:</strong> {box.pasilloId}
//             </p>
//             <p>
//               <strong>Horario Disponible:</strong>{" "}
//               {`${box.horaInicio} - ${box.horaFin}`}
//             </p>
//             <p>
//               <strong>Porcentaje de Ocupación Hoy:</strong>{" "}
//               {porcentajeOcupacion}%
//             </p>
//           </div>
//         );
//       })}

//       <h2>Pasillos</h2>
//       {ocupacionPasillos.map((pasillo) => (
//         <div
//           key={pasillo.pasilloId}
//           style={{ border: "1px solid black", margin: "10px", padding: "10px" }}
//         >
//           <p>
//             <strong>Pasillo:</strong> {pasillo.pasilloId}
//           </p>
//           <p>
//             <strong>Porcentaje Promedio de Ocupación:</strong>{" "}
//             {pasillo.porcentajeOcupacion}%
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export { OcupacionBoxes };
//________________________________________________________________________________________________________________________

// import React, { useState, useEffect } from "react";
// import { db } from "../FirebaseConfig";
// import { collection, getDocs } from "firebase/firestore";

// const OcupacionBoxes = () => {
//   const [boxes, setBoxes] = useState([]);
//   const [reservas, setReservas] = useState([]);
//   const [pasillos, setPasillos] = useState([]); // Agregar estado para pasillos
//   const [ocupacionPasillos, setOcupacionPasillos] = useState([]);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Obtener datos de pasillos
//         const pasillosSnapshot = await getDocs(collection(db, "pasillos"));
//         const pasillosData = pasillosSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setPasillos(pasillosData);

//         // Obtener datos de boxes
//         const boxesSnapshot = await getDocs(collection(db, "boxes"));
//         const boxesData = boxesSnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBoxes(boxesData);

//         // Obtener datos de reservas
//         const reservasSnapshot = await getDocs(collection(db, "reservas"));
//         const reservasData = reservasSnapshot.docs.map((doc) => doc.data());
//         setReservas(reservasData);

//         // Calcular ocupación por pasillo
//         const pasilloOcupacion = calcularOcupacionPasillos(
//           boxesData,
//           reservasData
//         );
//         setOcupacionPasillos(pasilloOcupacion);
//       } catch (error) {
//         setError("Error al cargar los datos: " + error.message);
//       }
//     };

//     fetchData();
//   }, []);

//   // Calcular minutos entre dos horarios
//   const calcularDiferenciaMinutos = (horaInicio, horaFin) => {
//     const [hInicio, mInicio] = horaInicio.split(":").map(Number);
//     const [hFin, mFin] = horaFin.split(":").map(Number);

//     const inicio = hInicio * 60 + mInicio;
//     const fin = hFin * 60 + mFin;

//     return fin > inicio ? fin - inicio : 24 * 60 - inicio + fin; // Maneja cruces de medianoche
//   };

//   // Calcular porcentaje de ocupación diaria por box
//   const calcularPorcentajeOcupacionBox = (box, fecha) => {
//     const reservasBox = reservas.filter(
//       (reserva) => reserva.boxId === box.id && reserva.fecha === fecha
//     );

//     if (!reservasBox.length || !box.horaInicio || !box.horaFin) return 0;

//     const tiempoTotal = calcularDiferenciaMinutos(box.horaInicio, box.horaFin);
//     const tiempoOcupado = reservasBox.reduce((acumulado, reserva) => {
//       return (
//         acumulado +
//         calcularDiferenciaMinutos(reserva.horaInicio, reserva.horaFin)
//       );
//     }, 0);

//     return Math.round((tiempoOcupado / tiempoTotal) * 100);
//   };

//   // Calcular promedio de ocupación diaria por pasillo
//   const calcularOcupacionPasillos = (boxes, reservas) => {
//     const pasillos = {};
//     const fechaHoy = new Date().toISOString().split("T")[0];

//     boxes.forEach((box) => {
//       const porcentajeOcupacion = calcularPorcentajeOcupacionBox(box, fechaHoy);

//       if (!pasillos[box.pasilloId]) {
//         pasillos[box.pasilloId] = {
//           totalBoxes: 0,
//           porcentajeTotal: 0,
//         };
//       }

//       pasillos[box.pasilloId].totalBoxes += 1;
//       pasillos[box.pasilloId].porcentajeTotal += porcentajeOcupacion;
//     });

//     return Object.entries(pasillos).map(([pasilloId, datos]) => ({
//       pasilloId,
//       porcentajeOcupacion: Math.round(datos.porcentajeTotal / datos.totalBoxes),
//     }));
//   };

//   const obtenerNombrePasillo = (pasilloId) => {
//     const pasillo = pasillos.find((p) => p.id === pasilloId);
//     return pasillo ? pasillo.numero_pasillo || "Desconocido" : "Desconocido";
//   };

//   const fechaHoy = new Date().toISOString().split("T")[0];

//   return (
//     <div>
//       <h1>Ocupación de Boxes y Pasillos</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <h2>Boxes</h2>
//       {boxes.length === 0 ? (
//         <p>No hay boxes registrados.</p>
//       ) : (
//         boxes.map((box) => {
//           const porcentajeOcupacion = calcularPorcentajeOcupacionBox(
//             box,
//             fechaHoy
//           );
//           return (
//             <div
//               key={box.id}
//               style={{
//                 border: "1px solid black",
//                 margin: "10px",
//                 padding: "10px",
//               }}
//             >
//               <p>
//                 <strong>Box:</strong> {box.numero}
//               </p>
//               <p>
//                 <strong>Pasillo:</strong> {obtenerNombrePasillo(box.pasilloId)}
//               </p>
//               <p>
//                 <strong>Horario Disponible:</strong>{" "}
//                 {`${box.horaInicio} - ${box.horaFin}`}
//               </p>
//               <p>
//                 <strong>Porcentaje de Ocupación Hoy:</strong>{" "}
//                 {porcentajeOcupacion}%
//               </p>
//             </div>
//           );
//         })
//       )}

//       <h2>Pasillos</h2>
//       {ocupacionPasillos.length === 0 ? (
//         <p>No hay datos de ocupación para los pasillos.</p>
//       ) : (
//         ocupacionPasillos.map((pasillo) => (
//           <div
//             key={pasillo.pasilloId}
//             style={{
//               border: "1px solid black",
//               margin: "10px",
//               padding: "10px",
//             }}
//           >
//             <p>
//               <strong>Pasillo:</strong> {obtenerNombrePasillo(pasillo.pasilloId)}
//             </p>
//             <p>
//               <strong>Porcentaje Promedio de Ocupación:</strong>{" "}
//               {pasillo.porcentajeOcupacion}%
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export { OcupacionBoxes };

import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../FirebaseConfig";

const OcupacionBoxes = () => {
  const [boxes, setBoxes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pasillos, setPasillos] = useState([]);
  const [ocupacionPasillos, setOcupacionPasillos] = useState([]);
  const [error, setError] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split("T")[0]
  ); // Fecha seleccionada por el usuario

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos de pasillos
        const pasillosSnapshot = await getDocs(collection(db, "pasillos"));
        const pasillosData = pasillosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPasillos(pasillosData);

        // Obtener datos de boxes
        const boxesSnapshot = await getDocs(collection(db, "boxes"));
        const boxesData = boxesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBoxes(boxesData);

        // Obtener datos de reservas
        const reservasSnapshot = await getDocs(collection(db, "reservas"));
        const reservasData = reservasSnapshot.docs.map((doc) => doc.data());
        setReservas(reservasData);

        // Calcular ocupación inicial para la fecha seleccionada
        const pasilloOcupacion = calcularOcupacionPasillos(
          boxesData,
          reservasData,
          fechaSeleccionada
        );
        setOcupacionPasillos(pasilloOcupacion);
      } catch (error) {
        setError("Error al cargar los datos: " + error.message);
      }
    };

    fetchData();
  }, [fechaSeleccionada]); // Recalcula cuando cambia la fecha seleccionada

  // Calcular minutos entre dos horarios
  const calcularDiferenciaMinutos = (horaInicio, horaFin) => {
    const [hInicio, mInicio] = horaInicio.split(":").map(Number);
    const [hFin, mFin] = horaFin.split(":").map(Number);

    const inicio = hInicio * 60 + mInicio;
    const fin = hFin * 60 + mFin;

    return fin > inicio ? fin - inicio : 24 * 60 - inicio + fin; // Maneja cruces de medianoche
  };

  // Calcular porcentaje de ocupación diaria por box
  const calcularPorcentajeOcupacionBox = (box, fecha) => {
    const reservasBox = reservas.filter(
      (reserva) => reserva.boxId === box.id && reserva.fecha === fecha
    );

    if (!reservasBox.length || !box.horaInicio || !box.horaFin) return 0;

    const tiempoTotal = calcularDiferenciaMinutos(box.horaInicio, box.horaFin);
    const tiempoOcupado = reservasBox.reduce((acumulado, reserva) => {
      return (
        acumulado +
        calcularDiferenciaMinutos(reserva.horaInicio, reserva.horaFin)
      );
    }, 0);

    return Math.round((tiempoOcupado / tiempoTotal) * 100);
  };

  // Calcular promedio de ocupación diaria por pasillo
  const calcularOcupacionPasillos = (boxes, reservas, fecha) => {
    const pasilloData = {};

    // Iterar sobre los boxes
    boxes.forEach((box) => {
      // Calcular la ocupación de cada box para la fecha dada
      const porcentajeOcupacionBox = calcularPorcentajeOcupacionBox(box, fecha);

      // Si el pasillo del box no está en pasilloData, inicializarlo
      if (!pasilloData[box.pasilloId]) {
        pasilloData[box.pasilloId] = {
          totalBoxes: 0,
          porcentajeTotal: 0,
        };
      }

      // Incrementar el total de boxes y sumar la ocupación del box al porcentaje total
      pasilloData[box.pasilloId].totalBoxes += 1;
      pasilloData[box.pasilloId].porcentajeTotal += porcentajeOcupacionBox;
    });

    // Calcular el promedio de ocupación para cada pasillo
    return Object.entries(pasilloData).map(([pasilloId, datos]) => {
      const promedioOcupacion =
        datos.totalBoxes > 0
          ? Math.round(datos.porcentajeTotal / datos.totalBoxes)
          : 0;

      return {
        pasilloId,
        porcentajeOcupacion: promedioOcupacion,
      };
    });
  };

  const obtenerNombrePasillo = (pasilloId) => {
    const pasillo = pasillos.find((p) => p.id === pasilloId);
    return pasillo ? pasillo.numero_pasillo || "Desconocido" : "Desconocido";
  };

  return (
    <div>
      <h1>Ocupación de Boxes y Pasillos</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label htmlFor="fecha">Seleccionar Fecha:</label>
        <input
          id="fecha"
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      <h2>Boxes</h2>
      {boxes.length === 0 ? (
        <p>No hay boxes registrados.</p>
      ) : (
        boxes.map((box) => {
          const porcentajeOcupacion = calcularPorcentajeOcupacionBox(
            box,
            fechaSeleccionada
          );
          return (
            <div
              key={box.id}
              style={{
                border: "1px solid black",
                margin: "10px",
                padding: "10px",
              }}
            >
              <p>
                <strong>Box:</strong> {box.numero}
              </p>
              <p>
                <strong>Pasillo:</strong> {obtenerNombrePasillo(box.pasilloId)}
              </p>
              <p>
                <strong>Horario Disponible:</strong>{" "}
                {`${box.horaInicio} - ${box.horaFin}`}
              </p>
              <p>
                <strong>Porcentaje de Ocupación:</strong> {porcentajeOcupacion}%
              </p>
            </div>
          );
        })
      )}

      <h2>Pasillos</h2>
      {ocupacionPasillos.length === 0 ? (
        <p>No hay datos de ocupación para los pasillos.</p>
      ) : (
        ocupacionPasillos.map((pasillo) => (
          <div
            key={pasillo.pasilloId}
            style={{
              border: "1px solid black",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>
              <strong>Pasillo:</strong>{" "}
              {obtenerNombrePasillo(pasillo.pasilloId)}
            </p>
            <p>
              <strong>Porcentaje Promedio de Ocupación:</strong>{" "}
              {pasillo.porcentajeOcupacion}%
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export { OcupacionBoxes };
