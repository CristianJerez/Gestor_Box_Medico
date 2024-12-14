import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';  // Asegúrate de que App.js está correctamente importado
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
