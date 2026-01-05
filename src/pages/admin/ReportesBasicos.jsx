import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./ReportesBasicos.css";
import { collection, getDocs, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

export default function ReportesBasicos() {
  const [periodo, setPeriodo] = useState("dia");
  const [ventas, setVentas] = useState([]);
  const [topProductos, setTopProductos] = useState([]);
  const chartRef = useRef();
  const chartInstance = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    cargarReportes();
    // eslint-disable-next-line
  }, [periodo]);

  async function cargarReportes() {
    // Traer ventas
    const q = query(collection(db, "ventas"), orderBy("fecha", "desc"));
    const snap = await getDocs(q);
    const ventasArr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    setVentas(ventasArr);
    // Agrupar ventas por periodo
    let labels = [], data = [], ventasPorPeriodo = {};
    let now = new Date();
    if (periodo === "dia") {
      for (let i = 6; i >= 0; i--) {
        let d = new Date(now);
        d.setDate(now.getDate() - i);
        let key = d.toISOString().slice(0, 10);
        ventasPorPeriodo[key] = 0;
        labels.push(key);
      }
      ventasArr.forEach((v) => {
        let fecha = v.fecha && v.fecha.toDate ? v.fecha.toDate().toISOString().slice(0, 10) : "";
        if (ventasPorPeriodo[fecha] !== undefined) {
          ventasPorPeriodo[fecha] += v.total || 0;
        }
      });
    } else if (periodo === "semana") {
      for (let i = 5; i >= 0; i--) {
        let d = new Date(now);
        d.setDate(now.getDate() - i * 7);
        let year = d.getFullYear();
        let week = getWeekNumber(d);
        let key = `${year}-S${week}`;
        ventasPorPeriodo[key] = 0;
        labels.push(key);
      }
      ventasArr.forEach((v) => {
        if (!v.fecha || !v.fecha.toDate) return;
        let d = v.fecha.toDate();
        let year = d.getFullYear();
        let week = getWeekNumber(d);
        let key = `${year}-S${week}`;
        if (ventasPorPeriodo[key] !== undefined) {
          ventasPorPeriodo[key] += v.total || 0;
        }
      });
    } else if (periodo === "mes") {
      for (let i = 5; i >= 0; i--) {
        let d = new Date(now);
        d.setMonth(now.getMonth() - i);
        let key = d.toISOString().slice(0, 7);
        ventasPorPeriodo[key] = 0;
        labels.push(key);
      }
      ventasArr.forEach((v) => {
        let fecha = v.fecha && v.fecha.toDate ? v.fecha.toDate().toISOString().slice(0, 7) : "";
        if (ventasPorPeriodo[fecha] !== undefined) {
          ventasPorPeriodo[fecha] += v.total || 0;
        }
      });
    }
    data = labels.map((l) => ventasPorPeriodo[l]);
    // Graficar
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Ventas (S/)",
            data,
            borderColor: "#900C3F",
            backgroundColor: "#900C3F22",
            fill: true,
            tension: 0.3,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
    // Productos más vendidos
    let productos = {};
    ventasArr.forEach((v) => {
      if (v.items && Array.isArray(v.items)) {
        v.items.forEach((item) => {
          let nombre = item.titulo || item.producto || "Producto";
          productos[nombre] = (productos[nombre] || 0) + (item.cantidad || 1);
        });
      } else if (v.producto) {
        productos[v.producto] = (productos[v.producto] || 0) + 1;
      }
    });
    let top = Object.entries(productos)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    setTopProductos(top);
  }

  function getWeekNumber(d) {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    return weekNo;
  }

  async function handleDescargar() {
    if (ventas.length === 0) {
      alert("No hay ventas para exportar.");
      return;
    }
    // Aquí deberías implementar la exportación a Excel (puedes usar xlsx o SheetJS)
    alert("Funcionalidad de exportar a Excel pendiente de implementar.");
    // Reiniciar ingresos (borrar ventas)
    if (window.confirm("¿Deseas reiniciar los ingresos y borrar todas las ventas? Esta acción no se puede deshacer.")) {
      const q = query(collection(db, "ventas"));
      const snap = await getDocs(q);
      for (const d of snap.docs) {
        await deleteDoc(doc(db, "ventas", d.id));
      }
      setTimeout(() => cargarReportes(), 1000);
    }
  }

  return (
    <div className="reportes-panel">
      <button className="volver-admin-btn" onClick={() => navigate("/admin/dashboard")}>Volver al Panel Principal</button>
      <h2>Reportes Básicos</h2>
      <div className="reportes-filtros">
        <label htmlFor="filtro-periodo">Periodo:</label>
        <select id="filtro-periodo" value={periodo} onChange={e => setPeriodo(e.target.value)}>
          <option value="dia">Día</option>
          <option value="semana">Semana</option>
          <option value="mes">Mes</option>
        </select>
      </div>
      <div className="reportes-grafica">
        <canvas ref={chartRef} height="120"></canvas>
      </div>
      <div className="reportes-mas-vendidos">
        <h3>Productos más vendidos</h3>
        <ul id="lista-mas-vendidos">
          {topProductos.length === 0 ? (
            <li style={{ color: "#aaa" }}>Sin ventas</li>
          ) : (
            topProductos.map(([nombre, cantidad]) => (
              <li key={nombre}>
                <span>{nombre}</span>
                <span>x{cantidad}</span>
              </li>
            ))
          )}
        </ul>
      </div>
      <button className="btn-descargar-excel" onClick={handleDescargar} style={{ margin: "20px 0 0 0", background: "#900C3F", color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>
        Descargar ventas (Excel) y reiniciar ingresos
      </button>
    </div>
  );
}
