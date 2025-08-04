import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  return (
    <div className="contenedor-autenticacion">
      <img src="/src/assets/images/logo.png" alt="Nutra logo" className="logo" />
      <div className="caja-autenticacion">
        <h2>¡Bienvenido/a de nuevo!</h2>
        <label>Nombre de Usuario</label>
        <input type="text" placeholder="Nombre de Usuario" />
        <label>Contraseña</label>
        <input type="password" placeholder="Contraseña" />
        <button className="boton-autenticacion" disabled>Ingresar</button>
        <p className="enlace-autenticacion">
          ¿No tienes usuario? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}