import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // limpia errores previos

    try {
      const res = await fetch('http://actively-close-beagle.ngrok-free.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      // Si la API devuelve error o status no OK, lanzamos nuestro mensaje fijo
      if (!res.ok) {
        throw new Error('Error: usuario y/o contraseña incorrecto');
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard/home');

    } catch (err) {
      setError(err.message || 'Error: usuario y/o contraseña incorrecto');
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <img src="/src/assets/images/logo.png" alt="Nutra logo" className="logo" />
      <div className="caja-autenticacion">
        <h2>¡Bienvenido/a de nuevo!</h2>

        <label>Nombre de Usuario</label>
        <input 
          type="text" 
          placeholder="Nombre de Usuario" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Contraseña</label>
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button 
          className="boton-autenticacion" onClick={handleLogin}>Ingresar</button>

        <p className="enlace-autenticacion">
          ¿No tienes usuario? <Link to="/register">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
