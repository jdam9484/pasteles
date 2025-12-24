import { useMemo, useState } from "react";
import "./Productos.css";

const PRODUCTS = [
  {
    id: "1",
    titulo: "Cheesecake de Maracuya",
    precio: 70,
    porciones: 1,
    img: "/assets/Postre_MussMara.jpg",
    descripcion:
      "Suave y cremoso cheesecake bañado con reducción de maracuyá natural.",
  },
  {
    id: "2",
    titulo: "Torta Selva Negra",
    precio: 70,
    porciones: 1,
    img: "/assets/Torta_Selva_Negra.jpg",
    descripcion: "Deliciosa torta de chocolate ideal para celebraciones.",
  },
  {
    id: "3",
    titulo: "Torta 3 Leches",
    precio: 70,
    porciones: 2,
    img: "/assets/Torta_3Leches.JPG",
    descripcion: "Exquisita torta bañada en tres leches.",
  },
  {
    id: "4",
    titulo: "Empanada de Queso",
    precio: 5,
    porciones: 1,
    img: "/assets/Salado_EmpanadaQueso.jpg",
    descripcion: "Clásica empanada de queso.",
  },
];

export default function Productos({ onAddToCart }) {
  const [qty, setQty] = useState(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.id, 1]))
  );
  const [visible, setVisible] = useState(4);

  const list = useMemo(() => PRODUCTS.slice(0, visible), [visible]);

  const dec = (id) => setQty((s) => ({ ...s, [id]: Math.max(1, (s[id] || 1) - 1) }));
  const inc = (id) => setQty((s) => ({ ...s, [id]: Math.min(10, (s[id] || 1) + 1) }));

  return (
    <main className="products container" id="productos">
      <h2>Productos</h2>

      <div className="box-container">
        {list.map((p) => (
          <div className="box" key={p.id}>
            <img src={p.img} alt={p.titulo} />
            <div>
              <h3>{p.titulo}</h3>
              <p>Alta Calidad</p>
              <p className="precio">S/ {p.precio.toFixed(2)}</p>
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
                    { id: p.id, titulo: p.titulo, precio: p.precio, img: p.img, descripcion: p.descripcion },
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

      {visible < PRODUCTS.length && (
        <div className="load-more" onClick={() => setVisible((v) => v + 4)}>
          Cargar Más
        </div>
      )}
    </main>
  );
}
