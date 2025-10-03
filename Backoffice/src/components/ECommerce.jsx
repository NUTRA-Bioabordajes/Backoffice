import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Ecommerce.css";

const Ecommerce = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    const token = sessionStorage.getItem("token");

    setLoading(true);
    fetch("http://localhost:3000/productos", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al traer los productos");
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
  };

  // 🔴 Eliminar producto
  const handleDelete = async (idProducto) => {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/productos/${idProducto}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Error al eliminar el producto");

      setProductos(productos.filter((p) => p.idProducto !== idProducto));
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // 🟡 Editar producto
  const handleEdit = (idProducto) => {
    navigate(`/dashboard/editarProducto/${idProducto}`);
  };

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
                <th>Acciones</th>
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
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => handleEdit(p.idProducto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleDelete(p.idProducto)}
                    >
                      Eliminar
                    </button>
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
