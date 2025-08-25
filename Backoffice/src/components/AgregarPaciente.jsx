import React, { useState } from "react";
import './AgregarPaciente.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgregarPaciente = () => {
  // States para inputs
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    edad: "",
    diagnostico: "",
    idMedicoTratante: "",
    intolerancia: "",
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
  //const [dropdownOpen, setDropdownOpen] = useState(false);
  //const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Estados para intolerancias
 // const [intoleranciasDisponibles, setIntoleranciasDisponibles] = useState([]);
  //const [intoleranciasSeleccionadas, setIntoleranciasSeleccionadas] = useState([]);
  //const [search, setSearch] = useState("");

  /*useEffect(() => {
    fetch("https://actively-close-beagle.ngrok-free.app/intolerancias")
      .then(res => {
        if (!res.ok) throw new Error(`Error status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Data API intolerancias:", data);
        //setIntoleranciasDisponibles(data); 
      })
      .catch(err => console.error("Error cargando intolerancias:", err));
  }, []);*/
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  /*const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFormData(prev => ({ ...prev, estudioLaboratorio: e.target.files[0] || null }));
  };*/

  /*const handleIntoleranciaSelect = (intolerancia) => {
    if (!intoleranciasSeleccionadas.includes(intolerancia)) {
      setIntoleranciasSeleccionadas(prev => [...prev, intolerancia]);
    }
  };*/

 /* const handleIntoleranciaRemove = (intolerancia) => {
    setIntoleranciasSeleccionadas(prev => prev.filter(i => i !== intolerancia));
  };*/

  const validate = () => {
    const newErrors = {};
    if (!formData.edad || isNaN(formData.edad) || formData.edad <= 0) {
      newErrors.edad = "Edad debe ser un número positivo";
    }
    if (!formData.idMedicoTratante) newErrors.idMedicoTratante = "Campo obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setErrors({});
    setSuccess(false);

    const url = new URL (`http://localhost:3000/usuarios/nuevoUsuario`)

    try {
      console.log("url", url)
      await axios.post(
        url.toString(),
        {
          ...formData,

        },
      );

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
  

  // Filtrado para búsqueda
  /*const filteredIntolerancias = intoleranciasDisponibles.filter(i =>
    i.nombre.toLowerCase().includes(search.toLowerCase())
  );*/
  

  return (
    <>
      <div className="form-container">
        <form className="formulario" onSubmit={handleSubmit}>
          <h3>DATOS DEL PACIENTE</h3>

          <div className="campo">
            <label htmlFor="nombreApellido">Nombre</label>
            <input type="text" id="nombreApellido" name="nombre" className="input" placeholder="Nombre" value={formData.nombre} onChange={handleChange}
            />
           
          </div>

          <div className="campo">
            <label htmlFor="nombreApellido">Apellido</label>
            <input type="text" id="nombreApellido" name="apellido" className="input" placeholder="Apellido" value={formData.apellido} onChange={handleChange}
            />
            
          </div>

          <div className="campo">
            <label htmlFor="dniCuil">DNI</label><input  type="text"  id="dni"  name="dni"  className="input"  placeholder="DNI o CUIL"  value={formData.dni}  onChange={handleChange}/>
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
            <label htmlFor="idMedicoTratante"> ID Médico tratante</label>
            <input type="number" id="idMedicoTratante" name="idMedicoTratante" className="input" placeholder="Médico tratante" value={formData.idMedicoTratante} onChange={handleChange}
            />
            {errors.idMedicoTratante && <p className="error">{errors.idMedicoTratante}</p>}
          </div>
          <div className="campo">


          <label htmlFor="intolerancias">Intolerancia</label>
          <input type="number" id="intolerancia" name="intolerancia" placeholder="Buscar intolerancia..." value={formData.intolerancia} onChange={handleChange} className="input"
          />

          <div className="campo">
            <label htmlFor="foto">Foto</label>
            <input type="text" id="foto" name="foto" className="input" placeholder="Foto" value={formData.foto} onChange={handleChange}
            />
          </div>
          {/* Dropdown con todas las opciones o filtradas */}
          {/*dropdownOpen && (
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
              )*/}

          {/* Lista de intolerancias seleccionadas */}
         {/*<div className="selected-list">
            {intoleranciasSeleccionadas.map(i => (
              <div key={i} className="selected-item">
                {i} <span onClick={() => handleIntoleranciaRemove(i)}>✕</span>
              </div>
            ))}
            </div>*/}
        </div>


        <div className="campo">
            <label htmlFor="sexo">Sexo</label>
            <input type="text" id="sexo" name="sexo" className="input" placeholder="Sexo" value={formData.sexo} onChange={handleChange}
            />
          </div>

          <div className="campo">
            <label htmlFor="barrio">Barrio</label>
            <input type="text" id="barrio" name="barrio" className="input" placeholder="Barrio" value={formData.barrio} onChange={handleChange}
            />
          </div>

         
          <div className="persona-cargo">
            <h3>PERSONA A CARGO 1</h3>
            <div className="campo">
              <label>Nombre</label>
              <input type="text" name="nombrePersonaACargo1" className="input" placeholder="Nombre" value={formData.nombrePersonaACargo1} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>Apellido</label>
              <input type="text" name="apellidoPersonaACargo1" className="input" placeholder="Apellido" value={formData.apellidoPersonaACargo1} onChange={handleChange}
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
              <label>Nombre</label>
              <input type="text" name="nombrePersonaACargo2" className="input" placeholder="Nombre" value={formData.nombrePersonaACargo2} onChange={handleChange}
              />
            </div>
            <div className="campo">
              <label>Apellido</label>
              <input type="text" name="apellidoPersonaACargo2" className="input" placeholder="Apellido" value={formData.apellidoPersonaACargo2} onChange={handleChange}
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
          {errors.name && <span>{errors.name}</span>}

          <button type="submit" >Crear Usuario</button>
            {success && (
              <div >¡Usuario creado exitosamente!</div>
            )}
        </form>
      </div>
    </>
  );
}

export default AgregarPaciente;
