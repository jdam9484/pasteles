import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { clearCart, getCart, saveCart } from "../../services/cartStorage";
import { crearVentaDesdeCarrito } from "../../services/ventaService";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState(getCart());
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  const total = useMemo(
    () =>
      cart.reduce(
        (sum, it) => sum + Number(it.precio || 0) * Number(it.cantidad || 1),
        0
      ),
    [cart]
  );

  const removeItem = (id) => {
    const next = cart.filter((x) => x.id !== id);
    setCart(next);
    saveCart(next);
  };

  const confirmar = async () => {
    try {
      setMsg({ text: "", type: "" });
      setLoading(true);

      await crearVentaDesdeCarrito(cart);

      clearCart();
      setCart([]);

      setMsg({ text: "✅ Compra registrada. ¡Gracias!", type: "ok" });

      setTimeout(() => navigate("/cliente/dashboard", { replace: true }), 800);
    } catch (e) {
      setMsg({ text: e?.message || "Error registrando la compra", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 18, maxWidth: 900, margin: "0 auto" }}>
      <h2>Confirmar pedido</h2>

      {msg.text ? (
        <div
          style={{
            padding: 10,
            borderRadius: 12,
            margin: "10px 0",
            background: msg.type === "ok" ? "rgba(39,174,96,.12)" : "rgba(136,0,43,.10)",
            color: msg.type === "ok" ? "#27ae60" : "#88002b",
            fontWeight: 900,
          }}
        >
          {msg.text}
        </div>
      ) : null}

      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 14,
              boxShadow: "0 2px 16px rgba(0,0,0,.06)",
            }}
          >
            {cart.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid #f0f0f0",
                }}
              >
                <div>
                  <div style={{ fontWeight: 900 }}>{it.titulo}</div>
                  <small>
                    Cant: {it.cantidad} · Precio: S/ {Number(it.precio || 0).toFixed(2)}
                  </small>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 900 }}>
                    S/ {(Number(it.precio || 0) * Number(it.cantidad || 1)).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeItem(it.id)}
                    style={{
                      border: "none",
                      padding: "8px 10px",
                      borderRadius: 10,
                      cursor: "pointer",
                    }}
                  >
                    Quitar
                  </button>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontWeight: 900 }}>
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={confirmar}
            disabled={loading}
            style={{
              marginTop: 12,
              border: "none",
              background: "#88002b",
              color: "#fff",
              padding: "12px 14px",
              borderRadius: 12,
              fontWeight: 900,
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "Registrando compra..." : "Confirmar compra (demo)"}
          </button>
        </>
      )}
    </div>
  );
}
