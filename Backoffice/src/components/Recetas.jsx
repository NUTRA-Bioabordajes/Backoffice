import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Recetas.css";

const VerReceta = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = () => {
    const token = sessionStorage.getItem("token");

    setLoading(true);
    fetch("http://localhost:3000/recetas", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer las recetas");
        return res.json();
      })
      .then((data) => {
        setRecetas(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // 🔴 Eliminar receta
  const handleDelete = async (idReceta) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta receta?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/recetas/${idReceta}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar la receta");

      setRecetas(recetas.filter((r) => r.idReceta !== idReceta));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (idReceta) => {
    navigate(`/dashboard/editarReceta/${idReceta}`);
  };
  
  if (loading) return <p className="loading-text">Cargando recetas...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="recetas-container">
      <h1 className="titulo">Recetas</h1>
      <Link to="/dashboard/AgregarReceta" className="agregar-receta-link">
        + Agregar Receta
      </Link>

      {recetas.length === 0 ? (
        <p className="sin-recetas-text">No hay recetas registradas</p>
      ) : (
        <div className="tabla-wrapper">
          <table className="tabla-recetas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Elaboración</th>
                <th>Categoría</th>
                <th>Foto</th>
                <th>Acciones</th> {/* 🔵 Nueva columna */}
              </tr>
            </thead>
            <tbody>
              {recetas.map((r) => (
                <tr key={r.idReceta} className="fila-receta">
                  <td>{r.idReceta}</td>
                  <td>{r.Nombre}</td>
                  <td>{r.Descripcion}</td>
                  <td>{r.Elaboracion}</td>
                  <td>{r.idCategoria}</td>
                  <td>
                    {r.Foto ? (
                      <img
                        src={r.Foto}
                        alt={r.Nombre}
                        className="foto-receta"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(r.idReceta)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDelete(r.idReceta)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerReceta;