import { useMemo, useState } from "react";
import "./DashboardCliente.css";

import Navbar from "../../components/cliente/NavbarCliente.jsx";
import Carrito from "../../components/cliente/Carrito.jsx";
import Servicios from "../../components/cliente/Servicios.jsx";
import InfoSlider from "../../components/cliente/InfoSlider.jsx";
import Productos from "../../components/cliente/Productos.jsx";
import AppPromo from "../../components/cliente/AppPromo.jsx";
import Footer from "../../components/cliente/Footer.jsx";

export default function DashboardCliente() {
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "" });

  // items: {id, titulo, precio, img, descripcion, cantidad}
  const [items, setItems] = useState([]);

  const cartCount = useMemo(
    () => items.reduce((acc, it) => acc + (it.cantidad || 0), 0),
    [items]
  );

  const cartTotal = useMemo(
    () => items.reduce((acc, it) => acc + (it.precio || 0) * (it.cantidad || 0), 0),
    [items]
  );

  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: "" }), 1200);
  };

  const addToCart = (product, cantidad) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      }
      return [...prev, { ...product, cantidad }];
    });
    showToast("Producto agregado al carrito");
    setCartOpen(true);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  };

  const setQty = (id, qty) => {
    setItems((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, qty) } : p))
    );
  };

  const clearCart = () => setItems([]);

  const goPay = () => {
    // aquí puedes navegar a tu ruta de pago
    // navigate("/pago");
    alert("Ir a pagar (crea tu ruta /pago si quieres).");
  };

  return (
    <div className="cliente-root">
      <header className="cliente-header" id="inicio">
        <img className="bg" src="/assets/bg.png" alt="" />

        <Navbar
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          onLoginClick={() => (window.location.href = "/login")} // o navigate("/login")
        />

        <div className="header-content container">
          <div className="header-txt">
            <h1>
              <span>Bienvenido </span>disfruta de nuestros platillos
            </h1>

            <p>
              En cada bocado descubrirás el secreto de nuestras recetas familiares.
              Utilizamos ingredientes frescos y naturales para crear postres que no
              solo endulzan el paladar, sino que celebran los momentos más especiales
              de tu vida.
            </p>

            <div className="actions">
              <a href="#productos" className="btn-1">Información</a>

              {/* Buscador simple (opcional) */}
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Buscar torta..."
                  onChange={(e) => {
                    const q = e.target.value.toLowerCase();
                    // en Productos puedes hacer el filtro real, aquí es placeholder
                    // o puedes guardar q en estado y pasarlo a Productos
                  }}
                />
              </div>
            </div>
          </div>

          <div className="header-img">
            <img src="/assets/sel_sf.png" alt="" />
          </div>
        </div>
      </header>

      {/* Secciones como tu HTML */}
      <Servicios />
      <InfoSlider />
      <Productos onAddToCart={addToCart} />

      {/* App promo */}
      <AppPromo />

      <Footer />

      {/* Carrito */}
      <Carrito
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        total={cartTotal}
        onRemove={removeItem}
        onSetQty={setQty}
        onClear={clearCart}
        onPay={goPay}
      />

      {/* Toast */}
      {toast.show && <div className="toast">{toast.text}</div>}
    </div>
  );
}
