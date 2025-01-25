import React, { useEffect, useState } from "react";
import "./GestionPasillos.css";
import { DBContext } from "../../DBContext";

const GestionPasillo = () => {
  const [listaPasillos, setListaPasillos] = useState([]);
  const [nuevoPasillo, setNuevoPasillo] = useState({
    numero_pasillo: "",
    especialidad: "",
    jefe_pasillo: "",
    anexo_telefono: "",
  });
  const [editando, setEditando] = useState(null);
  const [errores, setErrores] = useState({});

  // Fetch inicial de los pasillos
  const fetchData = async () => {
    try {
      const response = await DBContext.getPasillos();
      setListaPasillos(response);
    } catch (error) {
      console.error("Error al obtener los pasillos:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Validaciones
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!/^[0-9]+$/.test(nuevoPasillo.numero_pasillo)) {
      nuevosErrores.numero_pasillo = "El número de pasillo debe ser numérico.";
    }

    if (!nuevoPasillo.especialidad || nuevoPasillo.especialidad.length <= 5) {
      nuevosErrores.especialidad =
        "La especialidad debe tener más de 5 caracteres.";
    }

    if (!nuevoPasillo.jefe_pasillo || nuevoPasillo.jefe_pasillo.length <= 6) {
      nuevosErrores.jefe_pasillo =
        "El jefe de pasillo debe tener más de 6 caracteres.";
    }

    if (!/^[0-9]{6,}$/.test(nuevoPasillo.anexo_telefono)) {
      nuevosErrores.anexo_telefono = "El anexo debe tener al menos 6 dígitos.";
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Guardar o actualizar un pasillo
  const guardarPasillo = async () => {
    if (!validarFormulario()) return;

    try {
      if (editando) {
        await DBContext.editPasillo(editando, {
          numero_pasillo: parseInt(nuevoPasillo.numero_pasillo, 10),
          especialidad: nuevoPasillo.especialidad,
          jefe_pasillo: nuevoPasillo.jefe_pasillo,
          anexo_telefono: nuevoPasillo.anexo_telefono,
        });
        console.log(`Pasillo con ID ${editando} actualizado.`);
      } else {
        await DBContext.addPasillo({
          numero_pasillo: parseInt(nuevoPasillo.numero_pasillo, 10),
          especialidad: nuevoPasillo.especialidad,
          jefe_pasillo: nuevoPasillo.jefe_pasillo,
          anexo_telefono: nuevoPasillo.anexo_telefono,
        });
        console.log("Nuevo pasillo creado.");
      }
      fetchData();
      resetFormulario();
    } catch (error) {
      console.error("Error al guardar el pasillo:", error.message);
    }
  };

  // Resetear formulario
  const resetFormulario = () => {
    setNuevoPasillo({
      numero_pasillo: "",
      especialidad: "",
      jefe_pasillo: "",
      anexo_telefono: "",
    });
    setEditando(null);
    setErrores({});
  };

  // Iniciar edición
  const editarPasillo = (pasillo) => {
    setNuevoPasillo({
      numero_pasillo: pasillo.numero_pasillo.toString(),
      especialidad: pasillo.especialidad,
      jefe_pasillo: pasillo.jefe_pasillo,
      anexo_telefono: pasillo.anexo_telefono,
    });
    setEditando(pasillo.id);
  };

  // Eliminar pasillo
  const eliminarPasillo = async (id) => {
    try {
      await DBContext.deletePasillo(id);
      console.log(`Pasillo con ID ${id} eliminado.`);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar el pasillo:", error.message);
    }
  };

  const handleChangeNroPasillo = async (e) => {
    const num_pasillo = e.target.value;
    console.log("numero pasillo", num_pasillo);
    const response = await DBContext.getPasillo(num_pasillo);
    console.log("numero pasillo val", response, response.length > 0);
    if (response.length > 0) {
      setNuevoPasillo({ ...nuevoPasillo, numero_pasillo: "" });
      setErrores({ numero_pasillo: "El número de pasillo ya existe." });
    } else {
      setNuevoPasillo({ ...nuevoPasillo, numero_pasillo: num_pasillo });
      setErrores({});
    }
  };

  return (
    <div className="cuerpo-usuario">
      <div className="container-pasillos">
        <h1>Gestión de Pasillos</h1>
        <div className="formulario-pasillos">
          <input
            type="text"
            placeholder="Número de Pasillo"
            value={nuevoPasillo.numero_pasillo}
            onChange={handleChangeNroPasillo}
          />
          {errores.numero_pasillo && (
            <span className="error-pasillos">{errores.numero_pasillo}</span>
          )}

          <input
            type="text"
            placeholder="Especialidad"
            value={nuevoPasillo.especialidad}
            onChange={(e) =>
              setNuevoPasillo({ ...nuevoPasillo, especialidad: e.target.value })
            }
          />
          {errores.especialidad && (
            <span className="error-pasillos">{errores.especialidad}</span>
          )}

          <input
            type="text"
            placeholder="Jefe de Pasillo"
            value={nuevoPasillo.jefe_pasillo}
            onChange={(e) =>
              setNuevoPasillo({ ...nuevoPasillo, jefe_pasillo: e.target.value })
            }
          />
          {errores.jefe_pasillo && (
            <span className="error-pasillos">{errores.jefe_pasillo}</span>
          )}

          <input
            type="text"
            placeholder="Anexo Telefónico"
            value={nuevoPasillo.anexo_telefono}
            onChange={(e) =>
              setNuevoPasillo({
                ...nuevoPasillo,
                anexo_telefono: e.target.value,
              })
            }
          />
          {errores.anexo_telefono && (
            <span className="error-pasillos">{errores.anexo_telefono}</span>
          )}

          <div className="botones-pasillo">
            <button className="btn-guardar" onClick={guardarPasillo}>
              {editando ? "Actualizar Pasillo" : "Guardar Pasillo"}
            </button>
            {editando && (
              <button className="btn-cancelar" onClick={resetFormulario}>
                Cancelar
              </button>
            )}
          </div>
        </div>

        <div className="lista-pasillos">
          <h2>Lista de Pasillos</h2>
          {listaPasillos.map((pasillo) => (
            <div key={pasillo.id} className="info-pasillos">
              <p>
                {`Número: ${pasillo.numero_pasillo}, Especialidad: ${pasillo.especialidad}, Jefe: ${pasillo.jefe_pasillo}, Anexo: ${pasillo.anexo_telefono}`}
              </p>
              <div className="acciones-pasillos">
                <button
                  className="btn-editar"
                  onClick={() => editarPasillo(pasillo)}
                >
                  Editar
                </button>
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarPasillo(pasillo.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { GestionPasillo };
