import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgregarNovedades = () => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Descripcion: "",
    Flyer: "",
    FechaBaja: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validación
  const validate = () => {
    const newErrors = {};
    if (!formData.Nombre) newErrors.Nombre = "El nombre es obligatorio";
    if (!formData.Descripcion) newErrors.Descripcion = "La descripción es obligatoria";
    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const token = sessionStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:3000/novedades",
        {
          nombre: formData.Nombre,
          descripcion: formData.Descripcion,
          flyer: formData.Flyer || null,
          fechaBaja: formData.FechaBaja || null,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );      

      alert("Novedad creada con éxito ✅");
      navigate("/dashboard/novedades");
    } catch (err) {
      console.error("Error creando novedad:", err);
      setErrors({
        submit: err.response?.data?.message || "Error al crear la novedad. Intente nuevamente.",
      });
      alert("Error al crear la novedad: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <h3>CREAR NUEVA NOVEDAD</h3>

        <div className="campo">
          <label>Nombre de la novedad</label>
          <input
            type="text"
            name="Nombre"
            className="input"
            value={formData.Nombre}
            onChange={handleChange}
            required
          />
          {errors.Nombre && <p className="error">{errors.Nombre}</p>}
        </div>

        <div className="campo">
          <label>Descripción</label>
          <textarea
            name="Descripcion"
            className="input"
            value={formData.Descripcion}
            onChange={handleChange}
            rows="3"
            required
          />
          {errors.Descripcion && <p className="error">{errors.Descripcion}</p>}
        </div>

        <div className="campo">
          <label>Flyer (URL)</label>
          <input
            type="text"
            name="Flyer"
            className="input"
            value={formData.Flyer}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        <div className="campo">
          <label>Fecha de Baja</label>
          <input
            type="date"
            name="FechaBaja"
            className="input"
            value={formData.FechaBaja}
            onChange={handleChange}
          />
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit" className="boton-enviar">Crear Novedad</button>
      </form>
    </div>
  );
};

export default AgregarNovedades;
