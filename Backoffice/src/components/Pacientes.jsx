import React, { useEffect, useState } from "react";
import "./Pacientes.css";

const Pacientes = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPacientes();
  }, []);


  const fetchPacientes = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = sessionStorage.getItem("token");
      const usuario = JSON.parse(sessionStorage.getItem("usuarioBack"));
      const especialidad = usuario?.especialidad;
console.log(usuario.especialidad);

      if (!especialidad) {
        setError("Error al obtener el rol del usuario.");
        setLoading(false);
        return;
      }

      let url = "http://localhost:3000/usuarios"; // default (admin)
      if (especialidad.toLowerCase() === "medico") {
        url = "http://localhost:3000/usuarios/porMedico"; // pacientes del médico
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
      setPacientes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <p>Cargando pacientes...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="pacientes-container">
      <h1>Lista de Pacientes</h1>

      {pacientes.length === 0 ? (
        <p>No hay pacientes disponibles</p>
      ) : (
        <table className="tabla-pacientes">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Diagnóstico</th>
              <th>Sexo</th>
              <th>Barrio</th>
            </tr>
          </thead>
          <tbody>
            {pacientes.map((p) => (
              <tr
                key={p.id}
                className={`fila-paciente ${
                  p.activo === false ? "inactivo" : ""
                }`}
              >
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.apellido}</td>
                <td>{p.diagnostico}</td>
                <td>{p.sexo}</td>
                <td>{p.barrio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Pacientes;
