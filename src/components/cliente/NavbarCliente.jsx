import { useEffect, useState } from "react";
import "./NavbarCliente.css";

import { auth, db } from "../../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function NavbarCliente({ cartCount, onOpenCart, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);
      setPerfil(null);

      if (u) {
        try {
          const snap = await getDoc(doc(db, "user", u.uid));
          setPerfil(snap.exists() ? snap.data() : null);
        } catch {
          setPerfil(null);
        }
      }
    });

    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="nav container">
      <a className="nav-logo" href="#inicio">
        <img src="/assets/LogoPasteleria.PNG" alt="Logo Pastelería" />
      </a>

      <button className="nav-burger" onClick={() => setMenuOpen((v) => !v)} type="button">
        ☰
      </button>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
        <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
        <a href="#productos" onClick={() => setMenuOpen(false)}>Producto</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
      </nav>

      <div className="nav-right">
        {/* Usuario o botón login */}
        {user ? (
          <div className="nav-user">
            <span className="nav-welcome">
              {perfil?.nombre ? `Hola, ${perfil.nombre}` : "Sesión activa"}
            </span>
            <button className="nav-logout" type="button" onClick={logout}>
              Cerrar sesión
            </button>
          </div>
        ) : (
          <button className="nav-login" type="button" onClick={onLoginClick}>
            Iniciar sesión
          </button>
        )}

        {/* Carrito */}
        <button className="nav-cart" type="button" onClick={onOpenCart}>
          <img src="/assets/car.svg" alt="carrito" />
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </div>
  );
}
