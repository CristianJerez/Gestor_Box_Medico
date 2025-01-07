// import {
//     addDoc,
//     collection,
//     deleteDoc,
//     doc,
//     getDocs,
//     updateDoc
// } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { db } from "../../FirebaseConfig";
// import "./GestionBox.css";

// const GestionBox = () => {
//     const [boxes, setBoxes] = useState([]);
//     const [nuevoBox, setNuevoBox] = useState({
//         numero: "",
//         pasilloId: "",
//         disponibilidad: true,
//         horaInicio: "",
//         horaFin: "",
//     });
//     const [editando, setEditando] = useState(null);
//     const [pasillos, setPasillos] = useState([]);
//     const [numeroPasillos, setNumeroPasillos] = useState({});

//     const boxesCollectionRef = collection(db, "boxes");
//     const pasillosCollectionRef = collection(db, "pasillos");

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // Cargar pasillos
//                 const pasillosSnapshot = await getDocs(pasillosCollectionRef);
//                 const pasillosList = pasillosSnapshot.docs.map((doc) => ({
//                     id: doc.id,
//                     ...doc.data(),
//                 }));
//                 setPasillos(pasillosList);

//                 // Crear un mapa de ID de pasillo a número de pasillo
//                 const pasilloMap = {};
//                 pasillosList.forEach((pasillo) => {
//                     pasilloMap[pasillo.id] = pasillo.numero_pasillo;
//                 });
//                 setNumeroPasillos(pasilloMap);

//                 // Cargar boxes
//                 const boxesSnapshot = await getDocs(boxesCollectionRef);
//                 setBoxes(boxesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//             } catch (error) {
//                 console.error("Error al cargar datos:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     const handleGuardarBox = async () => {
//         const { numero, pasilloId, horaInicio, horaFin } = nuevoBox;

//         // Validaciones
//         if (!numero || isNaN(numero)) {
//             alert("El número del box debe ser un valor numérico.");
//             return;
//         }
//         if (!pasilloId) {
//             alert("Selecciona un pasillo.");
//             return;
//         }
//         if (!horaInicio || !horaFin) {
//             alert("Por favor, completa las horas de inicio y término.");
//             return;
//         }
//         if (horaInicio >= horaFin) {
//             alert("La hora de inicio debe ser menor que la hora de término.");
//             return;
//         }

//         try {
//             if (editando) {
//                 // Actualizar box existente
//                 await updateDoc(doc(db, "boxes", editando), nuevoBox);
//                 setEditando(null);
//                 alert("Box actualizado con éxito.");
//             } else {
//                 // Crear nuevo box
//                 await addDoc(boxesCollectionRef, nuevoBox);
//                 alert("Box creado con éxito.");
//             }

//             setNuevoBox({ numero: "", pasilloId: "", disponibilidad: true, horaInicio: "", horaFin: "" });
//             const boxesSnapshot = await getDocs(boxesCollectionRef);
//             setBoxes(boxesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//         } catch (error) {
//             console.error("Error al guardar el box:", error);
//             alert("Error al guardar el box.");
//         }
//     };

//     const handleEliminarBox = async (id) => {
//         try {
//             await deleteDoc(doc(db, "boxes", id));
//             setBoxes(boxes.filter((box) => box.id !== id));
//             alert("Box eliminado con éxito.");
//         } catch (error) {
//             console.error("Error al eliminar el box:", error);
//             alert("Error al eliminar el box.");
//         }
//     };

//     const handleEditarBox = (box) => {
//         setNuevoBox({
//             numero: box.numero,
//             pasilloId: box.pasilloId,
//             disponibilidad: box.disponibilidad,
//             horaInicio: box.horaInicio,
//             horaFin: box.horaFin,
//         });
//         setEditando(box.id);
//     };

//     return (
//         <div className="gestion-box">
//             <h1>Gestión de Boxes</h1>

//             <div className="formulario">
//                 <input
//                     type="text"
//                     placeholder="Número del Box"
//                     value={nuevoBox.numero}
//                     onChange={(e) => setNuevoBox({ ...nuevoBox, numero: e.target.value })}
//                 />
//                 <select
//                     value={nuevoBox.pasilloId}
//                     onChange={(e) => setNuevoBox({ ...nuevoBox, pasilloId: e.target.value })}
//                 >
//                     <option value="">Selecciona un pasillo</option>
//                     {pasillos.map((pasillo) => (
//                         <option key={pasillo.id} value={pasillo.id}>
//                             {`Pasillo ${pasillo.numero_pasillo}`}
//                         </option>
//                     ))}
//                 </select>
//                 <label>Hora de inicio</label>
//                 <input
//                     type="time"
//                     value={nuevoBox.horaInicio}
//                     onChange={(e) => setNuevoBox({ ...nuevoBox, horaInicio: e.target.value })}
//                 />
//                 <label>Hora de término</label>
//                 <input
//                     type="time"
//                     value={nuevoBox.horaFin}
//                     onChange={(e) => setNuevoBox({ ...nuevoBox, horaFin: e.target.value })}
//                 />
//                 <button onClick={handleGuardarBox}>{editando ? "Actualizar Box" : "Guardar Box"}</button>
//                 {editando && (
//                     <button
//                         onClick={() => {
//                             setNuevoBox({ numero: "", pasilloId: "", disponibilidad: true, horaInicio: "", horaFin: "" });
//                             setEditando(null);
//                         }}
//                     >
//                         Cancelar
//                     </button>
//                 )}
//             </div>

