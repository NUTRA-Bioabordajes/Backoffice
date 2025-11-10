import React, { useState, useEffect } from "react";
import './AgregarReceta.css'; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import makeAnimated from "react-select/animated"; 

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
  const [intoleranciasDisponibles, setIntoleranciasDisponibles] = useState([]);
  const [intolerancias, setIntolerancias] = useState([]);
  const navigate = useNavigate();
  
  const animatedComponents = makeAnimated();

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
          label: c.Nombre || c.nombre || `Categoría ${c.idCategoria}`,
        }));
        setCategoriasOptions(options);
      })
      .catch((err) => {
        console.error("Error cargando categorías:", err);
        setCategoriasOptions([]);
      });
  }, []);

  // Traer intolerancias
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:3000/intolerancias", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const opciones = data.map(i => ({
          value: Number(i.idIntolerancias),
          label: i.Nombre
        }));
        setIntoleranciasDisponibles(opciones);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      idCategoria: selectedOption ? selectedOption.value : ""
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.Nombre) newErrors.Nombre = "El nombre es obligatorio";
    if (!formData.Descripcion) newErrors.Descripcion = "La descripción es obligatoria";
    if (!formData.Elaboracion) newErrors.Elaboracion = "La elaboración es obligatoria";
    if (!formData.idCategoria) newErrors.idCategoria = "Debe seleccionar una categoría";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const token = sessionStorage.getItem("token");
    const dataToSend = {
      ...formData,
      idCategoria: Number(formData.idCategoria),
      intolerancias: intolerancias.map(id => Number(id)),
      Favoritos: false
    };

    try {
      await axios.post("http://localhost:3000/recetas", dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
          <label>Dietas</label>
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            isMulti
            options={intoleranciasDisponibles}
            value={intoleranciasDisponibles.filter(opt => intolerancias.includes(opt.value))}
            onChange={(selectedOptions) => {
              setIntolerancias(selectedOptions ? selectedOptions.map(o => o.value) : []);
            }}
            placeholder="Seleccione dietas..."
          />
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
