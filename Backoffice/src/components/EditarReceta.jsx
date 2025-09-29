import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditarReceta = () => {
  const { id } = useParams(); // si editás por id
  const [receta, setReceta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    // 🔹 fetch de la receta por id
    fetch(`http://localhost:3000/recetas/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // token incluido
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer la receta");
        return res.json();
      })
      .then((data) => {
        setReceta(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando receta...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!receta) return <p>No se encontró la receta</p>;

  return (
    <div>
      <h1>Editar Receta</h1>
      <form>
        <label>Nombre:</label>
        <input type="text" defaultValue={receta.Nombre} />

        <label>Descripción:</label>
        <textarea defaultValue={receta.Descripcion} />

        <label>Elaboración:</label>
        <textarea defaultValue={receta.Elaboracion} />

        <label>Categoría:</label>
        <input type="text" defaultValue={receta.idCategoria} />

        {/* Aquí podés agregar botón para guardar cambios, usando fetch con token */}
        <button type="submit">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarReceta;
