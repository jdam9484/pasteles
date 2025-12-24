import "./ProductosTable.css";

export default function ProductosTable({ loading, productos, onEdit, onDelete }) {
  if (loading) return <div className="ptLoading">Cargando productos...</div>;

  return (
    <div className="ptWrap">
      <table className="ptTable">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th style={{ width: 210 }}>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.length === 0 ? (
            <tr>
              <td colSpan="5" className="ptEmpty">
                No hay productos
              </td>
            </tr>
          ) : (
            productos.map((p) => (
              <tr key={p.id}>
                <td className="ptStrong">{p.nombre || "-"}</td>
                <td>{p.categoria || "-"}</td>
                <td>S/ {Number(p.precio || 0).toFixed(2)}</td>
                <td>{Number(p.stock || 0)}</td>
                <td className="ptActions">
                  <button className="ptBtn" type="button" onClick={() => onEdit(p)}>
                    Editar
                  </button>
                  <button
                    className="ptBtn ptBtnDanger"
                    type="button"
                    onClick={() => onDelete(p.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
