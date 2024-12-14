import React from "react";

const ListaBox = ({ boxes }) => {
    return (
        <div>
            <h2>Estado de Ocupación de los Box</h2>
            <ul>
                {boxes.map((box, index) => (
                    <li key={index}>
                        {box.nombre} - {box.ocupado ? "Ocupado" : "Disponible"}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ListaBox;

