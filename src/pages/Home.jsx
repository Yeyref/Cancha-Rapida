import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CanchaCard from '../components/CanchaCard'
import SkeletonCard from '../components/SkeletonCard'
import { obtenerCanchas } from '../services/canchas'
import { Helmet } from 'react-helmet-async'
import { useUser } from '../hooks/useUser' // Importamos el hook de usuario

const deportes = ['todos', 'futbol', 'basquet', 'tenis', 'padel']

function Home() {
  const { perfil, loading: cargandoPerfil } = useUser() // Obtenemos el perfil y su estado de carga
  const [filtro, setFiltro] = useState('todos')
  const [cargandoCanchas, setCargandoCanchas] = useState(true)
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

  // EFECTO 1: Redirección por Rol
  useEffect(() => {
    if (!cargandoPerfil && perfil) {
      if (perfil.rol === 'admin' || perfil.rol === 'superadmin') {
        navigate('/admin')
      }
    }
  }, [perfil, cargandoPerfil, navigate])

  // EFECTO 2: Carga de datos de canchas
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerCanchas()

        // parche temporal (porque no tengo estado en DB)
        const conEstado = data.map(c => ({
          ...c,
          estado: 'libre'
        }))

        setDatos(conEstado)
        setCargandoCanchas(false)
      } catch (error) {
        console.error('Error cargando canchas:', error)
        setCargandoCanchas(false)
      }
    }

    cargar()
  }, [])

  const canchasFiltradas = datos.filter(c =>
    filtro === 'todos' ? true : c.deporte === filtro
  )

  // Si está cargando el perfil o si es un admin (mientras se ejecuta el navigate), no mostramos nada
  if (cargandoPerfil || (perfil && (perfil.rol === 'admin' || perfil.rol === 'superadmin'))) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-400"></div>
      </div>
    )
  }

  return (
    <div className="px-8 py-10 max-w-6xl mx-auto">
      <Helmet>
        <title>Canchas disponibles — Cancha Rápida</title>
      </Helmet>
      
      <div className="mb-10">
        <p className="text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">Santiago, Chile</p>
        <h1 className="text-4xl font-extrabold text-white leading-tight mb-2">
          Encuentra tu cancha,<br />
          <span className="text-green-400">reserva en segundos.</span>
        </h1>
        <p className="text-gray-400 text-base mt-3">
          {cargandoCanchas ? '...' : `${datos.filter(c => c.estado === 'libre').length} canchas disponibles ahora mismo`}
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {deportes.map(deporte => (
          <button
            key={deporte}
            onClick={() => setFiltro(deporte)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border ${
              filtro === deporte
                ? 'bg-green-400 text-gray-900 border-green-400 font-semibold'
                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-white/5'
            }`}
          >
            {deporte}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cargandoCanchas
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : canchasFiltradas.map(cancha => (
              <CanchaCard
                key={cancha.id}
                cancha={cancha}
                onSelect={(c) => navigate('/cancha/' + c.id, { state: { cancha: c } })}
                seleccionada={false}
              />
            ))
        }
      </div>
    </div>
  )
}

export default Home