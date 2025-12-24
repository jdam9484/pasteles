import "./Sidebar.css";
import { useLocation } from "react-router-dom";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "📊" },
  { to: "/admin/usuarios", label: "Usuarios", icon: "👤" },
  { to: "/admin/productos", label: "Productos", icon: "📦" },
  { to: "/admin/reportes", label: "Reportes", icon: "🧾" },
];

export default function Sidebar({ isOpen, onToggle, onNavigate, onLogout }) {
  const { pathname } = useLocation();

  return (
    <aside className={`sb ${isOpen ? "sb--open" : "sb--closed"}`}>
      <div className="sb__top">
        <div className="sb__brand">
          <div className="sb__mark">AP</div>
          {isOpen && <div className="sb__name">AdminPanel</div>}
        </div>

        <button className="sb__toggle" type="button" onClick={onToggle} aria-label="Toggle sidebar">
          {isOpen ? "⟨" : "⟩"}
        </button>
      </div>

      <div className="sb__nav">
        {NAV.map((item) => {
          const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
          return (
            <button
              key={item.to}
              type="button"
              className={`sb__item ${active ? "sb__item--active" : ""}`}
              onClick={() => onNavigate(item.to)}
              aria-label={item.label}
            >
              <span className="sb__icon" aria-hidden="true">
                {item.icon}
              </span>

              {isOpen && <span className="sb__label">{item.label}</span>}

              {/* Tooltip cuando está cerrado */}
              {!isOpen && <span className="sb__tip">{item.label}</span>}
            </button>
          );
        })}
      </div>

    </aside>
  );
}
