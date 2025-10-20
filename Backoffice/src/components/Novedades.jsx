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
        // Convertimos id a idNovedad para consistencia con backend
        const novedadesConId = data.map((n) => ({
          ...n,
          idNovedad: n.id, 
        }));
        setNovedades(novedadesConId);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleToggleActivo = async (idNovedad, activoActual) => {
    const confirmMsg = activoActual
      ? "¿Seguro que quieres desactivar esta novedad?"
      : "¿Seguro que quieres activar esta novedad?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = sessionStorage.getItem("token");
      const novedad = novedades.find((n) => n.idNovedad === idNovedad);
      if (!novedad) throw new Error("Novedad no encontrada");

      const novedadActualizada = {
        idNovedad: novedad.idNovedad,
        nombre: novedad.nombre,
        descripcion: novedad.descripcion,
        flyer: novedad.flyer,
        activo: !activoActual, // invertimos el estado
      };

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

      // Actualizamos el state para reflejar el cambio en la UI
      setNovedades((prev) =>
        prev.map((n) =>
          n.idNovedad === idNovedad ? { ...n, activo: !activoActual } : n
        )
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (idNovedad) => {
    navigate(`/dashboard/editarNovedades/${idNovedad}`);
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
        <div className="tabla-wrapper-novedades"> {/* <-- Scroll solo aquí */}
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
                  key={n.idNovedad}
                  className={`fila-novedad ${!n.activo ? "inactiva" : ""}`}
                >
                  <td>{n.idNovedad}</td>
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
                  <td>{n.created_at ? new Date(n.created_at).toLocaleDateString() : "-"}</td>
                  <td>{n.fechaBaja ? new Date(n.fechaBaja).toLocaleDateString() : "-"}</td>
                  <td>{n.activo ? "Sí" : "No"}</td>
                  <td>
                    <div className="botones">
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(n.idNovedad)}
                        disabled={!n.activo}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleToggleActivo(n.idNovedad, n.activo)}
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
