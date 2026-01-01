import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import IniciarSesion from './auth/IniciarSesion.jsx';
import Registro from './auth/Registro.jsx';

import DashboardAdmin from './pages/admin/DashboardAdmin.jsx';
import GestionProductos from './pages/admin/GestionProductos.jsx';
import GestionUsuarios from './pages/admin/GestionUsuarios.jsx';

import DashboardCliente from './pages/cliente/DashboardCliente.jsx';
import Checkout from './pages/cliente/Checkout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🏠 PÁGINA PRINCIPAL (PASTELERÍA) */}
        <Route path="/" element={<DashboardCliente />} />

        {/* 🔐 AUTH */}
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/registro" element={<Registro />} />

        {/* 👨‍💼 ADMIN */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/gestion-productos" element={<GestionProductos />} />
        <Route path="/admin/gestion-usuarios" element={<GestionUsuarios />} />

        {/* 👤 CLIENTE */}
        <Route path="/cliente/dashboard" element={<DashboardCliente />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* ❗ RUTA NO EXISTENTE */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
