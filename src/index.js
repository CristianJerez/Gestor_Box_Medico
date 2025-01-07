import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importamos el componente principal de la aplicación
// import { BrowserRouter } from 'react-router-dom'; // Permite el enrutamiento en la aplicación
// import { UserProvider } from './context/UserContext'; // Importamos el proveedor del contexto

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <UserProvider> {/* Envolvemos la aplicación con el proveedor del contexto */}
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </UserProvider>
//   </React.StrictMode>
// );


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);