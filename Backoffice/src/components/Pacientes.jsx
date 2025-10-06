import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pacientes.css";


const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPacientes();
  }, []);
  

  const fetchPacientes = () => {
    setLoading(true);
    const token = sessionStorage.getItem("token");

    fetch("http://localhost:3000/usuarios", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // 👈 token
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer los pacientes");
        return res.json();
      })
      .then((data) => {
        setPacientes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // 🔴 Eliminar paciente
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este paciente?")) return;

    try {
      const token = sessionStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // 👈 token
        },
      });

      if (!res.ok) throw new Error("Error al eliminar el paciente");

      // Actualizamos el estado sin tener que volver a pedir todo
      setPacientes(pacientes.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🟡 Editar paciente → redirige a una ruta con el id
  const handleEdit = (id) => {
    navigate(`/dashboard/editarPaciente/${id}`);
  };

  if (loading) return <p className="loading-text">Cargando pacientes...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="pacientes-container">
      <h1 className="titulo">Pacientes</h1>
      <Link to="/dashboard/agregarPaciente" className="agregar-paciente-link">
        + Agregar Paciente
      </Link>

      {pacientes.length === 0 ? (
        <p className="sin-pacientes-text">No hay pacientes registrados</p>
      ) : (
        <div className="tabla-wrapper">
          <table className="tabla-pacientes">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Diagnóstico</th>
                <th>Sexo</th>
                <th>Barrio</th>
                <th>ID Médico</th>
                <th>Foto</th>
                <th>Acciones</th> 
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p.id} className="fila-paciente">
                  <td>{p.id}</td>
                  <td>{p.dni}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.diagnostico}</td>
                  <td>{p.sexo}</td>
                  <td>{p.barrio}</td>
                  <td>{p.idMedico}</td>
                  <td>
                    {p.foto ? (
                      <img
                        src={p.foto}
                        alt={`${p.nombre} ${p.apellido}`}
                        className="foto-paciente"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(p.id)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDelete(p.id)}
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

export default Pacientes;
