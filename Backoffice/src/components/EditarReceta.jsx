import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarReceta.css";

const EditarReceta = () => {
  const { idReceta } = useParams();
  const navigate = useNavigate();
  const [receta, setReceta] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:3000/recetas/${idReceta}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setReceta(data))
      .catch((err) => console.error(err));
  }, [idReceta]);

  if (!receta) return <p>Cargando receta...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceta({ ...receta, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3000/recetas", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(receta),
      });

      if (!res.ok) throw new Error("Error al actualizar receta");

      alert("Receta actualizada con éxito ✅");
      navigate("/dashboard/recetas");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="editar-receta-container">
      <h1>Editar receta</h1>
      <form onSubmit={handleSubmit} className="editar-receta-form">
        <label>Nombre:</label>
        <input
          type="text"
          name="Nombre"
          value={receta.Nombre || ""}
          onChange={handleChange}
        />

        <label>Descripción:</label>
        <textarea
          name="Descripcion"
          value={receta.Descripcion || ""}
          onChange={handleChange}
        />

        <label>Elaboración:</label>
        <textarea
          name="Elaboracion"
          value={receta.Elaboracion || ""}
          onChange={handleChange}
        />

        <label>Categoría:</label>
        <input
          type="text"
          name="idCategoria"
          value={receta.idCategoria || ""}
          onChange={handleChange}
        />

        <label>Foto (URL):</label>
        <input
          type="text"
          name="Foto"
          value={receta.Foto || ""}
          onChange={handleChange}
        />

        <div className="editar-receta-actions">
          <button type="submit" className="btn-guardar">Guardar cambios</button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/dashboard/recetas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarReceta;
