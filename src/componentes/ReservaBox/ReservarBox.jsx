import React, { useCallback, useContext, useEffect, useState } from "react";
import { DBContext } from "../../DBContext";
import { UserContext } from "../../context/UserContext";
import "./ReservarBox.css";

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
  const [horariosBloqueados, setHorariosBloqueados] = useState([]);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);

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
  const fetchMisReservas = useCallback(async () => {
    try {
      const response = await DBContext.getMisReservas(state.user.id);
      const reservasConDetalle = await Promise.all(
        response.map(async (reserva) => {
          const box = listaBoxes.find((box) => box.id === reserva.boxId) || {};
          const pasillo =
            listaPasillos.find((pasillo) => pasillo.id === box.pasilloId) || {};
          return {
            ...reserva,
            boxNumero: box.numero || "Desconocido",
            pasilloNumero: pasillo.numero_pasillo || "Desconocido",
          };
        })
      );
      setListaReservas(reservasConDetalle);
    } catch (err) {
      setError("Error al cargar reservas: " + err.message);
    }
  }, [state.user.id, listaBoxes, listaPasillos]);

  useEffect(() => {
    fetchPasillos();
    fetchBoxes();
  }, []);

  useEffect(() => {
    if (listaBoxes.length > 0 && listaPasillos.length > 0) {
      fetchMisReservas();
    }
  }, [listaBoxes, listaPasillos, fetchMisReservas]);

  // Manejar selección de pasillo
  const handlePasilloChange = (pasilloId) => {
    setPasilloSeleccionado(pasilloId);
    const filteredBoxes = listaBoxes.filter(
      (box) => box.pasilloId === pasilloId
    );
    setBoxSeleccionado("");
    setListaBoxes(filteredBoxes.length > 0 ? filteredBoxes : listaBoxes);
  };

  // Reservar o actualizar box
  const handleReservarBox = async () => {
    try {
      if (!boxSeleccionado || !fecha || !horaInicio || !horaFin) {
        setError("Todos los campos son obligatorios.");
        return;
      }

      let nuevaHoraFin = horaFin;
      if (
        horariosDisponibles.length > 0 &&
        horaFin !== horariosDisponibles[horariosDisponibles.length - 1]
      ) {
        const hour = horaFin.split(":")[0];
        const nueva_hora = parseInt(hour, 10) - 1; // Asegurar tipo numérico
        nuevaHoraFin = `${nueva_hora.toString().padStart(2, "0")}:59`;
      }

      const reservaData = {
        boxId: boxSeleccionado,
        usuarioId: state.user.id,
        fecha,
        horaInicio,
        horaFin: nuevaHoraFin,
        estado: true,
      };

      await DBContext.addReserva(reservaData);
      setSuccess("Box reservado con éxito.");
      fetchMisReservas();
      setPasilloSeleccionado("");
      setBoxSeleccionado("");
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
    } catch (err) {
      setError("Error al reservar el box: " + err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await DBContext.deleteReserva(id);
      setListaReservas((prevReservas) =>
        prevReservas.filter((r) => r.id !== id)
      );
      setSuccess("Reserva eliminada con éxito.");
    } catch (error) {
      setError("Error al eliminar la reserva: " + error.message);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  const generateHourList = (start, end) => {
    const startHour = parseInt(start.split(":")[0], 10);
    const endHour = parseInt(end.split(":")[0], 10);
    const hours = [];

    for (let i = startHour; i <= endHour; i++) {
      const hour = i.toString().padStart(2, "0") + ":00";
      hours.push(hour);
    }

    return hours;
  };

  const handleFechaChange = async (fecha) => {
    const response = await DBContext.getReservasActuales(
      boxSeleccionado,
      fecha
    );
    const response_box = await DBContext.getBox(boxSeleccionado);

    console.log("boxSeleccionado", boxSeleccionado, response_box);

    const horarios = response.map((reserva) => ({
      start: reserva.horaInicio,
      end: reserva.horaFin,
    }));

    // console.log("test", response_box.horaInicio, response_box.horaFin);

    const hourList = generateHourList(
      response_box.horaInicio,
      response_box.horaFin
    );
    setHorariosDisponibles(hourList);
    console.log("hourList", hourList);

    setFecha(fecha);
    setHorariosBloqueados(horarios);
  };

  const isHourBlocked = (hour) => {
    return horariosBloqueados.some(
      ({ start, end }) => hour >= start && hour <= end
    );
  };

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleTimeChangeFin = (e) => {
    const selectedTime = e.target.value;

    if (timeToMinutes(selectedTime) <= timeToMinutes(horaInicio)) {
      setError("Hora de fin no puede ser menor o igual a la hora de inicio.");
      setHoraFin(""); // Limpiar el valor
    } else {
      setError(""); // Limpiar error
      setHoraFin(selectedTime); // Actualizar el tiempo seleccionado
    }
  };

  return (
    <div className="cuerpo-reservas">
      <div className="container-reservas">
        <h1>Reservar Box</h1>
        <div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <div className="formulario-reservas">
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
                onChange={(e) => handleFechaChange(e.target.value)}
                min={today}
                disabled={!boxSeleccionado}
              />
            </div>

            <div>
              <label>Hora de inicio:</label>
              <select
                value={horaInicio}
                disabled={!fecha}
                onChange={(e) => setHoraInicio(e.target.value)}
              >
                <option key="" value="" disabled>
                  Seleccione una hora
                </option>
                {horariosDisponibles.map((hour) => (
                  <option
                    key={hour}
                    value={hour}
                    disabled={isHourBlocked(hour)}
                  >
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Hora de fin:</label>
              <select
                value={horaFin}
                disabled={!fecha}
                onChange={handleTimeChangeFin}
              >
                <option key="" value="" disabled>
                  Seleccione una hora
                </option>
                {horariosDisponibles.map((hour) => (
                  <option
                    key={hour}
                    value={hour}
                    disabled={isHourBlocked(hour)}
                  >
                    {hour}
                  </option>
                ))}
              </select>
            </div>
            <div className="botones-reservas">
              <button onClick={handleReservarBox}>Reservar Box</button>
            </div>
          </div>

          <h2>Mis Reservas</h2>
          <div className="lista-reservas">
            {listaReservas.map((reserva) => (
              <div key={reserva.id} className="info-reservas">
                <p>
                  {`Pasillo: ${reserva.pasilloNumero}, Box: ${reserva.boxNumero}, Fecha: ${reserva.fecha}, Horario: ${reserva.horaInicio} - ${reserva.horaFin}`}
                </p>
                <div className="acciones-reservas">
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

                  <button onClick={() => handleEliminar(reserva.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ReservarBox };
