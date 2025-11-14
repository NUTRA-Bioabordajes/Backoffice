import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";
import "./Recetas.css";

const VerReceta = () => {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecetas();
  }, []);

  const fetchRecetas = async () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/recetas", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al traer las recetas");
      const data = await res.json();

      // 🔹 Por cada receta, traigo sus intolerancias
      const recetasConDietas = await Promise.all(
        data.map(async (receta) => {
          try {
            const resInt = await fetch(
              `http://localhost:3000/recetas/${receta.idReceta}/intolerancias`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (resInt.ok) {
              const intolerancias = await resInt.json();
              return {
                ...receta,
                Dietas:
                  intolerancias.map((i) => i.Nombre || i.nombre).join(", ") ||
                  "Sin dietas",
              };
            } else {
              return { ...receta, Dietas: "Sin dietas" };
            }
          } catch (error) {
            console.error(
              `Error al traer intolerancias para receta ${receta.idReceta}:`,
              error
            );
            return { ...receta, Dietas: "Sin dietas" };
          }
        })
      );

      setRecetas(recetasConDietas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Inactivar o activar receta
  const handleToggleActivo = async (idReceta, activoActual) => {
    const confirmMsg = activoActual
      ? "¿Seguro que querés inactivar esta receta?"
      : "¿Seguro que querés activar esta receta?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = sessionStorage.getItem("token");
      const receta = recetas.find((r) => r.idReceta === idReceta);
      if (!receta) throw new Error("Receta no encontrada");

      const recetaActualizada = { ...receta, Activo: !activoActual };

      const res = await fetch(`http://localhost:3000/recetas/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(recetaActualizada),
      });

      if (!res.ok) throw new Error("Error al actualizar receta");

      setRecetas((prev) =>
        prev.map((r) =>
          r.idReceta === idReceta ? { ...r, Activo: !activoActual } : r
        )
      );
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
                <th>Dietas</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {recetas.map((r) => (
                <tr
                  key={r.idReceta}
                  className={`fila-receta ${!r.Activo ? "inactivo" : ""}`}
                >
                  <td>{r.idReceta}</td>
                  <td>{r.Nombre}</td>
                  <td>{r.Descripcion}</td>
                  <td>{r.Elaboracion}</td>
                  <td>{r.idCategoria}</td>
                  <td>{r.Dietas}</td>
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
                    <div className="botones">
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(r.idReceta)}
                        disabled={!r.Activo}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-inactivar"
                        onClick={() =>
                          handleToggleActivo(r.idReceta, r.Activo)
                        }
                      >
                        {r.Activo ? (
                          <GrStatusGood color="green" size={20} />
                        ) : (
                          <RxCrossCircled color="red" size={20} />
                        )}
                      </button>
                      
                    </div>
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