//             <div className="lista-boxes">
//                 <h2>Lista de Boxes</h2>
//                 {boxes.map((box) => (
//                     <div key={box.id} className="box-item">
//                         <p>{`Número: ${box.numero}, Pasillo: ${numeroPasillos[box.pasilloId] || "Desconocido"}, Horario: ${box.horaInicio} - ${box.horaFin}`}</p>
//                         <button onClick={() => handleEditarBox(box)}>Editar</button>
//                         <button onClick={() => handleEliminarBox(box.id)}>Eliminar</button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export { GestionBox };

import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../useGlobal';
import './GestionBox.css';

const GestionBox = () => {
    const {
        listaBoxes,
        listaPasillos,
        getBoxes,
        getPasillos,
        addBox,
        updateBox,
        deleteBox
    } = useGlobal();

    const [nuevoBox, setNuevoBox] = useState({
        numero: '',
        pasilloId: '',
        disponibilidad: true,
        horaInicio: '',
        horaFin: '',
    });
    const [editando, setEditando] = useState(null);
    const [errores, setErrores] = useState({});

    useEffect(() => {
        getBoxes();
        getPasillos();
    }, []);

    // Validaciones
    const validarFormulario = () => {
        const nuevosErrores = {};

        if (!/^[0-9]+$/.test(nuevoBox.numero)) {
            nuevosErrores.numero = 'El número del box debe ser un valor numérico.';
        }
        if (!nuevoBox.pasilloId) {
            nuevosErrores.pasilloId = 'Debe seleccionar un pasillo.';
        }
        if (!nuevoBox.horaInicio || !nuevoBox.horaFin) {
            nuevosErrores.horario = 'Debe especificar el horario de inicio y fin.';
        } else if (nuevoBox.horaInicio >= nuevoBox.horaFin) {
            nuevosErrores.horario = 'La hora de inicio debe ser menor que la hora de fin.';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    // Guardar o actualizar box
    const guardarBox = async () => {
        if (!validarFormulario()) return;

        if (editando) {
            await updateBox(editando, nuevoBox);
            setEditando(null);
        } else {
            await addBox(nuevoBox);
        }

        setNuevoBox({ numero: '', pasilloId: '', disponibilidad: true, horaInicio: '', horaFin: '' });
    };

    // Iniciar edición de box
    const editarBox = (box) => {
        setNuevoBox({
            numero: box.numero,
            pasilloId: box.pasilloId,
            disponibilidad: box.disponibilidad,
            horaInicio: box.horaInicio,
            horaFin: box.horaFin,
        });
        setEditando(box.id);
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
                    onChange={(e) => setNuevoBox({ ...nuevoBox, pasilloId: e.target.value })}
                >
                    <option value="">Selecciona un pasillo</option>
                    {listaPasillos.map((pasillo) => (
                        <option key={pasillo.id} value={pasillo.id}>
                            {`Pasillo ${pasillo.numero_pasillo}`}
                        </option>
                    ))}
                </select>
                {errores.pasilloId && <span className="error">{errores.pasilloId}</span>}

                <label>Hora de inicio</label>
                <input
                    type="time"
                    value={nuevoBox.horaInicio}
                    onChange={(e) => setNuevoBox({ ...nuevoBox, horaInicio: e.target.value })}
                />
                <label>Hora de término</label>
                <input
                    type="time"
                    value={nuevoBox.horaFin}
                    onChange={(e) => setNuevoBox({ ...nuevoBox, horaFin: e.target.value })}
                />
                {errores.horario && <span className="error">{errores.horario}</span>}

                <div className="botones">
                    <button onClick={guardarBox}>{editando ? 'Actualizar Box' : 'Guardar Box'}</button>
                    {editando && (
                        <button
                            onClick={() => {
                                setNuevoBox({ numero: '', pasilloId: '', disponibilidad: true, horaInicio: '', horaFin: '' });
                                setEditando(null);
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            <div className="lista-boxes">
                <h2>Lista de Boxes</h2>
                {listaBoxes.map((box) => (
                    <div key={box.id} className="box-item">
                        <p>{`Número: ${box.numero}, Pasillo: ${listaPasillos.find((p) => p.id === box.pasilloId)?.numero_pasillo || 'Desconocido'}, Horario: ${box.horaInicio} - ${box.horaFin}`}</p>
                        <button onClick={() => editarBox(box)}>Editar</button>
                        <button onClick={() => deleteBox(box.id)}>Eliminar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export { GestionBox };
