import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CanchaCard from '../components/CanchaCard'
import SkeletonCard from '../components/SkeletonCard'
import { obtenerCanchas } from '../services/canchas'
import { Helmet } from 'react-helmet-async'



const deportes = ['todos', 'futbol', 'basquet', 'tenis', 'padel']

function Home() {
  const [filtro, setFiltro] = useState('todos')
  const [cargando, setCargando] = useState(true)
  const [datos, setDatos] = useState([])
  const navigate = useNavigate()

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
      setCargando(false)
    } catch (error) {
      console.error('Error cargando canchas:', error)
      setCargando(false)
    }
  }

  cargar()
}, [])

  const canchasFiltradas = datos.filter(c =>
    filtro === 'todos' ? true : c.deporte === filtro
  )

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
          {cargando ? '...' : `${datos.filter(c => c.estado === 'libre').length} canchas disponibles ahora mismo`}
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
        {cargando
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