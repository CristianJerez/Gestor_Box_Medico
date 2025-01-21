import React, { useEffect, useState } from "react";
import { DBContext } from "../../DBContext";
import "./GestionBox.css";

const GestionBox = () => {
  const [listaBoxes, setListaBoxes] = useState([]);
  const [listaPasillos, setListaPasillos] = useState([]);
  const [nuevoBox, setNuevoBox] = useState({
    numero: "",
    pasilloId: "",
    disponibilidad: false,
    horaInicio: "",
    horaFin: "",
  });
  const [editando, setEditando] = useState(null);
  const [errores, setErrores] = useState({});

  // Fetch data from Firestore
  const fetchBoxes = async () => {
    try {
      const response = await DBContext.getBoxes();
      setListaBoxes(response);
    } catch (error) {
      console.error("Error al obtener boxes:", error.message);
    }
  };

  const fetchPasillos = async () => {
    try {
      const response = await DBContext.getPasillos();
      setListaPasillos(response);
    } catch (error) {
      console.error("Error al obtener pasillos:", error.message);
    }
  };

  useEffect(() => {
    fetchBoxes();
    fetchPasillos();
  }, []);

  // Validaciones
  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!/^[0-9]+$/.test(nuevoBox.numero)) {
      nuevosErrores.numero = "El número del box debe ser un valor numérico.";
    }
    if (!nuevoBox.pasilloId) {
      nuevosErrores.pasilloId = "Debe seleccionar un pasillo.";
    }
    if (!nuevoBox.horaInicio || !nuevoBox.horaFin) {
      nuevosErrores.horario = "Debe especificar el horario de inicio y fin.";
    } else if (nuevoBox.horaInicio >= nuevoBox.horaFin) {
      nuevosErrores.horario =
        "La hora de inicio debe ser menor que la hora de fin.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar o actualizar box
  const guardarBox = async () => {
    if (!validarFormulario()) return;

    const boxData = {
      numero: parseInt(nuevoBox.numero, 10),
      pasilloId: nuevoBox.pasilloId,
      disponibilidad: nuevoBox.disponibilidad,
      horaInicio: nuevoBox.horaInicio,
      horaFin: nuevoBox.horaFin,
    };

    try {
      if (editando) {
        await DBContext.editBox(editando, boxData);
        console.log(`Box con ID ${editando} actualizado.`);
      } else {
        await DBContext.addBox(boxData);
        console.log("Nuevo box creado.");
      }
      fetchBoxes();
      resetFormulario();
    } catch (error) {
      console.error("Error al guardar el box:", error.message);
    }
  };

  const resetFormulario = () => {
    setNuevoBox({
      numero: "",
      pasilloId: "",
      disponibilidad: false,
      horaInicio: "",
      horaFin: "",
    });
    setEditando(null);
    setErrores({});
  };

  // Iniciar edición de box
  const editarBox = (box) => {
    setNuevoBox({
      numero: box.numero.toString(),
      pasilloId: box.pasilloId,
      disponibilidad: box.disponibilidad,
      horaInicio: box.horaInicio,
      horaFin: box.horaFin,
    });
    setEditando(box.id);
  };

  // Eliminar box
  const eliminarBox = async (id) => {
    try {
      await DBContext.deleteBox(id);
      console.log(`Box con ID ${id} eliminado.`);
      fetchBoxes();
    } catch (error) {
      console.error("Error al eliminar el box:", error.message);
    }
  };

  return (
    <div className="gestion-box">
      <h1>Gestión de Boxes</h1>

      <div className="formulario">
        <input
          type="text"
          placeholder="Número del Box"
          value={nuevoBox.numero}
          onChange={(e) => setNuevoBox({ ...nuevoBox, numero: e.target.value })}
        />
        {errores.numero && <span className="error">{errores.numero}</span>}

        <select
          value={nuevoBox.pasilloId}
          onChange={(e) =>
            setNuevoBox({ ...nuevoBox, pasilloId: e.target.value })
          }
        >
          <option value="">Selecciona un pasillo</option>
          {listaPasillos.map((pasillo) => (
            <option key={pasillo.id} value={pasillo.id}>
              {`Pasillo ${pasillo.numero_pasillo}`}
            </option>
          ))}
        </select>
        {errores.pasilloId && (
          <span className="error">{errores.pasilloId}</span>
        )}

        <label>Hora de inicio</label>
        <input
          type="time"
          value={nuevoBox.horaInicio}
          onChange={(e) =>
            setNuevoBox({ ...nuevoBox, horaInicio: e.target.value })
          }
        />
        <label>Hora de término</label>
        <input
          type="time"
          value={nuevoBox.horaFin}
          onChange={(e) =>
            setNuevoBox({ ...nuevoBox, horaFin: e.target.value })
          }
        />
        <label>Box operativo</label>
        <input
          type="checkbox"
          checked={nuevoBox.disponibilidad}
          onChange={(e) =>
            setNuevoBox({ ...nuevoBox, disponibilidad: e.target.checked })
          }
        />
        {errores.horario && <span className="error">{errores.horario}</span>}

        <div className="botones">
          <button onClick={guardarBox}>
            {editando ? "Actualizar Box" : "Guardar Box"}
          </button>
          {editando && <button onClick={resetFormulario}>Cancelar</button>}
        </div>
      </div>

      <div className="lista-boxes">
        <h2>Lista de Boxes</h2>
        {listaBoxes.map((box) => (
          <div key={box.id} className="box-item">
            <p>
              {`Número: ${box.numero}, Pasillo: ${
                listaPasillos.find((p) => p.id === box.pasilloId)
                  ?.numero_pasillo || "Desconocido"
              }, Horario: ${box.horaInicio} - ${box.horaFin}, ${
                box.disponibilidad ? "Operativo" : "No operativo"
              }`}
            </p>
            <button onClick={() => editarBox(box)}>Editar</button>
            <button onClick={() => eliminarBox(box.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export { GestionBox };
