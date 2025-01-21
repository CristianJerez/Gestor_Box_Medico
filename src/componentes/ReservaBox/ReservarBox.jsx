// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import React, { useContext, useEffect, useState } from "react";
// import Select from "react-select";
// import { DBContext } from "../../DBContext";
// import { db } from "../../FirebaseConfig";
// import { UserContext } from "../../context/UserContext";
// import "./ReservarBox.css";

// const ReservarBox = () => {
//   const { state } = useContext(UserContext);
//   const [listaPasillos, setListaPasillos] = useState([]);
//   const [boxes, setBoxes] = useState([]);
//   const [listaReservas, setListaReservas] = useState([]);
//   const [listaBoxes, setListaBoxes] = useState([]);
//   const [pasilloSeleccionado, setPasilloSeleccionado] = useState("");
//   const [boxSeleccionado, setBoxSeleccionado] = useState("");
//   const [fecha, setFecha] = useState("");
//   const [selectedOptions, setSelectedOptions] = useState([]);
//   const [editandoReserva, setEditandoReserva] = useState(null);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [disabledMultiple, setDisabledMultiple] = useState(false);

//   // Función para obtener los datos del pasillo
//   const obtenerDatosPasillo = async (pasilloId) => {
//     try {
//       const pasilloDocRef = doc(db, "pasillos", pasilloId);
//       const pasilloDoc = await getDoc(pasilloDocRef);

//       if (pasilloDoc.exists()) {
//         return {
//           numero: pasilloDoc.data().numero_pasillo,
//           nombre: pasilloDoc.data().nombre,
//         };
//       } else {
//         return { numero: "Desconocido", nombre: "Desconocido" };
//       }
//     } catch (error) {
//       console.error("Error al obtener datos del pasillo:", error.message);
//       return { numero: "Desconocido", nombre: "Desconocido" };
//     }
//   };

//   // Obtener reservas del usuario con detalles del box y pasillo
//   const fetchReservas = async () => {
//     try {
//       const reservasQuery = query(
//         collection(db, "reservas"),
//         where("usuarioId", "==", state.user.id)
//       );
//       const reservasSnapshot = await getDocs(reservasQuery);

//       const reservasConDetalles = await Promise.all(
//         reservasSnapshot.docs.map(async (reservaDoc) => {
//           const reserva = { id: reservaDoc.id, ...reservaDoc.data() };

//           // Obtener datos del box
//           const boxDocRef = doc(db, "boxes", reserva.boxId);
//           const boxDoc = await getDoc(boxDocRef);

//           if (boxDoc.exists()) {
//             const boxData = boxDoc.data();

//             // Obtener datos del pasillo
//             const pasilloData = await obtenerDatosPasillo(boxData.pasilloId);

//             reserva.boxNumero = boxData.numero;
//             reserva.pasilloNumero = pasilloData.numero;
//             reserva.pasilloNombre = pasilloData.nombre;
//           } else {
//             reserva.boxNumero = "Desconocido";
//             reserva.pasilloNumero = "Desconocido";
//             reserva.pasilloNombre = "Desconocido";
//           }

//           return reserva;
//         })
//       );

//       setListaReservas(reservasConDetalles);
//     } catch (error) {
//       console.error("Error al cargar las reservas:", error.message);
//     }
//   };

//   useEffect(() => {
//     fetchReservas();
//     fetchPasillos();
//     fetchBoxes();
//   }, []);

//   const fetchPasillos = async () => {
//     try {
//       const response = await DBContext.getPasillos();
//       setListaPasillos(response || []);
//     } catch (error) {
//       console.error("Error al obtener pasillos:", error);
//     }
//   };

//   const fetchBoxes = async () => {
//     try {
//       const response = await DBContext.getBoxes();
//       setListaBoxes(response || []);
//     } catch (error) {
//       console.error("Error al obtener boxes:", error);
//     }
//   };

//   const handleReservarBox = async () => {
//     try {
//       if (!boxSeleccionado || !fecha || selectedOptions.length === 0) {
//         setError("Todos los campos son obligatorios.");
//         return;
//       }

//       const horasSeleccionadas = selectedOptions.map((option) => option.value);

