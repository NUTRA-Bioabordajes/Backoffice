import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarProducto.css";

const EditarProducto = () => {
  const { idProducto } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  // 🔎 Cargar producto por ID
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:3000/productos/${idProducto}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer producto");
        return res.json();
      })
      .then((data) => setProducto(data))
      .catch((err) => console.error(err));
  }, [idProducto]);

  if (!producto) return <p>Cargando producto...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/productos/${idProducto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!res.ok) throw new Error("Error al actualizar producto");

      alert("Producto actualizado con éxito ✅");
      navigate("/dashboard/productos");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="editar-producto-container">
      <h1>Editar producto</h1>
      <form onSubmit={handleSubmit} className="editar-producto-form">
        <label>Nombre:</label>
        <input
          type="text"
          name="Nombre"
          value={producto.Nombre || ""}
          onChange={handleChange}
        />

        <label>Descripción:</label>
        <textarea
          name="Descripcion"
          value={producto.Descripcion || ""}
          onChange={handleChange}
        />

        <label>Precio:</label>
        <input
          type="number"
          name="Precio"
          value={producto.Precio || ""}
          onChange={handleChange}
        />

        <label>Foto (URL):</label>
        <input
          type="text"
          name="Foto"
          value={producto.Foto || ""}
          onChange={handleChange}
        />

        <div className="editar-producto-actions">
          <button type="submit" className="btn-guardar">Guardar cambios</button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/dashboard/ecommerce")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarProducto;
