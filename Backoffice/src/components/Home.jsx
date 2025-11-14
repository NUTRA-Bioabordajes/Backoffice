import { Link, useNavigate } from "react-router-dom";
import React from "react";

const Home = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminamos el token de sessionStorage
    sessionStorage.removeItem("token");
    // Redirigimos al login
    navigate("/");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      gap: "2rem"
    }}>
      <img src="/src/assets/images/logo.png" alt="Logo" style={{ maxWidth: "200px" }} />
      
      {/* Botón de cerrar sesión */}
      <button 
        onClick={handleLogout} 
        style={{
          padding: "10px 20px",
          backgroundColor: "#E0CAC7",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "1rem"
        }}
      >Cerrar sesión</button>


    </div>
  );
};

export default Home;
