import "./ProductoModal.css";
import UploadcareUploader from "../../common/UploadcareUploader.jsx";

export default function ProductoModal({
  open,
  mode,
  saving,
  form,
  onChange,
  onClose,
  onSave,
}) {
  if (!open) return null;
const CATEGORIAS = ["Tortas", "Postres", "Bebidas", "Salados"];

  return (
    <div className="pmOverlay" onClick={onClose}>
      <div className="pmModal" onClick={(e) => e.stopPropagation()}>
        <div className="pmHead">
          <h3>{mode === "create" ? "Crear producto" : "Editar producto"}</h3>
          <button className="pmClose" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="pmBody">
          <div className="pmGrid">
            <div className="pmField">
              <label>Nombre</label>
              <input value={form.nombre} onChange={(e) => onChange("nombre", e.target.value)} />
            </div>

        <div className="pmField">
        <label>Categoría</label>
        <select
            value={form.categoria}
            onChange={(e) => onChange("categoria", e.target.value)}
        >
            {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
                {c}
            </option>
            ))}
        </select>
        </div>


            <div className="pmField">
              <label>Precio (S/)</label>
              <input
                type="number"
                step="0.01"
                value={form.precio}
                onChange={(e) => onChange("precio", e.target.value)}
              />
            </div>

            <div className="pmField">
              <label>Stock</label>
              <input
                type="number"
                value={form.stock}
                onChange={(e) => onChange("stock", e.target.value)}
              />
            </div>

            <div className="pmField pmFull">
              <label>Descripción</label>
              <textarea
                rows={3}
                value={form.descripcion}
                onChange={(e) => onChange("descripcion", e.target.value)}
              />
            </div>

            {/* ✅ Uploadcare reutilizable */}
            <div className="pmField pmFull">
              <label>Imagen</label>

              <div className="pmUploadRow">
                <UploadcareUploader
                  pubkey="b82e25c1f25672453e61"
                  onUploaded={(url) => onChange("img", url)}
                />

                <button
                  type="button"
                  className="pmBtn pmGhost"
                  onClick={() => onChange("img", "")}
                  disabled={saving}
                >
                  Quitar
                </button>
              </div>

              {form.img ? (
                <div className="pmPreview">
                  <img src={form.img} alt="preview" />
                </div>
              ) : (
                <small className="pmHint">Sube una imagen y se guardará como URL en Firestore (img).</small>
              )}
            </div>
          </div>
        </div>

        <div className="pmActions">
          <button className="pmBtn pmGhost" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="pmBtn" type="button" onClick={onSave} disabled={saving}>
            {saving ? "Guardando..." : mode === "create" ? "Crear" : "Actualizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
