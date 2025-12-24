import { useState } from 'react';
import './App.css';
import DashboardAdmin from './pages/admin/DashboardAdmin.jsx';
import DashboardCliente from './pages/cliente/DashboardCliente.jsx';
import IniciarSesion from './auth/IniciarSesion.jsx';
import Registro from './auth/Registro.jsx';
import GestionProductos from './pages/admin/GestionProductos.jsx';
import GestionUsuarios from './pages/admin/GestionUsuarios.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Checkout from './pages/cliente/Checkout.jsx';
function App() {
  const [count, setCount] = useState(0)
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Registro />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/cliente/dashboard" element={<DashboardCliente />} />
        <Route path="/admin/gestion-productos" element={<GestionProductos />} />
        <Route path="/admin/gestion-usuarios" element={<GestionUsuarios />} />
        <Route path="/checkout" element={<Checkout />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
