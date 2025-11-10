import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Layout from './components/Layout';
import Home from './components/Home';
import Pacientes from './components/Pacientes';
import Recetas from './components/Recetas';
import AgregarPaciente from './components/AgregarPaciente';
import AgregarReceta from './components/AgregarReceta';
import EditarReceta from './components/EditarReceta';
import EditarPaciente from './components/EditarPaciente';
import Novedades from './components/Novedades';
import AgregarNovedades from './components/AgregarNovedades';
import EditarNovedades from './components/EditarNovedades';
import Roles from './components/Roles';





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
          <Route path="agregarPaciente" element={<AgregarPaciente />} />
          <Route path="agregarReceta" element={<AgregarReceta />} />
          <Route path="editarReceta/:idReceta" element={<EditarReceta />} />
          <Route path="editarPaciente/:idPaciente" element={<EditarPaciente />} />
          <Route path="novedades" element={<Novedades />} />
          <Route path="agregarNovedades" element={<AgregarNovedades />} />
          <Route path="editarNovedades/:id" element={<EditarNovedades />} />
          <Route path="roles" element={<Roles />} />






        </Route>

        {/* Página por defecto si no coincide ninguna */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;