import React, { useState, useEffect } from "react";
import './AgregarPaciente.css'; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const AgregarReceta = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    elaboracion: "",
    idCategoria: "",
    foto: ""
  });

  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    axios.get("http://localhost:3000/categorias", {
      headers: { Authorization: `Bearer ${token}` }
    }
)
      .then(res => {
        const options = res.data.map(c => ({
          value: String(c.idCategoria),
          label: c.nombre
        }));
        setCategoriasOptions(options);
      })
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCategoriaChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      idCategoria: selectedOption ? selectedOption.value : ""
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.descripcion) newErrors.descripcion = "La descripción es obligatoria";
    if (!formData.elaboracion) newErrors.elaboracion = "La elaboración es obligatoria";
    if (!formData.idCategoria) newErrors.idCategoria = "Debe seleccionar una categoría";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      // Enviar datos al backend
      await axios.post("http://localhost:3000/recetas/nuevaReceta", {
        ...formData,
        idCategoria: Number(formData.idCategoria),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/recetas");
      }, 800);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Error al crear la receta. Intente nuevamente."
      });
      setSuccess(false);
    }
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <h3>CREAR NUEVA RECETA</h3>

        <div className="campo">
          <label>Nombre de la receta</label>
          <input
            type="text"
            name="nombre"
            className="input"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          {errors.nombre && <p className="error">{errors.nombre}</p>}
        </div>

        <div className="campo">
          <label>Descripción</label>
          <textarea
            name="descripcion"
            className="input"
            value={formData.descripcion}
            onChange={handleChange}
            rows="2"
            required
          />
          {errors.descripcion && <p className="error">{errors.descripcion}</p>}
        </div>

        <div className="campo">
          <label>Elaboración</label>
          <textarea
            name="elaboracion"
            className="input"
            value={formData.elaboracion}
            onChange={handleChange}
            rows="4"
            required
          />
          {errors.elaboracion && <p className="error">{errors.elaboracion}</p>}
        </div>

        <div className="campo">
          <label>Categoría</label>
          <Select
            options={categoriasOptions}
            value={categoriasOptions.find(opt => opt.value === formData.idCategoria) || null}
            onChange={handleCategoriaChange}
            placeholder="Seleccione una categoría..."
            classNamePrefix="select"
          />
          {errors.idCategoria && <p className="error">{errors.idCategoria}</p>}
        </div>

       

        <div className="campo">
          <label>Foto (URL)</label>
          <input
            type="text"
            name="foto"
            className="input"
            value={formData.foto}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit" className="boton-enviar">Crear Receta</button>
        {success && <div>¡Receta creada exitosamente!</div>}
      </form>
    </div>
  );
};

export default AgregarReceta;