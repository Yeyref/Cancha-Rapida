import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Reservar from './pages/Reservar'
import MisReservas from './pages/MisReservas'
import NotFound from './pages/NotFound'
import DetalleCancha from './pages/DetalleCancha'
import Perfil from './pages/Perfil'
import RutaPrivada from './components/RutaPrivada'
import RutaPublica from './components/RutaPublica'
import { useUser } from './hooks/useUser'
import { useRef, useState, useEffect } from 'react'
import { supabase } from './services/supabase'

import RutaAdmin from "./components/RutaAdmin"
import AdminLayout from "./pages/admin/AdminLayout"
import Dashboard from "./pages/admin/Dashboard"
import Usuarios from "./pages/admin/Usuarios"
import Reservas from "./pages/admin/Reservas"
import Sedes from "./pages/admin/Sedes"    
import Canchas from "./pages/admin/Canchas"  
import Calendario from "./pages/admin/Calendario"
function Navbar() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, perfil, signOut } = useUser()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAbierto(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const iniciales = perfil?.nombre
    ? perfil.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?'

  return (
    <nav className="border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-sm bg-gray-950/80 sticky top-0 z-50">
      <Link to="/" className="font-extrabold text-white text-base sm:text-xl tracking-tight flex items-center gap-2 shrink-0">
        <span className="text-green-400">⬡</span>
        <span>CanchaRápida</span>
      </Link>

      {user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex items-center gap-2 hover:opacity-80 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-gray-900 font-bold text-sm">
              {iniciales}
            </div>
            <span className="text-white text-sm font-medium hidden sm:block">
              {perfil?.nombre?.split(' ')[0] ?? user.email}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl overflow-hidden shadow-xl z-50">
              <div className="px-4 py-3 border-b border-white/10">
                <p className="text-white text-sm font-semibold truncate">{perfil?.nombre ?? 'Usuario'}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </div>
              <button
                onClick={() => { navigate('/mis-reservas'); setMenuAbierto(false) }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-all"
              >
                Mis reservas
              </button>
              <button
                onClick={() => { navigate('/perfil'); setMenuAbierto(false) }}
                className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-all"
              >
                Mi perfil
              </button>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all border-t border-white/10"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogin = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("rol")
          .eq("id", session.user.id)
          .single()

        if (perfil?.rol === 'admin' || perfil.rol === 'superadmin') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        navigate('/login')
      }
    }

    handleLogin()
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-400 animate-pulse text-sm">Verificando acceso...</p>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<RutaPublica><Login /></RutaPublica>} />
          <Route path="/" element={<RutaPrivada><Home /></RutaPrivada>} />
          <Route path="/cancha/:id" element={<RutaPrivada><DetalleCancha /></RutaPrivada>} />
          <Route path="/reservar" element={<RutaPrivada><Reservar /></RutaPrivada>} />
          <Route path="/mis-reservas" element={<RutaPrivada><MisReservas /></RutaPrivada>} />
          <Route path="/perfil" element={<RutaPrivada><Perfil /></RutaPrivada>} />
          
          <Route
            path="/admin"
            element={
              <RutaAdmin>
                <AdminLayout />
              </RutaAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="sedes" element={<Sedes />} />      
            <Route path="canchas" element={<Canchas />} />    
            <Route path="calendario" element={<Calendario />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App