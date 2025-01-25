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
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pasillosSnapshot = await DBContext.getPasillos();
        setPasillos(pasillosSnapshot);

        const boxesSnapshot = await DBContext.getBoxes();
        setBoxes(boxesSnapshot);

        const reservasSnapshot = await DBContext.getReservas();
        setReservas(reservasSnapshot);
      } catch (error) {
        setError("Error al cargar los datos: " + error.message);
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (boxes.length > 0 && reservas.length > 0 && pasillos.length > 0) {
      const pasilloOcupacion = calcularOcupacionPasillos(
        boxes,
        reservas,
        fechaSeleccionada
      );
      setOcupacionPasillos(pasilloOcupacion);
    }
  }, [boxes, reservas, pasillos, fechaSeleccionada]); // Actualiza al cambiar datos o fecha

  const calcularDiferenciaMinutos = (horaInicio, horaFin) => {
    const [hInicio, mInicio] = horaInicio.split(":").map(Number);
    const [hFin, mFin] = horaFin.split(":").map(Number);
    const inicio = hInicio * 60 + mInicio;
    const fin = hFin * 60 + mFin;
    return fin > inicio ? fin - inicio : 24 * 60 - inicio + fin;
  };

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
        datos.totalBoxes > 0
          ? Math.round(datos.porcentajeTotal / datos.totalBoxes)
          : 0;

      return { pasilloId, porcentajeOcupacion: promedioOcupacion };
    });
  };

  const manejarCambioFecha = (nuevaFecha) => {
    // Forzar actualización
    setFechaSeleccionada("");
    setTimeout(() => {
      setFechaSeleccionada(nuevaFecha);
    }, 0);
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
            onChange={(e) => manejarCambioFecha(e.target.value)}
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
                  <strong>Pasillo:</strong> {obtenerNombrePasillo(box.pasilloId)}
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
