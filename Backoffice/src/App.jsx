import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Home from './components/Home';
import Pacientes from './components/Pacientes';
import Recetas from './components/Recetas';
import ECommerce from './components/ECommerce';
import AgregarPaciente from './components/AgregarPaciente';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas privadas */}
        <Route path="/dashboard" element={<Layout />}>
          <Route path="home" element={<Home />} />
          <Route path="pacientes" element={<Pacientes />} />
          <Route path="recetas" element={<Recetas />} />
          <Route path="ecommerce" element={<ECommerce />} />
          <Route path="agregarPaciente" element={<AgregarPaciente />} />

        </Route>

        {/* Página por defecto si no coincide ninguna */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;