import { useState } from 'react'
import './App.css'
import DashboardAdmin from './pages/admin/DashboardAdmin.jsx'
import DashboardCliente from './pages/cliente/DashboardCliente.jsx'
import IniciarSesion from './auth/IniciarSesion.jsx'
import Registro from './auth/Registro.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
function App() {
  const [count, setCount] = useState(0)
  return(
    <BrowserRouter>
      <Routes>

        <Route path="/registro" element={<Registro />} />
        <Route path="/iniciar-sesion" element={<IniciarSesion />} />
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/cliente/dashboard" element={<DashboardCliente />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
