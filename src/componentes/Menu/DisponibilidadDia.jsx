import { useEffect, useState } from "react";
import { DBContext } from "../../DBContext";
import "./DisponibilidadDia.css";

function DisponibilidadDia() {
  const [listaPasillos, setListaPasillos] = useState([]);
  const [listaBoxes, setListaBoxes] = useState([]);
  const [reservasDelDia, setReservasDelDia] = useState([]);
  const [horariosBloqueados, setHorariosBloqueados] = useState([]);

  const Hoy = new Date().toISOString().split("T")[0];
  const HoyTexto = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "numeric",
  });

  const fetchDisponibles = async () => {
    try {
      console.log(Hoy);
      const [response_pasillos, response_boxes, reponse_reservas] =
        await Promise.all([
          DBContext.getPasillos(),
          DBContext.getBoxes(),
          DBContext.getReservasDelDia(Hoy),
        ]);
      setListaPasillos(response_pasillos);
      setListaBoxes(response_boxes);
      setReservasDelDia(reponse_reservas);

      const horasBloqueadasTemp = {};
      for (const box of response_boxes) {
        horasBloqueadasTemp[box.id] = reponse_reservas
          .filter((reserva) => reserva.boxId === box.id)
          .map((reserva) => ({
            start: reserva.horaInicio,
            end: reserva.horaFin,
          }));
      }

      setHorariosBloqueados(horasBloqueadasTemp);
    } catch (error) {
      console.error("Error fetching available boxes: ", error);
    }
  };

  useEffect(() => {
    fetchDisponibles();
  }, []);

  const getBoxesByPasillo = (pasilloId) => {
    return listaBoxes.filter((boxes) => boxes.pasilloId === pasilloId) || [];
  };

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

  const getReservas = async (BoxId) => {
    const response = await DBContext.getReservasActuales(BoxId, Hoy);
    const horarios = response.map((reserva) => ({
      start: reserva.horaInicio,
      end: reserva.horaFin,
    }));

    return horarios || [];
  };

  const isHourBlocked = (boxId, hour) => {
    const reservas = horariosBloqueados[boxId] || [];
    const result = reservas.some(
      ({ start, end }) => hour >= start && hour <= end
    );
    return result;
  };

  return (
    <div className="cuerpo-disponibilidad">
      <h1>Disponibilidad del día</h1>
      <div className="fecha-disponibilidad">
        <h3>{HoyTexto}</h3>
      </div>
      {listaPasillos.map((pasillo) => (
        <div key={pasillo.numero_pasillo} className="pasillo-container">
          <div className="pasillo-header">
            Pasillo Número {pasillo.numero_pasillo} : {pasillo.especialidad}
          </div>
          {getBoxesByPasillo(pasillo.id).map((box, index) => (
            <div key={`${box.numero}-${index}`} className="box-container">
              <h5>Box Número {box.numero}</h5>
              <p>Horarios disponibles:</p>
              <ul className="hour-list">
                {generateHourList(box.horaInicio, box.horaFin).map(
                  (hour, index) => (
                    <li
                      key={`${box.id}-${hour}-${index}`}
                      className={
                        isHourBlocked(box.id, hour)
                          ? "hour-list_unavailable"
                          : "hour-list_li"
                      }
                    >
                      {hour}
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export { DisponibilidadDia };
