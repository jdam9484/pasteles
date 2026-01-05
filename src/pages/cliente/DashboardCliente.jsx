import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashboardCliente.css";


import Navbar from "../../components/cliente/NavbarCliente.jsx";
import Hero from "../../components/cliente/Hero.jsx";
import InfoBanner from "../../components/cliente/InfoBanner";
import Carrito from "../../components/cliente/Carrito.jsx";
import Productos from "../../components/cliente/Productos.jsx";
import Servicios from "../../components/cliente/Servicios.jsx";
import Footer from "../../components/cliente/Footer";


import { getCart, saveCart, clearCart } from "../../services/cartStorage.js";
import AppPromo from "../../components/cliente/AppPromo.jsx";

export default function DashboardCliente() {
  const navigate = useNavigate();

  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, text: "" });
  const [items, setItems] = useState(getCart());

  // guardar carrito
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const cartCount = useMemo(
    () => items.reduce((acc, it) => acc + (it.cantidad || 0), 0),
    [items]
  );

  const cartTotal = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + (it.precio || 0) * (it.cantidad || 0),
        0
      ),
    [items]
  );

  const showToast = (text) => {
    setToast({ show: true, text });
    setTimeout(() => setToast({ show: false, text: "" }), 1200);
  };

  const addToCart = (product, cantidad = 1) => {
    console.log('Intentando agregar al carrito:', product, 'Cantidad:', cantidad);
    setItems((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) {
        const updated = prev.map((p) =>
          p.id === product.id
            ? { ...p, cantidad: (p.cantidad || 1) + cantidad }
            : p
        );
        console.log('Carrito actualizado (producto ya estaba):', updated);
        return updated;
      }
      const nuevo = [...prev, { ...product, cantidad }];
      console.log('Carrito actualizado (nuevo producto):', nuevo);
      return nuevo;
    });
    showToast("Producto agregado al carrito");
    setCartOpen(true);
  };

  const removeItem = (id) =>
    setItems((prev) => prev.filter((p) => p.id !== id));

  const setQty = (id, qty) => {
    setItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, cantidad: Math.max(1, qty) } : p
      )
    );
  };

  const clearCartUI = () => {
    setItems([]);
    clearCart();
  };

  // ✅ SOLO navegar
  const goPay = () => {
    if (items.length === 0) {
      showToast("Tu carrito está vacío");
      return;
    }
    navigate("/checkout");
  };

  useEffect(() => {
    console.log('Estado actual del carrito (items):', items);
    saveCart(items);
  }, [items]);

  return (
    <div className="cliente-root">
      <Navbar
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onLoginClick={() => (window.location.href = "/iniciar-sesion")}
      />
      <Hero />
      <div className="container" style={{ paddingTop: 18 }}>
        <Servicios />
        <InfoBanner />
        <Productos onAddToCart={addToCart} />
        <AppPromo />
      </div>
      <Carrito
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={items}
        total={cartTotal}
        onRemove={removeItem}
        onSetQty={setQty}
        onClear={clearCartUI}
        onPay={goPay}
      />
      {toast.show && <div className="toast">{toast.text}</div>}
      <Footer />
    </div>
  );
}
