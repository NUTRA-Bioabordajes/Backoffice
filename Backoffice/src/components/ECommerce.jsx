import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Ecommerce.css";

const Ecommerce = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/productos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error al traer los productos");
        }
        return res.json();
      })
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-text">Cargando productos...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="productos-container">
      <h1 className="titulo">Productos</h1>
      <Link to="/dashboard/agregarProducto" className="agregar-producto-link">
        + Agregar Producto
      </Link>

      {productos.length === 0 ? (
        <p className="sin-productos-text">No hay productos registrados</p>
      ) : (
        <div className="tabla-wrapper">
          <table className="tabla-productos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Foto</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p) => (
                <tr key={p.idProducto} className="fila-producto">
                  <td>{p.idProducto}</td>
                  <td>{p.Nombre}</td>
                  <td>{p.Descripcion}</td>
                  <td>${p.Precio}</td>
                  
                  <td>
                    {p.Foto ? (
                      <img
                        src={p.Foto}
                        alt={p.Nombre}
                        className="foto-producto"
                      />
                    ) : (
                      "Sin foto"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Ecommerce;
