import {Link, Outlet} from "react-router-dom"
import React from "react";


const Layout = () => {

    return(
    <>
        <nav>
            <Link to = "/home">Home</Link>
            <Link to = "/ver-receta">Ver Receta</Link>
            <Link to = "/ver-paciente">Ver Paciente</Link>
        </nav>
        <Outlet />
    </>

    )
        
}
export default Layout;