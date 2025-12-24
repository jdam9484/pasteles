import "./UsuariosTable.css";

export default function UsuariosTable({ loading, usuarios, rootUid, onToggleRol, onDelete }) {
  if (loading) return <div className="utLoading">Cargando usuarios...</div>;

  return (
    <div className="utWrap">
      <table className="utTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th style={{ width: 260 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="4" className="utEmpty">No hay usuarios</td>
            </tr>
          ) : (
            usuarios.map((u) => {
              const isRoot = u.id === rootUid;
              const rol = u.rol || "cliente";
              const isAdmin = rol === "Administrador";

              return (
                <tr key={u.id}>
                  <td className="utStrong">{u.nombre || "-"}</td>
                  <td>{u.email || "-"}</td>
                  <td>
                    <span className={`utBadge ${isAdmin ? "admin" : "cli"}`}>
                      {isRoot ? "Administrador (root)" : rol}
                    </span>
                  </td>

                  <td className="utActions">
                    <button
                      className="utBtn"
                      type="button"
                      onClick={() => onToggleRol(u)}
                      disabled={isRoot}
                      title={isRoot ? "Root admin no se puede modificar" : ""}
                    >
                      {isAdmin ? "Hacer cliente" : "Hacer admin"}
                    </button>

                    <button
                      className="utBtn utDanger"
                      type="button"
                      onClick={() => onDelete(u)}
                      disabled={isRoot}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
