import "./MenuListado.css";

function MenuAdministrador(props) {
  return (
    <div>
      <h1>Menu Administrador</h1>
      <ul className="menu-listado">
        <li>
          <button onClick={() => props.setRenderizar("gestionUsuario")}>
            Gestión de usuarios
          </button>
        </li>
        <li>
          <button onClick={() => props.setRenderizar("gestionPasillo")}>
            Gestión de Pasillos
          </button>
        </li>
        <li>
          <button onClick={() => props.setRenderizar("gestionBox")}>
            Gestión de boxes
          </button>
        </li>
      </ul>
    </div>
  );
}

export { MenuAdministrador };
