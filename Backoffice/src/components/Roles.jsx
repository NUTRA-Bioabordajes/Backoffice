import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { GrStatusGood } from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";
import "./Roles.css";

const Roles = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const usuarioBack = JSON.parse(sessionStorage.getItem("usuarioBack"));
  const esAdmin = usuarioBack?.Admin === true;

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    fetch("http://localhost:3000/usuariosBack", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer los médicos");
        return res.json();
      })
      .then((data) => {
        setMedicos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleToggleActivo = async (id, activoActual) => {
    if (!esAdmin) {
      alert("No tenés permisos para modificar médicos.");
      return;
    }

    const confirmMsg = activoActual
      ? "¿Seguro que querés inactivar este médico?"
      : "¿Seguro que querés activar este médico?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = sessionStorage.getItem("token");
      const nuevoEstado = !activoActual;

      // ✅ solo mandamos el campo activo
      const res = await fetch(`http://localhost:3000/usuariosBack/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activo: nuevoEstado }),
      });

      if (!res.ok) throw new Error("Error al actualizar médico");

      // ✅ Actualizamos el estado local del front
      setMedicos((prev) =>
        prev.map((m) => (m.id === id ? { ...m, activo: nuevoEstado } : m))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (id) => {
    if (!esAdmin) {
      alert("No tenés permisos para editar médicos.");
      return;
    }
    navigate(`/dashboard/editarMedico/${id}`);
  };

  if (loading) return <p className="loading-text">Cargando médicos...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="roles-container">
      <h1 className="titulo">Médicos</h1>

      {esAdmin && (
        <Link to="/dashboard/agregarMedico" className="agregar-rol-link">
          + Agregar Médico
        </Link>
      )}

      <div className="tabla-wrapper">
        <table className="tabla-roles">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {medicos.map((m) => (
              <tr
                key={m.id}
                className={`fila-medico ${!m.activo ? "inactivo" : ""}`}
              >
                <td>{m.id}</td>
                <td>{m.Nombre}</td>
                <td>{m.Apellido}</td>
                <td>{m.Email}</td>
                <td>{m.telefono || "Sin teléfono"}</td>
                <td>
                  {esAdmin && (
                    <div className="botones">
                    {/*
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(m.id)}
                        disabled={!m.activo}
                      >
                        <FaRegEdit />
                  </button>*/}
                      <button
                        className="btn-inactivar"
                        onClick={() => handleToggleActivo(m.id, m.activo)}
                      >
                        {m.activo ? (
                          <GrStatusGood color="green" size={20} />
                        ) : (
                          <RxCrossCircled color="red" size={20} />
                        )}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Roles;
