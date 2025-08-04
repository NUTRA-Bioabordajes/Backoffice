import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const passwordsMatch = password === confirmPassword && password !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwordsMatch || !username) return;

    // Aquí puedes agregar la lógica para registrar al usuario (API, localStorage, etc.)

    navigate('/home');
  };

  return (
    <div className="contenedor-autenticacion">
      <img src="/src/assets/images/logo.png" alt="Nutra logo" className="logo" />
      <div className="caja-autenticacion">
        <h2>Registrate</h2>
        <form onSubmit={handleSubmit}>
          <label>Nombre de Usuario</label><input type="text" placeholder="Nombre de Usuario" value={username} onChange={e => setUsername(e.target.value)} />
          
          <label>Contraseña</label><input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} />
          
          <label>Confirme contraseña</label><input type="password" placeholder="Confirme contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          {confirmPassword && !passwordsMatch && <p style={{ color: 'red', marginTop: '5px' }}>Las contraseñas no coinciden</p>}
          
          <button className="boton-autenticacion" type="submit" disabled={!passwordsMatch || !username}>Registrate</button>
        </form>
      </div>
    </div>
  );
}
