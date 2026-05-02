import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Reservar from './pages/Reservar'
import MisReservas from './pages/MisReservas'
import NotFound from './pages/NotFound'
import DetalleCancha from './pages/DetalleCancha'

function Navbar() {
  const { pathname } = useLocation()

  const linkEstilo = (ruta) =>
    `text-sm font-medium transition-all px-3 py-1.5 rounded-full whitespace-nowrap ${
      pathname === ruta
        ? 'bg-green-400 text-gray-900 font-semibold'
        : 'text-gray-400 hover:text-white'
    }`

  return (
    <nav className="border-b border-white/10 px-4 sm:px-8 py-3 flex items-center justify-between backdrop-blur-sm bg-gray-950/80 sticky top-0 z-50">
      <Link to="/" className="font-extrabold text-white text-base sm:text-xl tracking-tight flex items-center gap-2 shrink-0">
        <span className="text-green-400">⬡</span>
        <span>CanchaRápida</span>
      </Link>
      <div className="flex gap-1 sm:gap-2 items-center">
        <Link to="/" className={linkEstilo('/')}>Canchas</Link>
        <Link to="/mis-reservas" className={linkEstilo('/mis-reservas')}>Mis reservas</Link>
      </div>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reservar" element={<Reservar />} />
          <Route path="/mis-reservas" element={<MisReservas />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/cancha/:id" element={<DetalleCancha />} />      
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App