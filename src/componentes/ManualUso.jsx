import React from "react";

const ManualUso = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Manual de Uso del Sistema de Gestión de Box Clínicos</h1>
      <p>
        Bienvenido al sistema de gestión de box clínicos. Este manual está
        diseñado para guiarte a través de las funcionalidades disponibles y cómo
        utilizarlas de manera eficiente.
      </p>

      <h2>Acceso al Sistema</h2>
      <ol>
        <li>
          Inicia sesión con tu correo electrónico y contraseña registrados en el
          sistema.
        </li>
        <li>
          Si no tienes una cuenta, contacta al administrador para registrarte.
        </li>
      </ol>

      <h2>Navegación por el Menú</h2>
      <p>En el menú principal encontrarás las siguientes opciones:</p>
      <ul>
        <li>
          <strong>Inicio:</strong> Visualiza un resumen de los boxes disponibles
          y estadísticas relevantes.
        </li>
        <li>
          <strong>Solicitar Box:</strong> Accede al formulario para reservar un
          box clínico.
        </li>
        <li>
          <strong>Historial:</strong> Consulta tus solicitudes anteriores y su
          estado.
        </li>
        <li>
          <strong>Manual de Uso:</strong> Visualiza esta guía para resolver
          dudas sobre el sistema.
        </li>
        <li>
          <strong>Cerrar Sesión:</strong> Sal del sistema de forma segura.
        </li>
      </ul>

      <h2>Cómo Solicitar un Box</h2>
      <ol>
        <li>Haz clic en la opción "Solicitar Box" del menú.</li>
        <li>
          Selecciona la especialidad médica requerida (por ejemplo, neurología,
          cardiología, endocrinología).
        </li>
        <li>
          Escoge una fecha y hora disponibles en el calendario interactivo.
        </li>
        <li>
          Confirma la solicitud revisando los detalles y haz clic en "Enviar
          Solicitud".
        </li>
      </ol>
      <p>
        Nota: El sistema validará automáticamente la disponibilidad del box
        seleccionado y te notificará en caso de conflictos.
      </p>

      <h2>Visualización de Estadísticas</h2>
      <p>
        En la página de inicio, podrás visualizar estadísticas sobre la
        ocupación de boxes, como:
      </p>
      <ul>
        <li>Porcentaje de ocupación por pasillo.</li>
        <li>Disponibilidad actual de boxes.</li>
        <li>Estadísticas generales de uso.</li>
      </ul>

      <h2>Gestión de tu Historial</h2>
      <p>En la sección "Historial" puedes:</p>
      <ul>
        <li>Revisar tus solicitudes previas.</li>
        <li>
          Ver el estado actual de cada solicitud (pendiente, confirmada,
          completada).
        </li>
      </ul>

      <h2>Soporte</h2>
      <p>
        Si encuentras problemas al usar el sistema, por favor contacta al
        administrador a través del correo soporte@gestionbox.cl o llama al
        número +56 9 1234 5678.
      </p>

      <p style={{ marginTop: "20px", fontWeight: "bold" }}>
        ¡Gracias por utilizar el sistema de gestión de box clínicos!
      </p>
    </div>
  );
};

export {ManualUso} ;
