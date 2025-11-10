import React, { useState, useEffect } from "react";
import './AgregarPaciente.css';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';


const AgregarPaciente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    edad: "",
    diagnostico: "",
    idMedicoTratante: "",
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
  const animatedComponents = makeAnimated();
  const [intoleranciasDisponibles, setIntoleranciasDisponibles] = useState([]);
  const [medicosDisponibles, setMedicosDisponibles] = useState([]);
  const [intolerancias, setIntolerancias] = useState([]); // array de números

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Traer intolerancias desde la API
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:3000/intolerancias", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        // Convertimos a array de objetos {value:number,label:string}
        const opciones = data.map(i => ({
          value: Number(i.idIntolerancias),
          label: i.Nombre
        }));
        setIntoleranciasDisponibles(opciones);
      })
      .catch(err => console.error(err));
  }, []);

  // Traer medicos desde la API
  useEffect(() => {
    const token = sessionStorage.getItem("token");
  
    const fetchMedicos = async () => {
      try {
        const res = await fetch("http://localhost:3000/usuariosBack/medicos", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (!res.ok) {
          console.error("Error al traer médicos:", res.statusText);
          setMedicosDisponibles([]);
          return;
        }
  
        const data = await res.json();
        console.log("DATA MEDICOS:", data); 
  
        const opciones = data.map((m) => ({
          value: Number(m.id), 
          label: `${m.Nombre} ${m.Apellido}`,
        }));
  
        setMedicosDisponibles(opciones);
        console.log("Opciones médicos:", opciones);
      } catch (err) {
        console.error("Error en fetch médicos:", err);
        setMedicosDisponibles([]);
      }
    };
  
    fetchMedicos();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Enviamos los IDs de intolerancias como números
    const dataToSend = {
      ...formData,
      intolerancias: intolerancias.map(id => Number(id)),
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
          <label>Medico</label>
          <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          isMulti={false} 
          options={medicosDisponibles}
          value={medicosDisponibles.find(opt => opt.value === formData.idMedicoTratante)}
          onChange={(selectedOption) => {
            setFormData(prev => ({ ...prev, idMedicoTratante: selectedOption?.value || "" }));
          }}
          placeholder="Seleccione el médico..."
        />
      </div>

{/* NUEVO: Intolerancias */}
<div className="campo">
  <label>Dietas</label>
  <Select
  closeMenuOnSelect={true}       // cierra al seleccionar
  components={animatedComponents}
  isMulti
  options={intoleranciasDisponibles}
  value={intoleranciasDisponibles.filter(opt => intolerancias.includes(opt.value))}
  onChange={(selectedOptions) => {
    setIntolerancias(selectedOptions ? selectedOptions.map(o => o.value) : []);
  }}
  placeholder="Seleccione dietas..."
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
