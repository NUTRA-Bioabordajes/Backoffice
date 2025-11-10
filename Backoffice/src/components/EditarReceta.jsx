import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import "./EditarReceta.css";

const EditarReceta = () => {
  const { idReceta } = useParams();
  const navigate = useNavigate();
  const animatedComponents = makeAnimated();

  const [receta, setReceta] = useState(null);
  const [dietasDisponibles, setDietasDisponibles] = useState([]);
  const [dietasSeleccionadas, setDietasSeleccionadas] = useState([]);

  // 1️⃣ Traer receta actual
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`http://localhost:3000/recetas/${idReceta}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setReceta(data);
        if (data.dietas && Array.isArray(data.dietas)) {
          const ids = data.dietas.map((d) => Number(d.idIntolerancias));
          setDietasSeleccionadas(ids);
        }
      })
      .catch((err) => console.error(err));
  }, [idReceta]);

  // 2️⃣ Traer dietas disponibles desde la API
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch("http://localhost:3000/intolerancias", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const opciones = data.map((d) => ({
          value: Number(d.idIntolerancias),
          label: d.Nombre,
        }));
        setDietasDisponibles(opciones);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!receta) return <p>Cargando receta...</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReceta({ ...receta, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const dataToSend = {
        ...receta,
        dietas: dietasSeleccionadas.map((id) => Number(id)),
      };

      const res = await fetch(`http://localhost:3000/recetas/${idReceta}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) throw new Error("Error al actualizar receta");

      alert("Receta actualizada con éxito ✅");
      navigate("/dashboard/recetas");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="editar-receta-container">
      <h1>Editar receta</h1>
      <form onSubmit={handleSubmit} className="editar-receta-form">
        <label>Nombre:</label>
        <input
          type="text"
          name="Nombre"
          value={receta.Nombre || ""}
          onChange={handleChange}
        />

        <label>Descripción:</label>
        <textarea
          name="Descripcion"
          value={receta.Descripcion || ""}
          onChange={handleChange}
        />

        <label>Elaboración:</label>
        <textarea
          name="Elaboracion"
          value={receta.Elaboracion || ""}
          onChange={handleChange}
        />

        <label>Categoría:</label>
        <input
          type="text"
          name="idCategoria"
          value={receta.idCategoria || ""}
          onChange={handleChange}
        />

        <label>Foto (URL):</label>
        <input
          type="text"
          name="Foto"
          value={receta.Foto || ""}
          onChange={handleChange}
        />

        {/* 🆕 Selector múltiple de dietas */}
        <label>Dietas asociadas:</label>
        <Select
          closeMenuOnSelect={true}
          components={animatedComponents}
          isMulti
          options={dietasDisponibles}
          value={dietasDisponibles.filter((opt) =>
            dietasSeleccionadas.includes(opt.value)
          )}
          onChange={(selectedOptions) => {
            setDietasSeleccionadas(
              selectedOptions ? selectedOptions.map((o) => o.value) : []
            );
          }}
          placeholder="Seleccione dietas..."
        />

        {/* 🆕 Mostrar dietas actuales */}
        {receta.dietas && receta.dietas.length > 0 && (
          <div className="dietas-actuales">
            <p><strong>Intolerancias/Dietas actuales:</strong></p>
            <ul>
              {receta.dietas.map((dieta, i) => (
                <li key={i}>{dieta.Nombre}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="editar-receta-actions">
          <button type="submit" className="btn-guardar">
            Guardar cambios
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => navigate("/dashboard/recetas")}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarReceta;
