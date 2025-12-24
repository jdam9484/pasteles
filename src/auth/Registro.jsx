import { useState } from "react";
import "./Registro.css";
import IniciarSesion from "./IniciarSesion";
import { Link, useNavigate } from "react-router-dom";
// Firebase (recomendado con npm, NO con scripts en HTML)
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [loading, setLoading] = useState(false);

  // mensaje: { text: string, type: "ok" | "error" | "" }
  const [mensaje, setMensaje] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ text: "", type: "" });

    const nombreLimpio = nombre.trim();
    const correoLimpio = correo.trim();
    const rol = "cliente";

    try {
      setLoading(true);

      // 1) Crear usuario en Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, correoLimpio, clave);

      // 2) Crear documento en Firestore (colección 'user')
      await setDoc(doc(db, "user", cred.user.uid), {
        nombre: nombreLimpio,
        correo: correoLimpio,
        rol,
        createdAt: serverTimestamp(),
      });

      setMensaje({
        text: "¡Registro exitoso! Ahora puedes iniciar sesión.",
        type: "ok",
      });

      // Reset formulario
      setNombre("");
      setCorreo("");
      setClave("");
    } catch (error) {
      setMensaje({
        text: error?.message || "Ocurrió un error al registrar.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-container">
      <h2>Registro de Usuario</h2>

      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          autoComplete="name"
        />

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
          autoComplete="new-password"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>

      {mensaje.text && (
        <div className={`mensaje ${mensaje.type === "ok" ? "mensaje--ok" : "mensaje--error"}`}>
          {mensaje.text}
        </div>
      )}

      <p className="registro-footer">
        ¿Ya tienes cuenta? <Link to="/iniciar-sesion">Inicia sesión</Link>
      </p>
    </div>
  );
}
