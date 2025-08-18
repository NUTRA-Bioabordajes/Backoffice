import React, { useState, useEffect } from "react";
import './AgregarPaciente.css';

const AgregarPaciente = () => {
  // States para inputs
  const [formData, setFormData] = useState({
    nombreApellido: "",
    dniCuil: "",
    edad: "",
    diagnostico: "",
    medicoTratante: "",
    estudioLaboratorio: null,
    alergiasIgE: "",
    intoleranciasIgG: "",
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});

  // Estados para intolerancias
  const [intoleranciasDisponibles, setIntoleranciasDisponibles] = useState([]);
  const [intoleranciasSeleccionadas, setIntoleranciasSeleccionadas] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://actively-close-beagle.ngrok-free.app/intolerancias")
      .then(res => {
        if (!res.ok) throw new Error(`Error status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Data API intolerancias:", data);
        setIntoleranciasDisponibles(data); 
      })
      .catch(err => console.error("Error cargando intolerancias:", err));
  }, []);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData(prev => ({ ...prev, estudioLaboratorio: e.target.files[0] || null }));
  };

  const handleIntoleranciaSelect = (intolerancia) => {
    if (!intoleranciasSeleccionadas.includes(intolerancia)) {
      setIntoleranciasSeleccionadas(prev => [...prev, intolerancia]);
    }
  };

  const handleIntoleranciaRemove = (intolerancia) => {
    setIntoleranciasSeleccionadas(prev => prev.filter(i => i !== intolerancia));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.edad || isNaN(formData.edad) || formData.edad <= 0) {
      newErrors.edad = "Edad debe ser un número positivo";
    }
    if (!formData.medicoTratante) newErrors.medicoTratante = "Campo obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const envioFinal = {
      ...formData,
      intoleranciasSeleccionadas
    };

    console.log("Enviar datos paciente:", envioFinal);
    alert("Datos enviados con éxito (ver consola).");
  };

  // Filtrado para búsqueda
  const filteredIntolerancias = intoleranciasDisponibles.filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase())
  );
  

  return (
    <>
      <div className="form-container">
        <form className="formulario" onSubmit={handleSubmit}>
          <h3>DATOS DEL PACIENTE</h3>

          <div className="campo">
            <label htmlFor="nombreApellido">Nombre y Apellido</label>
            <input type="text" id="nombreApellido" name="nombreApellido" className="input" placeholder="Nombre y Apellido" value={formData.nombreApellido} onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="dniCuil">DNI / CUIL</label><input  type="text"  id="dniCuil"  name="dniCuil"  className="input"  placeholder="DNI o CUIL"  value={formData.dniCuil}  onChange={handleChange}/>
          </div>

          <div className="campo">
            <label htmlFor="edad">Edad</label>
            <input type="number" id="edad" name="edad" className="input" placeholder="Edad" value={formData.edad} onChange={handleChange}
            />
            {errors.edad && <p className="error">{errors.edad}</p>}
          </div>

          <div className="campo">
            <label htmlFor="diagnostico">Diagnóstico</label>
            <input type="text" id="diagnostico" name="diagnostico" className="input" placeholder="Diagnóstico" value={formData.diagnostico} onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="medicoTratante">Médico tratante</label>
            <input type="text" id="medicoTratante" name="medicoTratante" className="input" placeholder="Médico tratante" value={formData.medicoTratante} onChange={handleChange}
            />
            {errors.medicoTratante && <p className="error">{errors.medicoTratante}</p>}
          </div>
          <div className="campo">


          <label htmlFor="intolerancias">Intolerancias</label>
          <input type="text" placeholder="Buscar intolerancia..." value={search} onChange={e => setSearch(e.target.value)} className="input" onFocus={() => setDropdownOpen(true)} onBlur={() => setTimeout(() => setDropdownOpen(false), 150)} // pequeño delay para click
          />

          {/* Dropdown con todas las opciones o filtradas */}
          {dropdownOpen && (
            <div className="dropdown-list">
              {(search ? filteredIntolerancias : intoleranciasDisponibles).map(i => (
                <div
                  key={i.id}
                  className="dropdown-item"
                  onClick={() => handleIntoleranciaSelect(i.nombre)}
                >
                  {i.nombre}
                </div>
              ))}
              { (search ? filteredIntolerancias : intoleranciasDisponibles).length === 0 && (
                <div className="dropdown-item">No se encontraron opciones</div>
              )}
            </div>
          )}

          {/* Lista de intolerancias seleccionadas */}
          <div className="selected-list">
            {intoleranciasSeleccionadas.map(i => (
              <div key={i} className="selected-item">
                {i} <span onClick={() => handleIntoleranciaRemove(i)}>✕</span>
              </div>
            ))}
          </div>
        </div>
          <div className="campo">
            <label htmlFor="estudioLaboratorio">Estudio Laboratorio</label>
            <input type="file" id="estudioLaboratorio" name="estudioLaboratorio" className="input" onChange={handleFileChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="alergiasIgE">¿Tiene alergias IgE?</label>
            <select id="alergiasIgE" name="alergiasIgE" className="select" value={formData.alergiasIgE} onChange={handleChange} required>
              <option value="">Selecciona opción</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="intoleranciasIgG">¿Tiene intolerancias IgG?</label>
            <select id="intoleranciasIgG" name="intoleranciasIgG" className="select" value={formData.intoleranciasIgG} onChange={handleChange} required >
              <option value="">Selecciona opción</option>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="sexo">Sexo</label>
            <select id="sexo" name="sexo" className="select" value={formData.sexo} onChange={handleChange} required
            >
              <option value="">Selecciona opción</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="barrio">Barrio</label>
            <input type="text" id="barrio" name="barrio" className="input" placeholder="Barrio" value={formData.barrio} onChange={handleChange}
            />
          </div>

         
          <div className="persona-cargo">
            <h3>PERSONA A CARGO 1</h3>
            <div className="campo">
              <label>Nombre y Apellido</label>
              <input type="text" name="nombrePersonaACargo1" className="input" placeholder="Nombre y Apellido" value={formData.nombrePersonaACargo1} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>DNI</label>
              <input type="text" name="dniPersonaACargo1" className="input" placeholder="DNI" value={formData.dniPersonaACargo1} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>Email</label>
              <input type="email" name="emailPersonaACargo1" className="input" placeholder="Email" value={formData.emailPersonaACargo1} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>Teléfono</label>
              <input type="tel" name="telefonoPersonaACargo1" className="input" placeholder="Teléfono" value={formData.telefonoPersonaACargo1} onChange={handleChange}
              />
            </div>
          </div>

          <div className="persona-cargo">
            <h3>PERSONA A CARGO 2</h3>
            <div className="campo">
              <label>Nombre y Apellido</label>
              <input type="text" name="nombrePersonaACargo2" className="input" placeholder="Nombre y Apellido" value={formData.nombrePersonaACargo2} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>DNI</label>
              <input type="text" name="dniPersonaACargo2" className="input" placeholder="DNI" value={formData.dniPersonaACargo2} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>Email</label>
              <input type="email" name="emailPersonaACargo2" className="input" placeholder="Email" value={formData.emailPersonaACargo2} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>Teléfono</label>
              <input type="tel" name="telefonoPersonaACargo2" className="input" placeholder="Teléfono" value={formData.telefonoPersonaACargo2} onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="boton-enviar">ENVIAR</button>
        </form>
      </div>
    </>
  );
};

export default AgregarPaciente;
