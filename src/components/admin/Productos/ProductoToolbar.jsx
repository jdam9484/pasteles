import "./ProductoToolbar.css";

export default function ProductoToolbar({
  categorias,
  search,
  filtroCat,
  onSearch,
  onFiltroCat,
}) {
  return (
    <div className="pt">
      <div className="ptTitle">Listado</div>

      <div className="ptRow">
        <input
          className="ptSearch"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Buscar por título o categoría..."
        />

        <select className="ptSelect" value={filtroCat} onChange={(e) => onFiltroCat(e.target.value)}>
          {categorias.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