//       if (editandoReserva) {
//         await DBContext.editReserva(editandoReserva, {
//           boxId: boxSeleccionado,
//           usuarioId: state.user.id,
//           fecha,
//           horas: horasSeleccionadas,
//           estado: true,
//         });
//         setSuccess("Reserva actualizada con éxito.");
//         setEditandoReserva(null);
//       } else {
//         await DBContext.addReserva({
//           boxId: boxSeleccionado,
//           usuarioId: state.user.id,
//           fecha,
//           horas: horasSeleccionadas,
//           estado: true,
//         });
//         setSuccess("Box reservado con éxito.");
//       }

//       setBoxSeleccionado("");
//       setFecha("");
//       setSelectedOptions([]);
//       fetchReservas(); // Recargar reservas después de agregar una nueva
//     } catch (error) {
//       setError("Error al reservar el box: " + error.message);
//     }
//   };

//   const handlePasilloChange = (pasilloId) => {
//     setPasilloSeleccionado(pasilloId);
//     setBoxSeleccionado("");
//     const filteredBoxes = listaBoxes.filter(
//       (box) => box.pasilloId === pasilloId
//     );
//     setBoxes(filteredBoxes);
//   };

//   const generateTimeOptions = () => {
//     const times = [];
//     for (let i = 8; i <= 20; i++) {
//       const hour = i.toString().padStart(2, "0");
//       times.push({ value: `${hour}:00`, label: `${hour}:00` });
//       times.push({ value: `${hour}:30`, label: `${hour}:30` });
//     }
//     return times;
//   };

//   const timeOptions = generateTimeOptions();

//   const today = new Date();
//   today.setDate(today.getDate() - 1);
//   const yesterday = today.toISOString().split("T")[0];

//   return (
//     <div className="reservar-box">
//       <h1>Reservar Box</h1>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       <div>
//         <label>Pasillo:</label>
//         <select
//           value={pasilloSeleccionado}
//           onChange={(e) => handlePasilloChange(e.target.value)}
//         >
//           <option value="">Seleccione un pasillo</option>
//           {listaPasillos.map((pasillo) => (
//             <option key={pasillo.id} value={pasillo.id}>
//               Pasillo {pasillo.numero_pasillo}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Box:</label>
//         <select
//           value={boxSeleccionado}
//           onChange={(e) => setBoxSeleccionado(e.target.value)}
//           disabled={!pasilloSeleccionado}
//         >
//           <option value="">Seleccione un box</option>
//           {boxes.map((box) => (
//             <option key={box.id} value={box.id}>
//               {`Box ${box.numero}`}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div>
//         <label>Fecha:</label>
//         <input
//           type="date"
//           value={fecha}
//           onChange={(e) => setFecha(e.target.value)}
//           disabled={!boxSeleccionado}
//           min={yesterday}
//         />
//       </div>

//       <div>
//         <label>Horas:</label>
//         <Select
//           options={timeOptions}
//           isMulti
//           closeMenuOnSelect={false}
//           value={selectedOptions}
//           onChange={setSelectedOptions}
//           isDisabled={!fecha}
//         />
//       </div>

//       <button onClick={handleReservarBox}>
//         {editandoReserva ? "Actualizar Reserva" : "Reservar Box"}
//       </button>

//       <h2>Mis Reservas</h2>
//       {listaReservas.length > 0 ? (
//         listaReservas.map((reserva) => (
//           <div key={reserva.id}>
//             <p>
//               {`Pasillo: ${reserva.pasilloNumero} (${
//                 reserva.pasilloNombre
//               }), Box: ${reserva.boxNumero}, Fecha: ${
//                 reserva.fecha
//               }, Horas: ${reserva.horas.join(", ")}`}
//             </p>
//           </div>
//         ))
//       ) : (
//         <p>No tienes reservas realizadas.</p>
//       )}
//     </div>
//   );
// };

// export { ReservarBox };

import React, { useContext, useEffect, useState } from "react";
import "./ReservarBox.css";
import { DBContext } from "../../DBContext";
import { UserContext } from "../../context/UserContext";
import Select from "react-select";

