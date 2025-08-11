import React, { useEffect, useState } from "react";
import './AgregarPaciente.css';

const AgregarPaciente = () => {
  // States for inputs
  const [formData, setFormData] = useState({
    nombreApellido: "",
    dniCuil: "",
    edad: "",
    diagnostico: "",
    medicoTratante: "",
    estudioLaboratorio: null,
    alergiasIgG: [],
    intoleranciasIgG: [],
    sexo: "",
    barrio: "",
    nombrePersonaACargo1: "",
    dniPersonaACargo1: "",
    emailPersonaACargo1: "",
    telefonoPersonaACargo1: "",
    nombrePersonaACargo2: "",
    dniPersonaACargo2: "",
    emailPersonaACargo2: "",
    telefonoPersonaACargo2: "",
  });

  // States for dropdown options
  const [alergiasOptions, setAlergiasOptions] = useState([]);
  const [intoleranciasOptions, setIntoleranciasOptions] = useState([]);
  const [sexoOptions, setSexoOptions] = useState([]);

  // Estado para archivo cargado
  const [file, setFile] = useState(null);

  // Estados para validación simple
  const [errors, setErrors] = useState({});

  // Simular fetch a API para cargar opciones
  useEffect(() => {
    fetch("/api/alergias")
      .then((res) => res.json())
      .then((data) => setAlergiasOptions(data))
      .catch(() => setAlergiasOptions([]));

    fetch("/api/intolerancias")
      .then((res) => res.json())
      .then((data) => setIntoleranciasOptions(data))
      .catch(() => setIntoleranciasOptions([]));

    fetch("/api/sexos")
      .then((res) => res.json())
      .then((data) => setSexoOptions(data))
      .catch(() => setSexoOptions([]));
  }, []);

  // Handle cambios en inputs normales
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle cambio archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData(prev => ({
      ...prev,
      estudioLaboratorio: e.target.files[0] || null,
    }));
  };

  // Handle cambio multiselect
  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const values = Array.from(options)
      .filter(option => option.selected)
      .map(option => option.value);
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  // Validación mínima
  const validate = () => {
    const newErrors = {};
    if (!formData.edad || isNaN(formData.edad) || formData.edad <= 0) {
      newErrors.edad = "Edad debe ser un número positivo";
    }
    if (!formData.medicoTratante) {
      newErrors.medicoTratante = "Campo obligatorio";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Enviar datos paciente:", formData);
    alert("Datos enviados con éxito (ver consola).");
  };

  return (
    <>
      <div class="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="campo">
          <label htmlFor="nombre">Nombre y Apellido del paciente</label>
          <input type="text" id="nombre" className="input" placeholder="Tipo aquí" />
        </div>

        <div className="campo">
          <label htmlFor="edad">Edad</label>
          <input type="text" id="edad" className="input" placeholder="Tipo aquí" />
        </div>

        <div className="campo">
          <label htmlFor="diagnostico">Diagnóstico</label>
          <input type="text" id="diagnostico" className="input" placeholder="Tipo aquí" />
        </div>

        <div className="campo">
          <label htmlFor="medico">Médico tratante</label>
          <input type="text" id="medico" className="input" placeholder="Tipo aquí" />
        </div>

        <div className="campo">
          <label htmlFor="lab">Establecimiento Laboratorio</label>
          <select id="lab" className="select">
            <option value="">Selecciona opción</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="alergias">Tiene alergias IgE</label>
          <select id="alergias" className="select">
            <option value="">Selecciona opción</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="intolerancias">Tiene intolerancias IgG</label>
          <select id="intolerancias" className="select">
            <option value="">Selecciona opción</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="sexo">Sexo</label>
          <select id="sexo" className="select">
            <option value="">Selecciona opción</option>
          </select>
        </div>

        <div className="campo">
          <label htmlFor="barrio">Barrio</label>
          <input type="text" id="barrio" className="input" placeholder="Tipo aquí" />
        </div>

        <div className="persona-cargo">
        <h3>PERSONA A CARGO 1</h3>
        
          <div className="campo">
            <label>Nombre y Apellido</label>
            <input type="text" className="input" placeholder="Tipo aquí" />
          </div>
        
          <div className="campo">
            <label>DNI</label>
            <input type="text" className="input" placeholder="DNI PERSONA A CARGO 1" />
          </div>
        
          <div className="campo">
            <label>Email</label>
            <input type="email" className="input" placeholder="Email PERSONA A CARGO 1" />
          </div>
        
          <div className="campo">
            <label>Teléfono</label>
            <input type="tel" className="input" placeholder="Teléfono PERSONA A CARGO 1" />
          </div>
        </div>
        
        <div className="persona-cargo">
          <h3>PERSONA A CARGO 2</h3>
        
          <div className="campo">
            <label>Nombre y Apellido</label>
            <input type="text" className="input" placeholder="Tipo aquí" />
          </div>
        
          <div className="campo">
            <label>DNI</label>
            <input type="text" className="input" placeholder="DNI PERSONA A CARGO 2" />
          </div>
        
          <div className="campo">
            <label>Email</label>
            <input type="email" className="input" placeholder="Email PERSONA A CARGO 2" />
          </div>
        
          <div className="campo">
            <label>Teléfono</label>
            <input type="tel" className="input" placeholder="Teléfono PERSONA A CARGO 2" />
          </div>
        </div>


        <button type="submit" className="boton-enviar">ENVIAR</button>
      </form>
      </div>
    </>
  );
};

export default AgregarPaciente;
