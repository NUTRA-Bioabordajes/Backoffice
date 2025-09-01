import React, { useState, useEffect } from "react";
import './AgregarPaciente.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgregarPaciente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    edad: "",
    diagnostico: "",
    idMedicoTratante: "",
    intolerancias: [],   // ahora es un array
    sexo: "",
    barrio: "",
    nombrePersonaACargo1: "",
    apellidoPersonaACargo1: "",
    dniPersonaACargo1: "",
    emailPersonaACargo1: "",
    telefonoPersonaACargo1: "",
    nombrePersonaACargo2: "",
    apellidoPersonaACargo2: "",
    dniPersonaACargo2: "",
    emailPersonaACargo2: "",
    telefonoPersonaACargo2: "",
    foto: ""
  });

  const [intoleranciasDisponibles, setIntoleranciasDisponibles] = useState([]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/intolerancias")
      .then(res => res.json())
      .then(data => {
        setIntoleranciasDisponibles(data);
      })
      .catch(err => console.error("Error cargando intolerancias:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIntoleranciaToggle = (idIntolerancia) => {
    setFormData(prev => {
      const alreadySelected = prev.intolerancias.includes(idIntolerancia);
      return {
        ...prev,
        intolerancias: alreadySelected
          ? prev.intolerancias.filter(i => i !== idIntolerancia)
          : [...prev.intolerancias, idIntolerancia]
      };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.edad || isNaN(formData.edad) || formData.edad <= 0) {
      newErrors.edad = "Edad debe ser un número positivo";
    }
    if (!formData.idMedicoTratante) newErrors.idMedicoTratante = "Campo obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:3000/usuarios/nuevoUsuario", formData);

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard/pacientes");
      }, 600);
    } catch (err) {
      setErrors({
        ...errors,
        name:
          err.response?.data?.message ||
          "No se pudo crear el usuario. Intenta de nuevo.",
      });
      setSuccess(false);
    }
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <h3>DATOS DEL PACIENTE</h3>

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
          <label>Edad</label>
          <input
            type="number"
            name="edad"
            className="input"
            value={formData.edad}
            onChange={handleChange}
          />
          {errors.edad && <p className="error">{errors.edad}</p>}
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

        <div className="campo">
          <label>ID Médico tratante</label>
          <input
            type="number"
            name="idMedicoTratante"
            className="input"
            value={formData.idMedicoTratante}
            onChange={handleChange}
          />
          {errors.idMedicoTratante && <p className="error">{errors.idMedicoTratante}</p>}
        </div>

        {/* INTOLERANCIAS */}
        <div className="campo">
          <label>Intolerancias</label>
          <div className="checkbox-group">
            {intoleranciasDisponibles.map(i => (
              <label key={i.idIntolerancia}>
                <input
                  type="checkbox"
                  checked={formData.intolerancias.includes(i.idIntolerancia)}
                  onChange={() => handleIntoleranciaToggle(i.idIntolerancia)}
                />
                {i.Nombre}
              </label>
            ))}
          </div>
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

        {/* Personas a cargo y resto del form igual que ya tenías */}
        {/* ... */}

        {errors.name && <span>{errors.name}</span>}

        <button type="submit">Crear Usuario</button>
        {success && <div>¡Usuario creado exitosamente!</div>}
      </form>
    </div>
  );
};

export default AgregarPaciente;
