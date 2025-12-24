import { useEffect, useMemo, useState } from "react";
import "./DashboardAdmin.css";

import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/authService";

import Sidebar from "../../components/admin/Sidebar.jsx";
import UsuarioCard from "../../components/admin/UsuarioCard.jsx";

import { db } from "../../firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

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
    const cargar = async () => {
      try {
        setLoading(true);

        let users = [];
        try {
          const qUsers = query(collection(db, "user"), orderBy("fechaRegistro", "desc"));
          const snap = await getDocs(qUsers);
          users = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

          if (users.length > 0 && users.every((u) => !u.fechaRegistro)) {
            const qByName = query(collection(db, "user"), orderBy("nombre"));
            const snap2 = await getDocs(qByName);
            users = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
          }
        } catch {
          const qByName = query(collection(db, "user"), orderBy("nombre"));
          const snap2 = await getDocs(qByName);
          users = snap2.docs.map((d) => ({ id: d.id, ...d.data() }));
        }
        setUsuarios(users);

        let sales = [];
        try {
          const qVentas = query(collection(db, "ventas"), orderBy("fecha", "desc"));
          const snapV = await getDocs(qVentas);
          sales = snapV.docs.map((d) => ({ id: d.id, ...d.data() }));
        } catch {
          sales = [];
        }
        setVentas(sales);
      } finally {
        setLoading(false);
      }
    };

    cargar();
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
                <span className="text">Registrados</span>
              </div>
            </div>

            <div className="box">
              <div className="box-topic">Total Ventas</div>
              <div className="number">{totalVentas}</div>
              <div className="indicator-row">
                <span className="text">Productos vendidos</span>
              </div>
            </div>

            <div className="box">
              <div className="box-topic">Ingresos</div>
              <div className="number">S/ {Number(totalIngresos || 0).toFixed(2)}</div>
              <div className="indicator-row">
                <span className="text">Ganancia estimada</span>
              </div>
            </div>
          </div>

          {/* tus tablas aquí igual... */}
          {/* ... */}
        </div>
      </section>
    </div>
  );
}
