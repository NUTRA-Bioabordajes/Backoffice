import React, { useState } from "react";
import './AgregarPaciente.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AgregarProducto = () => {
 const [formData, setFormData] = useState({
  Nombre: "",
  Precio: "",
  Descripcion: "",
  Foto: "",
  FotoTabla: "",
  Cantidad: "",
  Stock: 0,
  Favoritos: 0
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
    if (!formData.Nombre) newErrors.Nombre = "El nombre es obligatorio";
    if (!formData.Precio) {
      newErrors.Precio = "El precio es obligatorio";
    } else if (isNaN(parseFloat(formData.Precio))) {
      newErrors.Precio = "El precio debe ser un número";
    }
    if (!formData.Descripcion) newErrors.Descripcion = "La descripción es obligatoria";
    if (!formData.Foto) newErrors.Foto = "La foto es obligatoria";
    if (!formData.FotoTabla) newErrors.FotoTabla = "La foto de tabla es obligatoria";
    if (!formData.Cantidad) newErrors.Cantidad = "La cantidad es obligatoria";
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
        navigate("/dashboard/ecommerce");
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
            name="Nombre"
            className="input"
            value={formData.Nombre}
            onChange={handleChange}
            required
          />
          {errors.Nombre && <p className="error">{errors.Nombre}</p>}
        </div>

        <div className="campo">
          <label>Precio</label>
          <input
            type="number"
            step="0.01"
            min="0"
            name="Precio"
            className="input"
            value={formData.Precio}
            onChange={handleChange}
            required
          />
          {errors.Precio && <p className="error">{errors.Precio}</p>}
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
          <label>Foto (URL)</label>
          <input
            type="text"
            name="Foto"
            className="input"
            value={formData.Foto}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
          {errors.Foto && <p className="error">{errors.Foto}</p>}
        </div>

        <div className="campo">
          <label>Foto Tabla (URL)</label>
          <input
            type="text"
            name="FotoTabla"
            className="input"
            value={formData.FotoTabla}
            onChange={handleChange}
            placeholder="https://..."
            required
          />
          {errors.FotoTabla && <p className="error">{errors.FotoTabla}</p>}
        </div>

        <div className="campo">
          <label>Cantidad de Stock</label>
          <input
            type="text"
            name="Cantidad"
            className="input"
            value={formData.Cantidad}
            onChange={handleChange}
            required
          />
          {errors.Cantidad && <p className="error">{errors.Cantidad}</p>}
        </div>

        {errors.submit && <p className="error">{errors.submit}</p>}

        <button type="submit" className="boton-enviar">Crear Producto</button>
        {success && <div>¡Producto creado exitosamente!</div>}
      </form>
    </div>
  );
};

export default AgregarProducto;