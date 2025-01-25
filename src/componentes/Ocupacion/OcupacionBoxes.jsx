import React, { useEffect, useState, useRef } from "react";
import { DBContext } from "../../DBContext";
import "./OcupacionBoxes.css";

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
        const pasillosSnapshot = await DBContext.getPasillos();
        setPasillos(pasillosSnapshot);

        // Obtener datos de boxes
        const boxesSnapshot = await DBContext.getBoxes();
        setBoxes(boxesSnapshot);

        // Obtener datos de reservas
        const reservasSnapshot = await DBContext.getReservas();
        setReservas(reservasSnapshot);

        // Calcular ocupación inicial para la fecha seleccionada
        const pasilloOcupacion = calcularOcupacionPasillos(
          boxesSnapshot,
          reservasSnapshot,
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

//   // Calcular promedio de ocupación diaria por pasillo
//   const calcularOcupacionPasillos = (boxes, reservas, fecha) => {
//     const pasilloData = {};

//     // Iterar sobre los boxes
//     boxes.forEach((box) => {
//       // Calcular la ocupación de cada box para la fecha dada
//       const porcentajeOcupacionBox = calcularPorcentajeOcupacionBox(box, fecha);

//       // Si el pasillo del box no está en pasilloData, inicializarlo
//       if (!pasilloData[box.pasilloId]) {
//         pasilloData[box.pasilloId] = {
//           totalBoxes: 0,
//           porcentajeTotal: 0,
//         };
//       }

//       // Incrementar el total de boxes y sumar la ocupación del box al porcentaje total
//       pasilloData[box.pasilloId].totalBoxes += 1;
//       pasilloData[box.pasilloId].porcentajeTotal += porcentajeOcupacionBox;
//     });

//     // Calcular el promedio de ocupación para cada pasillo
//     return Object.entries(pasilloData).map(([pasilloId, datos]) => {
//       const promedioOcupacion =
//         datos.totalBoxes > 0
//           ? Math.round(datos.porcentajeTotal / datos.totalBoxes)
//           : 0;

//       return {
//         pasilloId,
//         porcentajeOcupacion: promedioOcupacion,
//       };
//     });
//   };

const calcularOcupacionPasillos = (boxes, reservas, fecha) => {
    const pasilloData = {};
  
    boxes.forEach((box) => {
      const porcentajeOcupacionBox = calcularPorcentajeOcupacionBox(box, fecha);
  
      if (!pasilloData[box.pasilloId]) {
        pasilloData[box.pasilloId] = { totalBoxes: 0, porcentajeTotal: 0 };
      }
  
      pasilloData[box.pasilloId].totalBoxes += 1;
      pasilloData[box.pasilloId].porcentajeTotal += porcentajeOcupacionBox;
    });
  
    return Object.entries(pasilloData).map(([pasilloId, datos]) => {
      const promedioOcupacion =
        datos.totalBoxes > 0 ? Math.round(datos.porcentajeTotal / datos.totalBoxes) : 0;
  
      console.log(`Pasillo ${pasilloId}:`, {
        totalBoxes: datos.totalBoxes,
        porcentajeTotal: datos.porcentajeTotal,
        promedioOcupacion,
      });
  
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

  const printRef = useRef();
  const printHandled = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };
  return (
    <div className="container-ocupacion">
      <button onClick={printHandled}>Imprimir</button>

      <div ref={printRef} className="print-container">
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
                  width: "95%",
                }}
              >
                <p>
                  <strong>Box:</strong> {box.numero}
                </p>
                <p>
                  <strong>Pasillo:</strong>{" "}
                  {obtenerNombrePasillo(box.pasilloId)}
                </p>
                <p>
                  <strong>Horario Disponible:</strong>{" "}
                  {`${box.horaInicio} - ${box.horaFin}`}
                </p>
                <p>
                  <strong>Porcentaje de Ocupación:</strong>{" "}
                  {porcentajeOcupacion}%
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
                width: "95%",
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
    </div>
  );
};

export { OcupacionBoxes };
