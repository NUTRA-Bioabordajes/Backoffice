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

  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const usuarioBack = sessionStorage.getItem("usuarioBack");
      const usuario = JSON.parse(usuarioBack);
      const especialidad = usuario?.especialidad;

      if (!especialidad) {
        setError("Error al obtener el rol del usuario.");
        setLoading(false);
        return;
      }

      // Seleccionar la ruta según el rol
      let url = "http://localhost:3000/usuarios";
      if (especialidad.toLowerCase() === "medico") {
        url = "http://localhost:3000/usuarios/porMedico";
      } else if (especialidad.toLowerCase() === "diseñador") {
        setError("No estás autorizado en esta sección.");
        setPacientes([]);
        setLoading(false);
        return;
      }

      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 403) {
        setError("No estás autorizado en esta sección.");
        setPacientes([]);
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("Error al traer los pacientes");

      const data = await res.json();

      // YA NO buscamos intolerancias por separado
      setPacientes(data);
      setLoading(false);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleToggleActivo = async (id, activoActual) => {
    const confirmMsg = activoActual
      ? "¿Seguro que quieres desactivar este paciente?"
      : "¿Seguro que quieres activar este paciente?";

    if (!window.confirm(confirmMsg)) return;

    try {
      const token = sessionStorage.getItem("token");

      const paciente = pacientes.find((p) => p.id === id);
      if (!paciente) throw new Error("Paciente no encontrado");

      const pacienteActualizado = { ...paciente, activo: !activoActual };

      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pacienteActualizado),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al actualizar paciente: ${errorText}`);
      }

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
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="pacientes-container">
      <h1 className="titulo">Pacientes</h1>

      <Link to="/dashboard/agregarPaciente" className="agregar-paciente-link">
        + Agregar Paciente
      </Link>

      {pacientes.length === 0 ? (
        <p className="sin-pacientes-text">No hay pacientes</p>
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
                <th>Dieta</th>
                <th>Foto</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {pacientes.map((p) => (
                <tr
                  key={p.id}
                  className={p.activo === false ? "fila-paciente inactivo" : "fila-paciente"}
                >
                  <td>{p.id}</td>
                  <td>{p.dni}</td>
                  <td>{p.nombre}</td>
                  <td>{p.apellido}</td>
                  <td>{p.diagnostico}</td>
                  <td>{p.sexo}</td>
                  <td>{p.barrio}</td>
                  <td>
                    {p.intolerancias?.length > 0
                      ? p.intolerancias.join(", ")
                      : "—"}
                  </td>

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
                          <GrStatusGood size={20} />
                        ) : (
                          <RxCrossCircled size={20} />
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
