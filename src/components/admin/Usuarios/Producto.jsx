import { useEffect, useMemo, useState } from "react";
import "./Productos.css";

import { db } from "../../firebase/config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function Productos({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // opcional: búsqueda simple (si luego quieres)
  const [search, setSearch] = useState("");

  useEffect(() => {
    // ✅ Si tus productos tienen campo "activo", usa este query:
    // const q = query(collection(db, "productos"), where("activo", "==", true));

    // ✅ Si NO tienes "activo", usa este:
    const q = query(collection(db, "productos"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProductos(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error listando productos:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filtrados = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return productos;

    return productos.filter((p) => {
      const nombre = String(p.nombre || "").toLowerCase();
      const categoria = String(p.categoria || "").toLowerCase();
      return nombre.includes(s) || categoria.includes(s);
    });
  }, [productos, search]);

  if (loading) return <div className="prodLoading">Cargando productos...</div>;

  return (
    <section className="products container" id="productos">
      <h2>Productos</h2>

      {/* 🔎 buscador opcional */}
      <div style={{ margin: "10px 0 16px" }}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "10px 12px",
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        />
      </div>

      {filtrados.length === 0 ? (
        <p style={{ color: "#777" }}>No hay productos en la base de datos.</p>
      ) : (
        <div className="box-container">
          {filtrados.map((p) => {
            // ✅ si tu BD guarda "img" usa p.img
            // ✅ si tu BD guarda "imagen" usa p.imagen
            const imgUrl = p.img || p.imagen || "";

            return (
              <div className="box" key={p.id}>
                {/* Si no quieres mostrar imagen, borra este <img> */}
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={p.nombre || "Producto"}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}

                <div>
                  <h3>{p.nombre || "-"}</h3>
                  <p>{p.categoria || "Sin categoría"}</p>

                  <p className="precio">S/ {Number(p.precio || 0).toFixed(2)}</p>

                  {p.descripcion ? <p className="descripcion">{p.descripcion}</p> : null}

                  <button
                    className="btn-3"
                    type="button"
                    onClick={() =>
                      onAddToCart(
                        {
                          id: p.id,
                          titulo: p.nombre,          // para tu carrito/ventasService
                          precio: Number(p.precio || 0),
                          img: imgUrl,
                          descripcion: p.descripcion || "",
                        },
                        1
                      )
                    }
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
