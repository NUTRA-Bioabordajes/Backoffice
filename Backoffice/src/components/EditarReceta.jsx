// src/components/EditarPaciente.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarPaciente.css";

const EditarPaciente = () => {
  const { id } = useParams(); // asegúrate que la ruta en App.jsx es: editarPaciente/:id
  const navigate = useNavigate();

  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    const fetchPaciente = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("Token no encontrado en sessionStorage");

        const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) {
          // captura códigos diferentes para info más clara
          if (res.status === 401) throw new Error("No autorizado (401). Revisa el token.");
          if (res.status === 404) throw new Error("Paciente no encontrado (404).");
          const txt = await res.text();
          throw new Error(`Error ${res.status}: ${txt}`);
        }

        const data = await res.json();
        // fallback si backend devolviera un array
        const pacienteData = Array.isArray(data) ? data[0] : data;

        if (!pacienteData) throw new Error("Respuesta vacía del servidor");

        if (mounted) setPaciente(pacienteData);
      } catch (err) {
        if (err.name === "AbortError") return; // navegación rápida -> no mostrar error
        console.error("fetchPaciente error:", err);
        if (mounted) setError(err.message || "Error desconocido");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPaciente();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [id]);

  if (loading)
    return (
      <div className="editar-paciente-container">
        <p className="loading-text">Cargando paciente...</p>
      </div>
    );

  if (error)
    return (
      <div className="editar-paciente-container">
        <p className="error-text">Error: {error}</p>
        <div style={{ marginTop: 16 }}>
          <button onClick={() => navigate("/dashboard/pacientes")} className="btn-cancelar">
            Volver a Pacientes
          </button>
        </div>
      </div>
    );

  // manejo del formulario (igual que antes)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paciente),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Error al actualizar: ${res.status} ${txt}`);
      }

      alert("Paciente actualizado con éxito ✅");
      navigate("/dashboard/pacientes");
    } catch (err) {
      console.error("update error:", err);
      alert("Error: " + (err.message || "Error desconocido"));
    }
  };

  return (
    <div className="editar-paciente-container">
      <h1>Editar paciente #{id}</h1>
      <form onSubmit={handleSubmit}>
        <label>DNI:</label>
        <input type="text" name="dni" value={paciente.dni || ""} onChange={handleChange} />

        <label>Nombre:</label>
        <input type="text" name="nombre" value={paciente.nombre || ""} onChange={handleChange} />

        <label>Apellido:</label>
        <input type="text" name="apellido" value={paciente.apellido || ""} onChange={handleChange} />

        <label>Diagnóstico:</label>
        <textarea name="diagnostico" value={paciente.diagnostico || ""} onChange={handleChange} />

        <label>Sexo:</label>
        <input type="text" name="sexo" value={paciente.sexo || ""} onChange={handleChange} />

        <label>Barrio:</label>
        <input type="text" name="barrio" value={paciente.barrio || ""} onChange={handleChange} />

        <label>ID Médico:</label>
        <input type="text" name="idMedico" value={paciente.idMedico || ""} onChange={handleChange} />

        <label>Foto (URL):</label>
        <input type="text" name="foto" value={paciente.foto || ""} onChange={handleChange} />

        <div className="editar-paciente-actions" style={{ marginTop: 12 }}>
          <button type="submit" className="btn-guardar">💾 Guardar cambios</button>
          <button type="button" className="btn-cancelar" onClick={() => navigate("/dashboard/pacientes")}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default EditarPaciente;
