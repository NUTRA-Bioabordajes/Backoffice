// EditarPaciente.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditarPaciente.css";

const EditarPaciente = () => {
  // Tomamos el primer parámetro de la ruta (maneja :id, :idPaciente, etc.)
  const params = useParams();
  const paramKeys = Object.keys(params);
  const id = paramKeys.length ? params[paramKeys[0]] : undefined;

  const navigate = useNavigate();
  const [paciente, setPaciente] = useState(null);
  const [rawResponse, setRawResponse] = useState(null); // para detectar formato del servidor
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No se encontró el id en la ruta.");
      setLoading(false);
      return;
    }

    const token = sessionStorage.getItem("token");

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // Si tu API devuelve error con cuerpo textual, capturamos eso
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error ${res.status}: ${text}`);
        }

        const data = await res.json();
        console.log("Respuesta API (raw):", data);
        setRawResponse(data);

        // Normalizamos: si vino un array -> tomar el primer elemento
        let obj = data;
        if (Array.isArray(obj)) {
          obj = obj[0] || {};
        }

        // Si la respuesta viene envuelta (ej { data: {...} } o { usuario: {...} })
        if (obj && typeof obj === "object") {
          const wrapperKeys = ["data", "usuario", "paciente", "result", "body", "results"];
          for (const k of wrapperKeys) {
            if (obj[k] && typeof obj[k] === "object") {
              obj = obj[k];
              break;
            }
          }
        }

        // Normalizar nombres de campos para usar minúsculas en el form
        const pacienteNormalizado = {
          id: obj.id ?? obj.ID ?? obj.Id ?? id,
          nombre: obj.nombre ?? obj.Nombre ?? obj.NOMBRE ?? "",
          apellido: obj.apellido ?? obj.Apellido ?? "",
          dni: obj.dni ?? obj.DNI ?? "",
          diagnostico: obj.diagnostico ?? obj.Diagnostico ?? "",
          sexo: obj.sexo ?? obj.Sexo ?? "",
          barrio: obj.barrio ?? obj.Barrio ?? "",
          idMedico:
            obj.idMedico ??
            obj.IdMedico ??
            obj.id_medico ??
            obj.id_medico ??
            obj.idMedicoUsuario ??
            "",
          foto:
            obj.foto ??
            obj.Foto ??
            obj.imagen ??
            obj.urlFoto ??
            obj.fotoUrl ??
            "",
        };

        setPaciente(pacienteNormalizado);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || "Error al traer paciente");
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <p>Cargando paciente...</p>;
  if (error)
    return (
      <div style={{ padding: 20 }}>
        <p style={{ color: "red" }}>Error: {error}</p>
        <button onClick={() => navigate("/dashboard/pacientes")}>Volver</button>
      </div>
    );
  if (!paciente) return <p>No se encontraron datos del paciente.</p>;

  // Manejo inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaciente((prev) => ({ ...prev, [name]: value }));
  };

  // Detectar si el servidor usa claves con mayúscula para devolver y enviar (p.ej. "Nombre")
  const serverSample = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse;
  const serverUsesUppercase =
    serverSample && typeof serverSample === "object"
      ? Object.keys(serverSample).some((k) => /^[A-Z]/.test(k))
      : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");

      // Si el servidor usa mayúsculas, construimos el payload en ese formato
      let payloadToSend;
      if (serverUsesUppercase) {
        payloadToSend = {
          id: paciente.id,
          Nombre: paciente.nombre,
          Apellido: paciente.apellido,
          DNI: paciente.dni,
          Diagnostico: paciente.diagnostico,
          Sexo: paciente.sexo,
          Barrio: paciente.barrio,
          idMedico: paciente.idMedico, // si el servidor espera IdMedico podés cambiarlo acá
          Foto: paciente.foto,
        };
      } else {
        payloadToSend = {
          id: paciente.id,
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          dni: paciente.dni,
          diagnostico: paciente.diagnostico,
          sexo: paciente.sexo,
          barrio: paciente.barrio,
          idMedico: paciente.idMedico,
          foto: paciente.foto,
        };
      }

      const res = await fetch(`http://localhost:3000/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payloadToSend),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      alert("Paciente actualizado con éxito ✅");
      navigate("/dashboard/pacientes");
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Error al actualizar: " + (err.message || err));
    }
  };

  return (
    <div className="editar-paciente-container">
      <h1>Editar paciente</h1>

      <form onSubmit={handleSubmit}>
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

        <label>DNI:</label>
        <input
          type="text"
          name="dni"
          value={paciente.dni || ""}
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

        <div style={{ marginTop: 18 }}>
          <button type="submit" className="btn-guardar">
            Guardar cambios
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/dashboard/pacientes")}
            style={{ marginLeft: 10 }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPaciente;
