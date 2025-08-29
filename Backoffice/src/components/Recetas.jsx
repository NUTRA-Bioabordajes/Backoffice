import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Recetas.css";

const VerReceta = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/recetas")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al traer las recetas");
        }
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
  }, []);

  if (loading) return <p className="loading-text">Cargando recetas...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="recetas-container">
      <h1 className="titulo">Recetas</h1>
      <Link to="/dashboard/gregarReceta" className="agregar-receta-link">
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
