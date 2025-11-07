import React, { useState, useEffect } from "react";
import "./EditarPaciente.css";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const EditarPaciente = () => {
  const { idPaciente } = useParams();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    edad: "",
    diagnostico: "",
    idMedicoTratante: "",
    sexo: "",
    barrio: "",
    foto: "",
  });

  const [intoleranciasDisponibles, setIntoleranciasDisponibles] = useState([]);
  const [intoleranciasSeleccionadas, setIntoleranciasSeleccionadas] = useState([]);
  const [medicosDisponibles, setMedicosDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // 🔹 Obtener datos del paciente
  useEffect(() => {
    const token = sessionStorage.getItem("token");

    const fetchPaciente = async () => {
      try {
        const res = await fetch(`http://localhost:3000/usuarios/${idPaciente}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener paciente");

        const data = await res.json();

        setFormData({
          nombre: data.nombre || data.Nombre || "",
          apellido: data.apellido || data.Apellido || "",
          dni: data.dni || data.DNI || "",
          edad: data.edad || data.Edad || "",
          diagnostico: data.diagnostico || data.Diagnostico || "",
          idMedicoTratante:
            data.idMedicoTratante || data.idMedico || data.IdMedico || "",
          sexo: data.sexo || data.Sexo || "",
          barrio: data.barrio || data.Barrio || "",
          foto: data.foto || data.Foto || "",
        });
      } catch (err) {
        console.error("Error cargando paciente:", err);
      }
    };

    fetchPaciente();
  }, [idPaciente]);

  // 🔹 Obtener intolerancias disponibles
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:3000/intolerancias", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const opciones = data.map((i) => ({
          value: Number(i.idIntolerancias),
          label: i.Nombre,
        }));
        setIntoleranciasDisponibles(opciones);
      })
      .catch((err) => console.error("Error cargando intolerancias:", err));
  }, []);

  // 🔹 Obtener intolerancias del paciente
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:3000/usuarios/${idPaciente}/intolerancias`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const ids = data?.map((i) => Number(i.idIntolerancias)) || [];
        setIntoleranciasSeleccionadas(ids);
      })
      .catch((err) =>
        console.error("Error cargando intolerancias del paciente:", err)
      );
  }, [idPaciente]);

  // 🔹 Obtener médicos disponibles
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:3000/usuariosBack/medicos", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const opciones = data.map((m) => ({
          value: Number(m.id),
          label: `${m.Nombre} ${m.Apellido}`,
        }));
        setMedicosDisponibles(opciones);
      })
      .catch((err) => console.error("Error cargando médicos:", err));
  }, []);

  // 🔹 Control de carga
  useEffect(() => {
    if (
      formData.nombre !== "" &&
      medicosDisponibles.length > 0 &&
      intoleranciasDisponibles.length > 0
    ) {
      setLoading(false);
    }
  }, [formData, medicosDisponibles, intoleranciasDisponibles]);

  // 🔹 Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem("token");

    const dataToSend = {
      ...formData,
      intolerancias: intoleranciasSeleccionadas,
    };

    try {
      const res = await fetch(`http://localhost:3000/usuarios/${idPaciente}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Error al actualizar el paciente");

      alert("✅ Paciente actualizado con éxito");
      navigate("/dashboard/pacientes");
    } catch (err) {
      console.error(err);
      setErrors({ general: err.message });
    }
  };

  if (loading) return <p>Cargando datos del paciente...</p>;

  return (
    <div className="editar-paciente-container">
      <h1>Editar paciente</h1>

      <form onSubmit={handleSubmit}>
        {/* Campos básicos */}
        <div className="campo">
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            className="input"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            className="input"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>DNI</label>
          <input
            type="text"
            name="dni"
            className="input"
            value={formData.dni}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Diagnóstico</label>
          <input
            type="text"
            name="diagnostico"
            className="input"
            value={formData.diagnostico}
            onChange={handleChange}
          />
        </div>

        {/* --- Intolerancias tipo botones --- */}
        <div className="campo">
          <label>Dietas / Intolerancias</label>
          <div className="intolerancias-botones">
            {intoleranciasDisponibles.map((intolerancia) => (
              <button
                key={intolerancia.value}
                type="button"
                className={
                  intoleranciasSeleccionadas.includes(intolerancia.value)
                    ? "btn-intolerancia selected"
                    : "btn-intolerancia"
                }
                onClick={() => {
                  setIntoleranciasSeleccionadas((prev) =>
                    prev.includes(intolerancia.value)
                      ? prev.filter((id) => id !== intolerancia.value)
                      : [...prev, intolerancia.value]
                  );
                }}
              >
                {intolerancia.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- Select Médicos --- */}
        <div className="campo">
          <label>Médico tratante</label>
          <Select
            closeMenuOnSelect={true}
            components={animatedComponents}
            options={medicosDisponibles}
            value={medicosDisponibles.find(
              (opt) => opt.value === Number(formData.idMedicoTratante)
            )}
            onChange={(selectedOption) =>
              setFormData((prev) => ({
                ...prev,
                idMedicoTratante: selectedOption?.value || "",
              }))
            }
            placeholder="Seleccione el médico..."
          />
        </div>

        <div className="campo">
          <label>Sexo</label>
          <input
            type="text"
            name="sexo"
            className="input"
            value={formData.sexo}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Barrio</label>
          <input
            type="text"
            name="barrio"
            className="input"
            value={formData.barrio}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label>Foto (URL)</label>
          <input
            type="text"
            name="foto"
            className="input"
            value={formData.foto}
            onChange={handleChange}
          />
        </div>

        {errors.general && <p style={{ color: "red" }}>{errors.general}</p>}

        <div style={{ marginTop: 20 }}>
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
