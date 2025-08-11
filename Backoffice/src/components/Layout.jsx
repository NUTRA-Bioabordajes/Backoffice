import { Link, Outlet } from "react-router-dom";
import React from "react";
import "./Layout.css";

const Layout = () => {
    return (
        <>
        
            <nav>
                <h1>Menú</h1>
                <Link to="/dashboard/home">Home</Link>
                <Link to="/dashboard/recetas">Recetas</Link>
                <Link to="/dashboard/pacientes">Pacientes</Link>
                <Link to="/dashboard/ecommerce">E-Commerce</Link>
            </nav>
            <Outlet />
        </>
    );
};

export default Layout;
