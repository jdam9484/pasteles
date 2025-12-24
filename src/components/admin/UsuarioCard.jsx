import { useEffect, useState } from "react";
import "./UsuarioCard.css";

import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function UsuarioCard() {
  const [loading, setLoading] = useState(true);
  const [perfil, setPerfil] = useState(null);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setLoading(true);

      if (!user) {
        setAuthUser(null);
        setPerfil(null);
        setLoading(false);
        return;
      }

      setAuthUser(user);

      try {
        const snap = await getDoc(doc(db, "user", user.uid));
        setPerfil(snap.exists() ? snap.data() : null);
      } catch {
        setPerfil(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="usuarioMini usuarioMini--loading">
        <span className="usuarioMini-dot" />
        <span>Cargando...</span>
      </div>
    );
  }

  if (!authUser) {
    return null; // si no hay sesión, no muestres nada en el navbar
  }

  const nombre = perfil?.nombre || "Usuario";
  const rol = perfil?.rol || "cliente";
  const rolLower = String(rol).toLowerCase();
  const isAdmin = rolLower === "administrador" || rolLower === "admin";

  return (
    <div className="usuarioMini" title={authUser.email || ""}>
      <div className="usuarioMini-avatar">{(nombre?.[0] || "U").toUpperCase()}</div>

      <div className="usuarioMini-text">
        <div className="usuarioMini-name">{nombre}</div>
      </div>

      <span className={`usuarioMini-badge ${isAdmin ? "badge-admin" : "badge-cliente"}`}>
        {rol}
      </span>
    </div>
  );
}
