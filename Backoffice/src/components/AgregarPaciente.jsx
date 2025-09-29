import React, { useState, useEffect } from "react";
import './AgregarPaciente.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const AgregarPaciente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    edad: "",
    diagnostico: "",
    idMedicoTratante: "",
    intolerancias: [],  // Ahora será array de string
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
    const token = sessionStorage.getItem("token");

    fetch("http://localhost:3000/intolerancias", {
      headers: { Authorization: `Bearer ${token}` }
    }
)
      .then(res => res.json())
      .then(data => {
        const normalizados = data.map(i => ({
          value: String(i.idIntolerancia), // siempre string
          label: i.Nombre
        }));
        setIntoleranciasDisponibles(normalizados);
      })
      .catch(err => console.error("Error cargando intolerancias:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Mantener como string
  const handleIntoleranciasChange = (selectedOptions) => {
    const idsSeleccionados = selectedOptions
      ? selectedOptions.map(opt => opt.value)
      : [];
    setFormData(prev => ({ ...prev, intolerancias: idsSeleccionados }));
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

    // Si tu backend espera los ids como número, convierte aquí
    const dataToSend = {
      ...formData,
      intolerancias: formData.intolerancias.map(id => Number(id)),
    };

    try {
      await axios.post("http://localhost:3000/usuarios/nuevoUsuario", dataToSend);

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

  useEffect(() => {
    console.log("Intolerancias seleccionadas:", formData.intolerancias);
  }, [formData.intolerancias]);

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

        {/* INTOLERANCIAS con react-select */}
        <div className="campo">
          <label>Intolerancias</label>
          <Select
            isMulti
            options={intoleranciasDisponibles}
            value={intoleranciasDisponibles.filter(opt =>
              formData.intolerancias.includes(opt.value)
            )}
            onChange={handleIntoleranciasChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Seleccione intolerancias..."
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
          <label htmlFor="foto">Foto</label>
          <input
            type="text"
            id="foto"
            name="foto"
            className="input"
            placeholder="Foto"
            value={formData.foto}
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

        {/* PERSONA A CARGO 1 */}
        <div className="persona-cargo">
          <h3>PERSONA A CARGO 1</h3>
          <div className="campo">
            <label>Nombre</label>
            <input type="text" name="nombrePersonaACargo1" className="input" placeholder="Nombre" value={formData.nombrePersonaACargo1} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>Apellido</label>
            <input type="text" name="apellidoPersonaACargo1" className="input" placeholder="Apellido" value={formData.apellidoPersonaACargo1} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>DNI</label>
            <input type="text" name="dniPersonaACargo1" className="input" placeholder="DNI" value={formData.dniPersonaACargo1} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>Email</label>
            <input type="email" name="emailPersonaACargo1" className="input" placeholder="Email" value={formData.emailPersonaACargo1} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>Teléfono</label>
            <input type="tel" name="telefonoPersonaACargo1" className="input" placeholder="Teléfono" value={formData.telefonoPersonaACargo1} onChange={handleChange} />
          </div>
        </div>

        {/* PERSONA A CARGO 2 */}
        <div className="persona-cargo">
          <h3>PERSONA A CARGO 2</h3>
          <div className="campo">
            <label>Nombre</label>
            <input type="text" name="nombrePersonaACargo2" className="input" placeholder="Nombre" value={formData.nombrePersonaACargo2} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>Apellido</label>
            <input type="text" name="apellidoPersonaACargo2" className="input" placeholder="Apellido" value={formData.apellidoPersonaACargo2} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>DNI</label>
            <input type="text" name="dniPersonaACargo2" className="input" placeholder="DNI" value={formData.dniPersonaACargo2} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>Email</label>
            <input type="email" name="emailPersonaACargo2" className="input" placeholder="Email" value={formData.emailPersonaACargo2} onChange={handleChange} />
          </div>
          <div className="campo">
            <label>Teléfono</label>
            <input type="tel" name="telefonoPersonaACargo2" className="input" placeholder="Teléfono" value={formData.telefonoPersonaACargo2} onChange={handleChange} />
          </div>
        </div>

        {errors.name && <span>{errors.name}</span>}   

        <button type="submit" className="boton-enviar">Crear Usuario</button>
        {success && <div>¡Usuario creado exitosamente!</div>}
      </form>
    </div>
  );
};

export default AgregarPaciente;