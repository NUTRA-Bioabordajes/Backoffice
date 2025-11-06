import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css';

const LogIn = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!form.username) newErrors.username = "Email requerido";
    if (!form.password) newErrors.password = "Contraseña requerida";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }

    try {
      const url = "http://localhost:3000/auth/loginBack";
      const response = await axios.post(url, {
        username: form.username,
        password: form.password,
      });

      console.log("Login response:", response.data);

      // ✅ Guardamos token y datos del usuario
      sessionStorage.setItem("token", response.data.accessToken);
      sessionStorage.setItem("usuarioBack", JSON.stringify(response.data.usuario));

      setSuccess(true);

      // ✅ Redirigir al dashboard después de 200ms
      setTimeout(() => {
        navigate("/dashboard/Home");
      }, 200);
    } catch (err) {
      setErrors({
        ...errors,
        password:
          err.response?.data?.message ||
          "Login fallido. Revisa usuario y contraseña.",
      });
      setSuccess(false);
    }
  };

  return (
    <div className="contenedor-autenticacion">
      <img src="/src/assets/images/logo.png" alt="Nutra logo" className="logo" />
      <div className="caja-autenticacion">
        <h2>¡Bienvenido/a de nuevo!</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre de Usuario</label>
          <input
            type="text"
            name="username"
            value={form.username}
            placeholder="Nombre de Usuario"
            onChange={handleChange}
          />
          {errors.username && <span>{errors.username}</span>}

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {errors.password && <span>{errors.password}</span>}

          <button type="submit" className="boton-autenticacion">
            Ingresar
          </button>

          <p className="enlace-autenticacion">
            ¿No tienes usuario? <Link to="/register">Registrate</Link>
          </p>
        </form>

        {success && <p className="mensaje-exito">Inicio de sesión exitoso</p>}
      </div>
    </div>
  );
};

export default LogIn;
