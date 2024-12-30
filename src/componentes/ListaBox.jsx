import React from "react"; // Importamos React para definir el componente

const ListaBox = ({ boxes }) => {
    return (
        <div>
            <h2>Estado de Ocupación de los Box</h2>
            {/* Verificamos si la lista de boxes está vacía */}
            {boxes.length === 0 ? (
                <p>No hay boxes disponibles.</p> // Mensaje cuando no hay datos
            ) : (
                <ul>
                    {/* Iteramos sobre la lista de boxes */}
                    {boxes.map((box) => (
                        <li
                            key={box.id} // Usamos un identificador único como clave
                            className={box.ocupado ? "box-ocupado" : "box-disponible"}
                        >
                            {/* Mostramos el nombre y estado del box */}
                            {box.nombre} - {box.ocupado ? "Ocupado" : "Disponible"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ListaBox;

