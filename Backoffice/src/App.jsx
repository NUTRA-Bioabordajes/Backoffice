import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Home from './components/Home';
import VerPaciente from './components/VerPaciente';
import VerReceta from './components/VerReceta';

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
          <Route path="ver-paciente" element={<VerPaciente />} />
          <Route path="ver-receta" element={<VerReceta />} />
        </Route>

        {/* Página por defecto si no coincide ninguna */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;