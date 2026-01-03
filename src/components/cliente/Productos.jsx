import { useMemo, useState } from "react";
import "./Productos.css";
import { productosData } from "../../data/productosData";

// 1. Encapsulamos todo en una función de componente y recibimos onAddToCart como prop
export default function Productos({ onAddToCart }) {
  const [qty, setQty] = useState({});
  const [visible, setVisible] = useState(4);

  /* NOTA: He eliminado el useMemo que usabas para inicializar 'qty'.
     No es necesario pre-llenar el estado; basta con usar la lógica 
     (qty[p.id] || 1) que ya tienes en el input y en el botón.
     Esto hace que el componente sea más rápido y limpio.
  */

  const list = useMemo(() => productosData.slice(0, visible), [visible]);

  const dec = (id) =>
    setQty((s) => ({ ...s, [id]: Math.max(1, (s[id] || 1) - 1) }));

  const inc = (id) =>
    setQty((s) => ({ ...s, [id]: Math.min(10, (s[id] || 1) + 1) }));

  return (
    <main className="products container" id="productos">
      <h2>Productos</h2>
      <div className="box-container">
        {list.map((p) => (
          <div className="box" key={p.id}>
            {p.img ? (
              <img
                src={p.img}
                alt={p.nombre}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : null}
            <div>
              <h3>{p.nombre}</h3>
              <p>Alta Calidad</p>
              <p className="precio">S/ {Number(p.precio || 0).toFixed(2)}</p>
              <p className="porciones">Porciones: {p.porciones}</p>
              <p className="descripcion">{p.desc}</p>
              
              <div className="cantidad-control">
                <button type="button" onClick={() => dec(p.id)}>-</button>
                {/* Si no existe en el estado, mostramos 1 por defecto */}
                <input value={qty[p.id] || 1} readOnly />
                <button type="button" onClick={() => inc(p.id)}>+</button>
              </div>

              <button
                className="agregar"
                type="button"
                onClick={() =>
                  // Verificamos que la función exista antes de ejecutarla
                  onAddToCart && onAddToCart(
                    {
                      id: p.id,
                      nombre: p.nombre,
                      precio: p.precio,
                      img: p.img,
                      desc: p.desc,
                      porciones: p.porciones,
                      categoria: p.categoria,
                    },
                    qty[p.id] || 1 // Enviamos la cantidad actual o 1
                  )
                }
              >
                Agregar al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Botón Cargar Más */}
      {visible < productosData.length && (
        <div className="load-more" onClick={() => setVisible((v) => v + 4)}>
          Cargar Más
        </div>
      )}
    </main>
  );
}