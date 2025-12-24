import { useEffect, useMemo, useState } from "react";
import "./Productos.css";

import { db } from "../../firebase/config";
import { collection, onSnapshot, query } from "firebase/firestore";

function normalizeImg(value) {
  if (!value) return "";
  const s = String(value).trim();
  if (!s) return "";

  // ✅ ya es url
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // ✅ si guardaste solo el UUID de uploadcare
  if (/^[a-z0-9-]{10,}$/i.test(s)) return `https://ucarecdn.com/${s}/`;

  // ✅ si guardaste ruta local
  if (s.startsWith("assets/")) return `/${s}`;

  // fallback
  return s;
}

export default function Productos({ onAddToCart }) {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [qty, setQty] = useState({});
  const [visible, setVisible] = useState(4);

  useEffect(() => {
    const q = query(collection(db, "productos"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => {
          const raw = d.data();

          // ✅ tu campo real se llama "imagen"
          const imgUrl = normalizeImg(raw.imagen);

          return {
            id: d.id,
            titulo: raw.nombre || raw.titulo || "-",
            precio: Number(raw.precio || 0),
            porciones: Number(raw.porciones || 1),
            descripcion: raw.descripcion || "",
            img: imgUrl, // ✅ guardamos como img para usar en UI/carrito
          };
        });

        setProductos(data);

        setQty((prev) => {
          const next = { ...prev };
          for (const p of data) if (next[p.id] == null) next[p.id] = 1;
          return next;
        });

        setLoading(false);
      },
      (err) => {
        console.error("Error leyendo productos:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const list = useMemo(() => productos.slice(0, visible), [productos, visible]);

  const dec = (id) =>
    setQty((s) => ({ ...s, [id]: Math.max(1, (s[id] || 1) - 1) }));

  const inc = (id) =>
    setQty((s) => ({ ...s, [id]: Math.min(10, (s[id] || 1) + 1) }));

  if (loading) {
    return (
      <main className="products container" id="productos">
        <h2>Productos</h2>
        <p style={{ color: "#777" }}>Cargando productos...</p>
      </main>
    );
  }

  return (
    <main className="products container" id="productos">
      <h2>Productos</h2>

      {productos.length === 0 ? (
        <p style={{ color: "#777" }}>No hay productos en la base de datos.</p>
      ) : (
        <>
          <div className="box-container">
            {list.map((p) => (
              <div className="box" key={p.id}>
                {/* ✅ ahora sí usa p.img */}
                {p.img ? (
                  <img
                    src={p.img}
                    alt={p.titulo}
                    onError={(e) => {
                      console.warn("Imagen no cargó:", p.img);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}

                <div>
                  <h3>{p.titulo}</h3>
                  <p>Alta Calidad</p>
                  <p className="precio">S/ {Number(p.precio || 0).toFixed(2)}</p>
                  <p className="porciones">Porciones: {p.porciones}</p>
                  <p className="descripcion">{p.descripcion}</p>

                  <div className="cantidad-control">
                    <button type="button" onClick={() => dec(p.id)}>-</button>
                    <input value={qty[p.id] || 1} readOnly />
                    <button type="button" onClick={() => inc(p.id)}>+</button>
                  </div>

                  <button
                    className="agregar"
                    type="button"
                    onClick={() =>
                      onAddToCart(
                        {
                          id: p.id,
                          titulo: p.titulo,
                          precio: p.precio,
                          img: p.img, // ✅
                          descripcion: p.descripcion,
                        },
                        qty[p.id] || 1
                      )
                    }
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
          </div>

          {visible < productos.length && (
            <div className="load-more" onClick={() => setVisible((v) => v + 4)}>
              Cargar Más
            </div>
          )}
        </>
      )}
    </main>
  );
}
