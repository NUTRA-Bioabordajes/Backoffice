//import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from "react";
import './App.css'
import Layout from './components/Layout'
import Home from './components/Home'
import VerPaciente from './components/VerPaciente'
import VerReceta from './components/VerReceta'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
              <Route path="/home" element={<Home  />}></Route>
              <Route path="/ver-paciente" element={<VerPaciente />}></Route>
              <Route path="/ver-receta" element={<VerReceta />}></Route>
              <Route path="*" element={<h1>404</h1>}></Route>
          </Route>

        </Routes>
      
      </BrowserRouter>
    </>
  )
}

export default App
