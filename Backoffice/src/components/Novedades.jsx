import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Novedades.css";
import { GrStatusGood } from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";

const Novedades = () => {
  const [novedades, setNovedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNovedades();
  }, []);

  const fetchNovedades = () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");

    fetch("http://localhost:3000/novedades", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer las novedades");
        return res.json();
      })
      .then((data) => {
        setNovedades(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleToggleActivo = async (id, activoActual) => {
    const confirmMsg = activoActual
      ? "¿Seguro que quieres desactivar esta novedad?"
      : "¿Seguro que quieres activar esta novedad?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = sessionStorage.getItem("token");
      const novedad = novedades.find((n) => n.id === id);
      if (!novedad) throw new Error("Novedad no encontrada");

      const novedadActualizada = { ...novedad, activo: !activoActual };

      const res = await fetch("http://localhost:3000/novedades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novedadActualizada),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al actualizar la novedad: ${errorText}`);
      }

      setNovedades((prev) =>
        prev.map((n) => (n.id === id ? novedadActualizada : n))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/editarNovedad/${id}`);
  };

  if (loading) return <p className="loading-text">Cargando novedades...</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="novedades-container">
      <h1 className="titulo">Novedades</h1>

      <Link to="/dashboard/agregarNovedades" className="agregar-novedad-link">
        + Agregar Novedad
      </Link>

      {novedades.length === 0 ? (
        <p className="sin-novedades-text">No hay novedades registradas</p>
      ) : (
        <div className="tabla-wrapper-novedades">  {/* Cambiado para coincidir con CSS */}
          <table className="tabla-novedades">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Flyer</th>
                <th>Creado</th>
                <th>Fecha de Baja</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {novedades.map((n) => (
                <tr
                  key={n.id}
                  className={`fila-novedad ${n.activo === false ? "inactiva" : ""}`}
                >
                  <td>{n.id}</td>
                  <td>{n.nombre}</td>
                  <td>{n.descripcion}</td>
                  <td>
                    {n.flyer ? (
                      <img 
                        src={n.flyer}
                        alt={`Flyer de ${n.nombre}`}
                        className="flyer-novedad"
                      />
                    ) : (
                      "Sin flyer"
                    )}
                  </td>
                  <td>
                    {n.created_at
                      ? new Date(n.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {n.fechaBaja
                      ? new Date(n.fechaBaja).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{n.activo ? "Sí" : "No"}</td>
                  <td>
                    <div className="botones">
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(n.id)}
                        disabled={n.activo === false}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleToggleActivo(n.id, n.activo)}
                      >
                        {n.activo ? (
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

export default Novedades;