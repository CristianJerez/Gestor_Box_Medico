import "./MenuListado.css";


function MenuSolicitante(props) {
  return (
    <div>
      <h1>Menu solicitante</h1>
      <ul className="menu-listado">
        <li>
          <button onClick={() => props.setRenderizar("reservarBox")}>Reservar box</button>
        </li>
        <li>
          <button onClick={() => props.setRenderizar("ocupacionBoxes")}>Ocupación</button>
        </li>
        <li>
          <button onClick={() => props.setRenderizar("manualUso")}>Manual de Uso</button>
        </li>
      </ul>
    </div>
  );
}

export { MenuSolicitante };
