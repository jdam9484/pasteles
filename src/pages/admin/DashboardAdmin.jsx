import { useEffect, useMemo, useState } from "react";
import "./DashboardAdmin.css";

import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

import Sidebar from "../../components/admin/Sidebar.jsx";
import UsuarioCard from "../../components/admin/UsuarioCard.jsx";

import { listenUsuarios } from "../../services/usuarioService";
import { listenVentas } from "../../services/listenVentas";

export default function DashboardAdmin() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalUsuarios = usuarios.length;

  const { totalVentas, totalIngresos } = useMemo(() => {
    const totalVentasCalc = ventas.reduce((acc, v) => {
      if (Array.isArray(v.items)) {
        return acc + v.items.reduce((s, i) => s + (i.cantidad || 0), 0);
      }
      return acc + 1;
    }, 0);

    const totalIngresosCalc = ventas.reduce((sum, v) => sum + (v.total || 0), 0);

    return { totalVentas: totalVentasCalc, totalIngresos: totalIngresosCalc };
  }, [ventas]);

  useEffect(() => {
    // Suscripción en tiempo real a usuarios
      const unsubUsuarios = listenUsuarios(
      (arr) => {
        setUsuarios(arr);
        setLoading(false);
      },
      () => {
        setUsuarios([]);
        setLoading(false);
      }
    );
      // Suscripción en tiempo real a ventas
      const unsubVentas = listenVentas(
        (arr) => {
          setVentas(arr);
        },
        () => {
          setVentas([]);
        }
      );
      return () => {
        unsubUsuarios && unsubUsuarios();
        unsubVentas && unsubVentas();
      };
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    navigate("/registro", { replace: true });
  };

  if (loading) return <div style={{ padding: 24 }}>Cargando dashboard...</div>;

  return (
    <div className="admin-root">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onGoReportes={() => navigate("/admin/reportes")}
        onGoUsuarios={() => navigate("/admin/usuarios")}
        onGoProductos={() => navigate("/admin/productos")}
        onNavigate={(to) => navigate(to)}
        onLogout={handleLogout}
      />

      <section className={`home-section ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <nav>
          <div className="sidebar-button">
            <button className="nav-toggle" type="button" onClick={() => setSidebarOpen((v) => !v)}>
              {sidebarOpen ? "Ocultar" : "Mostrar"}
            </button>
            <span className="dashboard">Dashboard</span>
          </div>

          <div className="profile-details">
            <img src="/assets/LogoPasteleria.PNG" alt="Logo" />
            <span className="admin_name">Administrador</span>
          </div>
        </nav>

        <div className="home-content">
          {/* ✅ Card del usuario en sesión */}
          <div className="session-card-row">
            <UsuarioCard />
          </div>

          {/* lo demás como lo tienes */}

          <div className="overview-boxes">
            <div className="box">
              <div className="box-topic">Total Usuarios</div>
              <div className="number">{totalUsuarios}</div>
              <div className="indicator-row">
                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                  <span style={{display: 'flex', justifyContent: 'center'}}>
                    {/* icono usuario */}
                    <svg width="38" height="38" fill="#b48a6e" style={{background:'#f5f6fa', borderRadius:'8px', padding:'4px'}} viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.5-1.8 4.5-4.5S14.7 3 12 3 7.5 4.8 7.5 7.5 9.3 12 12 12zm0 1.5c-3 0-9 1.5-9 4.5V21h18v-3c0-3-6-4.5-9-4.5z"/></svg>
                  </span>
                  <span className="text">Registrados</span>
                </span>
              </div>
            </div>

            <div className="box">
              <div className="box-topic">Total Ventas</div>
              <div className="number">{totalVentas}</div>
              <div className="indicator-row">
                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                  <span style={{display: 'flex', justifyContent: 'center'}}>
                    {/* icono carrito */}
                    <svg width="38" height="38" fill="#b48a6e" style={{background:'#f5f6fa', borderRadius:'8px', padding:'4px'}} viewBox="0 0 24 24"><path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM7.334 16h9.332c.822 0 1.542-.502 1.847-1.267l3.333-8A1 1 0 0 0 21 5H6.21l-.94-2.342A1 1 0 0 0 4.333 2H1v2h2.333l3.6 8.59-1.35 2.44C4.52 15.37 5.48 17 7.334 17zm12.666-9-2.76 6.627A1 1 0 0 1 16.334 15H7.334l1.1-2h7.332a1 1 0 0 0 .95-.684l2.284-5.316A1 1 0 0 0 20 7z"/></svg>
                  </span>
                  <span className="text">Productos vendidos</span>
                </span>
              </div>
            </div>

            <div className="box">
              <div className="box-topic">Ingresos</div>
              <div className="number">S/ {Number(totalIngresos || 0).toFixed(2)}</div>
              <div className="indicator-row">
                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%'}}>
                  <span style={{display: 'flex', justifyContent: 'center'}}>
                    {/* icono dinero */}
                    <svg width="38" height="38" fill="#b48a6e" style={{background:'#f5f6fa', borderRadius:'8px', padding:'4px'}} viewBox="0 0 24 24"><path d="M12 4C7.03 4 3 8.03 3 13c0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7 0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.87-3.13 7-7 7zm-1-10h2v2h-2zm0 4h2v4h-2z"/></svg>
                  </span>
                  <span className="text">Ganancia estimada</span>
                </span>
              </div>
            </div>
          </div>

          {/* Usuarios Recientes y Registro de Ventas */}
          <div style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginTop: 14}}>
            {/* Usuarios Recientes */}
            <div style={{background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 18, minWidth: 0}}>
              <div className="title" style={{color: '#900C3F', fontSize: '1.5em', marginBottom: 10, textAlign: 'center'}}>Usuarios Recientes</div>
              <table className="tabla-visual" style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.length === 0 ? (
                    <tr><td colSpan="3" className="empty">No hay usuarios</td></tr>
                  ) : (
                    usuarios.slice(0, 6).map(u => (
                      <tr key={u.id}>
                        <td style={{fontWeight: 700}}>{u.nombre || u.displayName || 'Sin nombre'}</td>
                        <td>{u.email || '-'}</td>
                        <td>
                          <span className={u.rol === 'Administrador' ? 'role-badge role-admin' : 'role-badge role-cliente'}>
                            {u.rol || 'cliente'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Registro de Ventas */}
            <div style={{background: '#fff', borderRadius: 14, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', padding: 18, minWidth: 0}}>
              <div className="title" style={{color: '#900C3F', fontSize: '1.5em', marginBottom: 10, textAlign: 'center'}}>Registro de Ventas</div>
              <table className="tabla-visual" style={{width: '100%'}}>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Producto</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.length === 0 ? (
                    <tr><td colSpan="3" className="empty">No hay ventas</td></tr>
                  ) : (
                    ventas.slice(0, 6).map(v => (
                      <tr key={v.id}>
                        <td style={{fontWeight: 700}}>{v.usuario || v.nombreUsuario || 'Sin usuario'}<br/>
                          <span className="muted" style={{fontSize: '0.9em'}}>{v.fecha ? new Date(v.fecha).toLocaleString() : ''}</span>
                        </td>
                        <td className="producto-cell">
                          {Array.isArray(v.items) ? (
                            <ul style={{margin: 0, paddingLeft: 18}}>
                              {v.items.map((item, idx) => (
                                <li key={idx}>{item.nombre} (x{item.cantidad})</li>
                              ))}
                            </ul>
                          ) : (
                            <span>-</span>
                          )}
                        </td>
                        <td className="total-cell">S/ {Number(v.total || 0).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
