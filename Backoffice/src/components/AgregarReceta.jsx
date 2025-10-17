import React, { useState, useEffect } from "react";
import './AgregarReceta.css'; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const AgregarReceta = () => {
  const [formData, setFormData] = useState({
    Nombre: "",
    Descripcion: "",
    Elaboracion: "",
    idCategoria: "",
    Foto: ""
  });

  const [categoriasOptions, setCategoriasOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Cargar categorías
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    axios
      .get("http://localhost:3000/recetas/categorias", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const options = res.data.map((c) => ({
          value: String(c.idCategoria),
          label:
            c.Nombre ||
            c.nombre ||
            c.NombreCategoria ||
            c.nombreCategoria ||
            `Categoría ${c.idCategoria}`,
        }));
        setCategoriasOptions(options);
      })
      .catch((err) => {
        console.error("Error cargando categorías:", err);
        setCategoriasOptions([]);
      });
  }, []);

  // Manejar cambios en inputs y textarea
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // Manejar selección de categoría
  const handleCategoriaChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      idCategoria: selectedOption ? selectedOption.value : ""
    }));
  };

  // Validación
  const validate = () => {
    const newErrors = {};
    if (!formData.Nombre) newErrors.Nombre = "El nombre es obligatorio";
    if (!formData.Descripcion) newErrors.Descripcion = "La descripción es obligatoria";
    if (!formData.Elaboracion) newErrors.Elaboracion = "La elaboración es obligatoria";
    if (!formData.idCategoria) newErrors.idCategoria = "Debe seleccionar una categoría";
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
        "http://localhost:3000/recetas",
        {
          Nombre: formData.Nombre,
          Descripcion: formData.Descripcion,
          Elaboracion: formData.Elaboracion,
          idCategoria: Number(formData.idCategoria),
          Foto: formData.Foto || null,
          Favoritos: false
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Alert al estilo de EditarPaciente
      alert("Receta creada con éxito ✅");
      navigate("/dashboard/recetas");
    } catch (err) {
      console.error("Error creando receta:", err);
      setErrors({
        submit:
          err.response?.data?.message || "Error al crear la receta. Intente nuevamente."
      });
      alert("Error al crear la receta: " + (err.response?.data?.message || err.message));
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
            rows="2"
            required
          />
          {errors.Descripcion && <p className="error">{errors.Descripcion}</p>}
        </div>

        <div className="campo">
          <label>Elaboración</label>
          <textarea
            name="Elaboracion"
            className="input"
            value={formData.Elaboracion}
            onChange={handleChange}
            rows="4"
            required
          />
          {errors.Elaboracion && <p className="error">{errors.Elaboracion}</p>}
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
            name="Foto"
            className="input"
            value={formData.Foto}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit" className="boton-enviar">Crear Receta</button>
      </form>
    </div>
  );
};

export default AgregarReceta;
