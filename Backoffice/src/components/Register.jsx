import React, { useState } from "react";
import axios from "axios";

export default function RegisterBack() {

  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    Email: "",
    password: "",
    confirmPassword: "",
    especialidad: "",
    telefono: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const payload = {
        Nombre: formData.Nombre,
        Apellido: formData.Apellido,
        Email: formData.Email,
        telefono: formData.telefono,
        especialidad: formData.especialidad,
        password: formData.password
      };

      const response = await axios.post(
        "http://localhost:3000/usuariosBack/register",
        payload
      );

      setSuccess(response.data.message);
      setFormData({
        Nombre: "",
        Apellido: "",
        Email: "",
        password: "",
        confirmPassword: "",
        especialidad: "",
        telefono: "",
      });

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Ocurrió un error al registrar el usuario");
    }
  };

  return (
    <div className="register-container">
      <h2>Registrar Usuario Backoffice</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <input
          type="text"
          name="Nombre"
          placeholder="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Apellido"
          placeholder="Apellido"
          value={formData.Apellido}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="Email"
          placeholder="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={formData.telefono}
          onChange={handleChange}
        />
        <select
          name="especialidad"
          value={formData.especialidad}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar rol</option>
          <option value="medico">Médico</option>
          <option value="diseñador">Diseñador</option>
        </select>
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Registrar</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}
