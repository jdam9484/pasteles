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

  const logout = async () => await signOut(auth);

  const navItems = [
    { ico: "🏠", txt: "Inicio", href: "#inicio" },
    { ico: "🧁", txt: "Servicios", href: "#servicios" },
    { ico: "🛍️", txt: "Producto", href: "#productos" },
    { ico: "📞", txt: "Contacto", href: "#contacto" },
  ];

  return (
    <nav className="nav">
      {/* Logo */}
      <a className="nav-logo" href="#inicio">
        <img src="/assets/LogoPasteleria.PNG" alt="Logo Pastelería" />
      </a>

      {/* Burger móvil */}
      <button
        className="nav-burger"
        onClick={() => setMenuOpen((v) => !v)}
        type="button"
      >
        ☰
      </button>

      {/* Lista de enlaces */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        {navItems.map((item, idx) => (
          <li className="nav-item" key={idx} onClick={() => setMenuOpen(false)}>
            <a href={item.href} className="nav-link">
              <span className="nav-ico">{item.ico}</span>
              <span className="nav-txt">{item.txt}</span>
            </a>
          </li>
        ))}
      </ul>

      {/* Área derecha: usuario y carrito */}
      <div className="nav-right">
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

        <button className="nav-cart" type="button" onClick={onOpenCart}>
          <img src="/assets/car.svg" alt="carrito" />
          <span className="cart-count">{cartCount}</span>
        </button>
      </div>
    </nav>
  );
}
