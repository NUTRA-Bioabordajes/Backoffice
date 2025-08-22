import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './Login.css';


/*export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // limpia errores previos

    try {
      /*const res = await fetch('http://actively-close-beagle.ngrok-free.app/login', {
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
  };*/
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
      if (!form.username) newErrors.username = "Email required";
      if (!form.password) newErrors.password = "Password required";
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

      setErrors({});
      setSuccess(false);

    

    try {
      const url = new URL (`http://localhost:3000/usuarios/loginBack`);
      console.log(success);
      const response = await axios.post(
        url.toString(),
        {
          username: form.username,
          password: form.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": 1,
          },
        }
      );

      console.log("Login response:", response.data);
      sessionStorage.setItem("token", response.data.token);
      sessionStorage.setItem("user", response.data.ID);

      console.log(sessionStorage)

      setSuccess(true);
      setTimeout(() => {
        navigate("/home");
      }, 200);

    } catch (err) {
      setErrors({
        ...errors,
        password:
          err.response?.data?.message ||
          "Login failed (400). Revisa usuario y contraseña.",
      });
      setSuccess(false);
    }
  }


  return (
    <div className="contenedor-autenticacion">
      <img src="/src/assets/images/logo.png" alt="Nutra logo" className="logo" />
      <div className="caja-autenticacion">
        <h2>¡Bienvenido/a de nuevo!</h2>

        <form onSubmit={handleSubmit}>

          <label>Nombre de Usuario</label>
          <input 
            type="text"
            name ="username" 
            value={form.username} 
            placeholder="Nombre de Usuario" 
            onChange={handleChange}
          />
           {errors.username && (
                <span>{errors.username}</span>
              )}



          <label>Contraseña</label>
          <input 
            type="password" 
            name="password"
            placeholder="Contraseña" 
            value={form.password} 
            onChange={handleChange}
            autoComplete="current-password"
          />

              {errors.password && (
                <span>{errors.password}</span>
              )}

          <button className="boton-autenticacion">Ingresar</button>

          <p className="enlace-autenticacion">
            ¿No tienes usuario? <Link to="/register">Registrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LogIn;
