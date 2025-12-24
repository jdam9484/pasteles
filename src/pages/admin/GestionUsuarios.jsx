import { useEffect, useMemo, useState } from "react";
import "./GestionUsuarios.css";

import { listenUsuarios, setUsuarioRol, deleteUsuarioPerfil } from "../../services/usuarioService.js";
import UsuariosTable from "../../components/admin/Usuarios/UsuariosTable.jsx";


const ROOT_ADMIN_UID = "MjlZlAGO1Jb63nTYR0V8cdMceoy2";

export default function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const unsub = listenUsuarios(
      (data) => {
        console.log("[GestionUsuarios] usuarios =", data.length);
        setUsuarios(data);
        setLoading(false);
      },
      (err) => {
        setMsg({ text: err?.message || "Error listando usuarios", type: "error" });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filtrados = useMemo(() => {
    const s = search.trim().toLowerCase();
    return usuarios.filter((u) => {
      const nombre = String(u.nombre || "").toLowerCase();
      const email = String(u.email || "").toLowerCase();
      const rol = String(u.rol || "").toLowerCase();
      return !s || nombre.includes(s) || email.includes(s) || rol.includes(s);
    });
  }, [usuarios, search]);

  const onToggleRol = async (u) => {
    if (u.id === ROOT_ADMIN_UID) return;

    const current = u.rol || "cliente";
    const next = current === "Administrador" ? "cliente" : "Administrador";

    try {
      await setUsuarioRol(u.id, next);
      setMsg({ text: `Rol actualizado: ${u.email} → ${next}`, type: "ok" });
    } catch (e) {
      setMsg({ text: e?.message || "Error cambiando rol", type: "error" });
    }
  };

  const onDelete = async (u) => {
    if (u.id === ROOT_ADMIN_UID) return;

    const ok = window.confirm(
      "¿Eliminar este usuario?\n\nNota: solo se borrará el perfil en Firestore (no Auth)."
    );
    if (!ok) return;

    try {
      await deleteUsuarioPerfil(u.id);
      setMsg({ text: "Usuario eliminado (Firestore) 🗑️", type: "ok" });
    } catch (e) {
      setMsg({ text: e?.message || "Error eliminando usuario", type: "error" });
    }
  };

  return (
    <div className="guPage">
      <div className="guHeader">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p>Promover a Administrador / volver a cliente · Eliminar (excepto root)</p>
        </div>
      </div>

      <div className="guTools">
        <input
          className="guSearch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre / email / rol..."
        />
      </div>

      {msg.text ? (
        <div className={`guMsg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>
      ) : null}

      <UsuariosTable
        loading={loading}
        usuarios={filtrados}
        rootUid={ROOT_ADMIN_UID}
        onToggleRol={onToggleRol}
        onDelete={onDelete}
      />
    </div>
  );
}
