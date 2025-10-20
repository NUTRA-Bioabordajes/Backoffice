import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./Novedades.css";

const EditarNovedades = () => {
  const { id } = useParams(); // idNovedad
  const navigate = useNavigate();
  const [novedad, setNovedad] = useState({
    idNovedad: "", // importante: coincidimos con lo que espera el backend
    nombre: "",
    descripcion: "",
    flyer: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Traer la novedad por ID
  useEffect(() => {
    const fetchNovedad = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await fetch(`http://localhost:3000/novedades/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener la novedad");

        const data = await res.json();
        setNovedad({
          idNovedad: data.id, // asignamos id al campo que espera el backend
          nombre: data.nombre,
          descripcion: data.descripcion,
          flyer: data.flyer,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchNovedad();
  }, [id]);

  // 🔹 Enviar actualización al backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch("http://localhost:3000/novedades", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idNovedad: novedad.idNovedad, // enviamos solo para identificar la fila
          nombre: novedad.nombre,
          descripcion: novedad.descripcion,
          flyer: novedad.flyer,
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar la novedad");

      alert("✅ Novedad actualizada correctamente");
      navigate("/dashboard/novedades");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleChange = (e) => {
    setNovedad({ ...novedad, [e.target.name]: e.target.value });
  };

  if (loading) return <p className="loading-text">Cargando novedad...</p>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="editar-container">
      <h1 className="titulo">Editar Novedad</h1>

      <form onSubmit={handleSubmit} className="form-novedad">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={novedad.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={novedad.descripcion}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Flyer (URL):</label>
          <input
            type="text"
            name="flyer"
            value={novedad.flyer}
            onChange={handleChange}
          />
        </div>

        <div className="botones-form">
          <button type="submit" className="btn-guardar">
            Guardar Cambios
          </button>
          <Link to="/dashboard/novedades" className="btn-cancelar">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditarNovedades;
