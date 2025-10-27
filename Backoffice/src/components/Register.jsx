import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterBack() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Nombre: "",
    Apellido: "",
    Email: "",
    password: "",
    confirmPassword: "",
    especialidad: "",
    Admin: false,
    telefono: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
      const response = await axios.post("/usuariosBack", formData);
      if (response.data.id) {
        setSuccess("Usuario creado correctamente. Espera a que lo activen.");
        setFormData({
          Nombre: "",
          Apellido: "",
          Email: "",
          password: "",
          confirmPassword: "",
          especialidad: "",
          Admin: false,
          telefono: "",
        });
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Ocurrió un error al registrar el usuario"
      );
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
          type="Email"
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
        <input
          type="text"
          name="especialidad"
          placeholder="Especialidad"
          value={formData.especialidad}
          onChange={handleChange}
        />
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
        <label>
          <input
            type="checkbox"
            name="Admin"
            checked={formData.Admin}
            onChange={handleChange}
          />
          Admin
        </label>
        <button type="submit">Registrar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
}
