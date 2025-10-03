import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarPaciente.css";

const EditarPaciente = () => {
  const { id } = useParams(); // 👈 viene desde /dashboard/editarPaciente/:id
  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);

  // 🟢 Obtener paciente al cargar
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:3000/usuarios/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => setPaciente(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!paciente) return <p>Cargando paciente...</p>;

  // 🟡 Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente({ ...paciente, [name]: value });
  };

  // 🟢 Guardar cambios (PUT) y volver a Pacientes
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

      if (!res.ok) throw new Error("Error al actualizar paciente");

      alert("Paciente actualizado con éxito ✅");
      navigate("/dashboard/pacientes"); //vuelve a la lista
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="editar-paciente-container">
      <h1>Editar paciente #{id}</h1>
      <form onSubmit={handleSubmit}>
        <label>DNI:</label>
        <input
          type="text"
          name="dni"
          value={paciente.dni || ""}
          onChange={handleChange}
        />

        <label>Nombre:</label>
        <input
          type="text"
          name="nombre"
          value={paciente.nombre || ""}
          onChange={handleChange}
        />

        <label>Apellido:</label>
        <input
          type="text"
          name="apellido"
          value={paciente.apellido || ""}
          onChange={handleChange}
        />

        <label>Diagnóstico:</label>
        <textarea
          name="diagnostico"
          value={paciente.diagnostico || ""}
          onChange={handleChange}
        />

        <label>Sexo:</label>
        <input
          type="text"
          name="sexo"
          value={paciente.sexo || ""}
          onChange={handleChange}
        />

        <label>Barrio:</label>
        <input
          type="text"
          name="barrio"
          value={paciente.barrio || ""}
          onChange={handleChange}
        />

        <label>ID Médico:</label>
        <input
          type="text"
          name="idMedico"
          value={paciente.idMedico || ""}
          onChange={handleChange}
        />

        <label>Foto (URL):</label>
        <input
          type="text"
          name="foto"
          value={paciente.foto || ""}
          onChange={handleChange}
        />

        <button type="submit">💾 Guardar cambios</button>
      </form>
    </div>
  );
};

export default EditarPaciente;
