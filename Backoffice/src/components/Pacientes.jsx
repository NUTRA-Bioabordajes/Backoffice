import { Link } from "react-router-dom";
import React from "react";
import './Pacientes.css';

const Pacientes = () => {
    return (
        <>
            <h1>Pacientes</h1>
            <Link to="/dashboard/agregarPaciente" className="agregar-paciente-link">+ Agregar Paciente</Link>
        </>
    );
};

export default Pacientes;