const ReservarBox = () => {
  const { state } = useContext(UserContext);
  const [listaPasillos, setListaPasillos] = useState([]);
  const [listaBoxes, setListaBoxes] = useState([]);
  const [listaReservas, setListaReservas] = useState([]);
  const [pasilloSeleccionado, setPasilloSeleccionado] = useState("");
  const [boxSeleccionado, setBoxSeleccionado] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editandoReserva, setEditandoReserva] = useState(null);


  // Cargar lista de pasillos
  const fetchPasillos = async () => {
    try {
      const response = await DBContext.getPasillos();
      setListaPasillos(response || []);
    } catch (err) {
      setError("Error al cargar pasillos: " + err.message);
    }
  };

  // Cargar lista de boxes
  const fetchBoxes = async () => {
    try {
      const response = await DBContext.getBoxes();
      setListaBoxes(response || []);
    } catch (err) {
      setError("Error al cargar boxes: " + err.message);
    }
  };

  // Cargar reservas del usuario
  const fetchMisReservas = async () => {
    try {
      const response = await DBContext.getMisReservas(state.user.id);
      const reservasConDetalle = await Promise.all(
        response.map(async (reserva) => {
          const box = listaBoxes.find((box) => box.id === reserva.boxId);
          const pasillo = listaPasillos.find(
            (pasillo) => pasillo.id === box.pasilloId
          );
          return {
            ...reserva,
            boxNumero: box ? box.numero : "Desconocido",
            pasilloNumero: pasillo ? pasillo.numero_pasillo : "Desconocido",
          };
        })
      );
      setListaReservas(reservasConDetalle);
    } catch (err) {
      setError("Error al cargar reservas: " + err.message);
    }
  };

  useEffect(() => {
    fetchPasillos();
    fetchBoxes();
    fetchMisReservas();
  }, []);

  // Manejar selección de pasillo
  const handlePasilloChange = (pasilloId) => {
    setPasilloSeleccionado(pasilloId);
    const filteredBoxes = listaBoxes.filter(
      (box) => box.pasilloId === pasilloId
    );
    setBoxSeleccionado("");
    setListaBoxes(filteredBoxes);
  };

  // Reservar o actualizar box
  const handleReservarBox = async () => {
    try {
      if (!boxSeleccionado || !fecha || !horaInicio || !horaFin) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      const reservaData = {
        boxId: boxSeleccionado,
        usuarioId: state.user.id,
        fecha,
        horaInicio,
        horaFin,
        estado: true,
      };

      await DBContext.addReserva(reservaData);
      setSuccess("Box reservado con éxito.");
      fetchMisReservas();
    } catch (err) {
      setError("Error al reservar el box: " + err.message);
    }
  };
  const handleEliminar = async (id) => {
    try {
      await DBContext.deleteReserva(id);
      setListaReservas((prevReservas) => prevReservas.filter((r) => r.id !== id));
      setSuccess("Reserva eliminada con éxito.");
    } catch (error) {
      setError("Error al eliminar la reserva: " + error.message);
    }
  };
  

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="reservar-box">
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
          {listaPasillos.map((pasillo) => (
            <option key={pasillo.id} value={pasillo.id}>
              Pasillo {pasillo.numero_pasillo}
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
          {listaBoxes.map((box) => (
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
          min={today}
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

      <button onClick={handleReservarBox}>Reservar Box</button>

      <h2>Mis Reservas</h2>
{listaReservas.map((reserva) => (
  <div key={reserva.id} className="reserva-item">
    <p>
      {`Pasillo: ${reserva.pasilloNumero}, Box: ${reserva.boxNumero}, Fecha: ${reserva.fecha}, Horario: ${reserva.horaInicio} - ${reserva.horaFin}`}
    </p>
    <div className="reserva-actions">
      {/* Botón de editar */}
      <button
        onClick={() => {
          setEditandoReserva(reserva);
          setPasilloSeleccionado(reserva.pasilloId);
          setBoxSeleccionado(reserva.boxId);
          setFecha(reserva.fecha);
          setHoraInicio(reserva.horaInicio);
          setHoraFin(reserva.horaFin);
        }}
        style={{ marginRight: "10px" }}
      >
        Editar
      </button>

      {/* Botón de eliminar */}
      <button
        onClick={() => handleEliminar(reserva.id)}
        style={{ color: "white", backgroundColor: "red" }}
      >
        Eliminar
      </button>
    </div>
  </div>
))}

    </div>
  );
};

export { ReservarBox };
