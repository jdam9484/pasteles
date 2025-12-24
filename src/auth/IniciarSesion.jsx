import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./IniciarSesion.css";

import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function IniciarSesion() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);

  const [mensaje, setMensaje] = useState({ text: "", type: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ text: "", type: "" });

    const correoLimpio = correo.trim();

    try {
      setLoading(true);

      // 1) Login en Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, correoLimpio, clave);

      // 2) Leer perfil desde Firestore para obtener rol
      const snap = await getDoc(doc(db, "user", cred.user.uid));

      if (!snap.exists()) {
        setMensaje({
          text: "Iniciaste sesión, pero no se encontró tu perfil en Firestore.",
          type: "error",
        });
        return;
      }

      const perfil = snap.data();
      const rol = String(perfil?.rol || "cliente").toLowerCase();

      // (Opcional) mensaje rápido
      setMensaje({
        text: `¡Bienvenido${perfil?.nombre ? ", " + perfil.nombre : ""}!`,
        type: "ok",
      });

      // 3) ✅ Redirección por rol
      if (rol === "administrador" || rol === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/cliente/dashboard", { replace: true });
      }
    } catch (error) {
      setMensaje({
        text: error?.message || "Correo o contraseña incorrectos.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          autoComplete="email"
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          autoComplete="current-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      {mensaje.text && (
        <div className={`mensaje ${mensaje.type === "ok" ? "mensaje--ok" : "mensaje--error"}`}>
          {mensaje.text}
        </div>
      )}

      <p className="login-footer">
        ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </div>
  );
}
