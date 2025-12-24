import "./Carrito.css";

export default function Carrito({
  open,
  onClose,
  items,
  total,
  onRemove,
  onSetQty,
  onClear,
  onPay,
}) {
  if (!open) return null;

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-card" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h3>Mi Carrito</h3>
          <button className="cart-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-body">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Cant.</th>
                <th>Importe</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="cart-empty">
                    Carrito vacío
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      <img className="cart-img" src={it.img} alt={it.titulo} />
                    </td>
                    <td>
                      <div className="cart-title">{it.titulo}</div>
                      <div className="cart-desc">{it.descripcion || ""}</div>
                    </td>
                    <td>S/ {Number(it.precio).toFixed(2)}</td>
                    <td>
                      <div className="qty">
                        <button type="button" onClick={() => onSetQty(it.id, it.cantidad - 1)}>-</button>
                        <span>{it.cantidad}</span>
                        <button type="button" onClick={() => onSetQty(it.id, it.cantidad + 1)}>+</button>
                      </div>
                    </td>
                    <td className="cart-importe">
                      S/ {(it.precio * it.cantidad).toFixed(2)}
                    </td>
                    <td>
                      <button className="cart-remove" type="button" onClick={() => onRemove(it.id)}>
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            Total: <span>S/ {Number(total || 0).toFixed(2)}</span>
          </div>

          <div className="cart-actions">
            <button className="cart-btn" type="button" onClick={onClear}>
              Vaciar
            </button>
            <button className="cart-btn cart-btn-pay" type="button" onClick={onPay}>
              Pagar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
