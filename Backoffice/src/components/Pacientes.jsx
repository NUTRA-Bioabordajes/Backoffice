import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Pacientes.css";
import { GrStatusGood } from "react-icons/gr";
import { RxCrossCircled } from "react-icons/rx";
import { FaRegEdit } from "react-icons/fa";

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
        Authorization: `Bearer ${token}`,
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

  const handleToggleActivo = async (id, activoActual) => {
    const confirmMsg = activoActual
      ? "¿Seguro que quieres desactivar este paciente?"
      : "¿Seguro que quieres activar este paciente?";
    if (!window.confirm(confirmMsg)) return;
  
    try {
      const token = sessionStorage.getItem("token");
  
      // Buscar paciente completo en el estado
      const paciente = pacientes.find((p) => p.id === id);
      if (!paciente) throw new Error("Paciente no encontrado");
  
      // Crear nuevo objeto con activo cambiado
      const pacienteActualizado = { ...paciente, activo: !activoActual };
  
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT", // actualizar todo
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteActualizado),
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al actualizar el paciente: ${errorText}`);
      }
  
      // Actualizar estado localmente para reflejar cambio
      setPacientes((prev) =>
        prev.map((p) => (p.id === id ? pacienteActualizado : p))
      );
    } catch (err) {
      alert("Error: " + err.message);
    }
  };
  

  const handleEdit = (id) => {
    navigate(`/dashboard/editarPaciente/${id}`);
  };

  if (loading) return <p className="loading-text">Cargando pacientes...</p>;
  if (error) return <p className="error">Error: {error}</p>;

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
                <tr
                  key={p.id}
                  className={`fila-paciente ${p.activo === false ? "inactivo" : ""}`}
                >
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
                  <div className="botones">
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(p.id)}
                      disabled={p.activo === false}
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleToggleActivo(p.id, p.activo)}
                    >
                      {p.activo ? (
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

export default Pacientes;
