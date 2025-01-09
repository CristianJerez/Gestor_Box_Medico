import "./MenuListado.css";

function MenuSolicitante(props) {
    return (
        <div>
            <h1>Menu solicitante</h1>
            <ul className="menu-listado">
                <li>
                    <button onClick={() => props.setRenderizar("ReservarBox")}>
                        {" "}
                        Reservar box
                    </button>
                </li>
                <li>
                    <button onClick={() => props.setRenderizar("verSolicitudes")}>
                        Ver solicitudes
                    </button>
                </li>
            </ul>
        </div>
    );
}

export { MenuSolicitante };
