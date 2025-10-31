import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import "./Roles.css";

const Roles = () => {
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicos();
  }, []);

  const fetchMedicos = () => {
    const token = sessionStorage.getItem("token");
    setLoading(true);
    fetch("http://localhost:3000/usuariosBack", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este médico?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/usuariosBack/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar el médico");

      setMedicos(medicos.filter((m) => m.id !== id));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/dashboard/editarMedico/${id}`);
  };

  if (loading) return <p className="loading-text">Cargando médicos...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="roles-container">
      <h1 className="titulo">Médicos</h1>

      <Link to="/dashboard/agregarMedico" className="agregar-rol-link">
        + Agregar Médico
      </Link>

      {medicos.length === 0 ? (
        <p className="sin-roles-text">No hay médicos registrados</p>
      ) : (
        <div className="tabla-wrapper">
          <table className="tabla-roles">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Especialidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {medicos.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.Nombre}</td>
                  <td>{m.Apellido}</td>
                  <td>{m.Email}</td>
                  <td>{m.telefono || "Sin teléfono"}</td>
                  <td>{m.especialidad}</td>
                  <td>
                    <div className="botones">
                      <button
                        className="btn-editar"
                        onClick={() => handleEdit(m.id)}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="btn-eliminar"
                        onClick={() => handleDelete(m.id)}
                      >
                        <FaRegTrashAlt />
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

export default Roles;
