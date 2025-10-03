import React, { useState } from "react";
import './AgregarPaciente.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AgregarProducto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    foto: "",
    fotoTabla: "",
    cantidad: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.precio) {
      newErrors.precio = "El precio es obligatorio";
    } else if (isNaN(parseFloat(formData.precio))) {
      newErrors.precio = "El precio debe ser un número";
    }
    if (!formData.descripcion) newErrors.descripcion = "La descripción es obligatoria";
    if (!formData.foto) newErrors.foto = "La foto es obligatoria";
    if (!formData.fotoTabla) newErrors.fotoTabla = "La foto de tabla es obligatoria";
    if (!formData.cantidad) newErrors.cantidad = "La cantidad es obligatoria";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const token = sessionStorage.getItem("token");
      console.log("Token que se envía:", token); 
      await axios.post("http://localhost:3000/productos", {
        ...formData,
        precio: parseFloat(formData.precio)
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/productos");
      }, 900);
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Error al crear el producto. Intente nuevamente."
      });
      setSuccess(false);
    }
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <h3>CREAR NUEVO PRODUCTO</h3>

        <div className="campo">
          <label>Nombre</label>
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
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="precio"
            className="input"
            value={formData.precio}
            onChange={handleChange}
            required
          />
          {errors.precio && <p className="error">{errors.precio}</p>}
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
          <label>Foto (URL)</label>
          <input
            type="text"
            name="foto"
            className="input"
            value={formData.foto}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
          {errors.foto && <p className="error">{errors.foto}</p>}
        </div>

        <div className="campo">
          <label>Foto Tabla (URL)</label>
          <input
            type="text"
            name="fotoTabla"
            className="input"
            value={formData.fotoTabla}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
          {errors.fotoTabla && <p className="error">{errors.fotoTabla}</p>}
        </div>

        <div className="campo">
          <label>Cantidad de Stock</label>
          <input
            type="text"
            name="cantidad"
            className="input"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />
          {errors.cantidad && <p className="error">{errors.cantidad}</p>}
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit" className="boton-enviar">Crear Producto</button>
        {success && <div>¡Producto creado exitosamente!</div>}
      </form>
    </div>
  );
};

export default AgregarProducto;