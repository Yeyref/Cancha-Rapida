import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import MapaCancha from '../components/MapaCancha'

const deporteInfo = {
  futbol:  { jugadores: '10 vs 10', superficie: 'Pasto sintético', duracion: '60 min' },
  basquet: { jugadores: '5 vs 5',   superficie: 'Madera',          duracion: '60 min' },
  tenis:   { jugadores: '1 vs 1',   superficie: 'Polvo de ladrillo', duracion: '60 min' },
  padel:   { jugadores: '2 vs 2',   superficie: 'Cristal y cemento', duracion: '60 min' },
}

const estadoBadge = {
  libre:   { texto: 'Disponible',     clase: 'bg-green-400/10 text-green-400 border border-green-400/20' },
  parcial: { texto: 'Pocos horarios', clase: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' },
  ocupada: { texto: 'Sin horarios',   clase: 'bg-red-400/10 text-red-400 border border-red-400/20' },
}

function DetalleCancha() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.cancha) { navigate('/'); return null }
  const { cancha } = state
  const info = deporteInfo[cancha.deporte] || {}
  const badge = estadoBadge[cancha.estado]

  return (
    <div className="px-4 sm:px-8 py-10 max-w-2xl mx-auto">
      <Helmet>
        <title>Detalle — Cancha Rápida</title>
      </Helmet>

      <button
        onClick={() => navigate('/')}
        className="text-sm text-gray-500 hover:text-green-400 mb-8 flex items-center gap-2 transition-all"
      >
        ← Volver a canchas
      </button>

      {/* Header */}
      <div className="mb-8">
        <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">{cancha.deporte}</p>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-3xl font-extrabold text-white">{cancha.nombre}</h1>
          <span className={`text-xs font-semibold px-3 py-1.5 rounded-full shrink-0 mt-1 ${badge.clase}`}>
            {badge.texto}
          </span>
        </div>
        <p className="text-gray-500 flex items-center gap-2 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
          {cancha.direccion}
        </p>
      </div>

      {/* Precio destacado */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Precio por hora</p>
          <p className="text-3xl font-extrabold text-white">${cancha.precio.toLocaleString('es-CL')}</p>
        </div>
        {cancha.estado !== 'ocupada' && (
          <button
            onClick={() => navigate('/reservar', { state: { cancha } })}
            className="bg-green-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-green-300 transition-all text-sm"
          >
            Reservar ahora
          </button>
        )}
      </div>

      {/* Info del deporte */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Información</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Jugadores', info.jugadores],
            ['Superficie', info.superficie],
            ['Duración', info.duracion],
          ].map(([label, val]) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className="text-sm font-semibold text-white">{val}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Ubicación</h2>
        <MapaCancha cancha={cancha} />
      </div>

      {/* CTA final */}
      {cancha.estado !== 'ocupada' && (
        <button
          onClick={() => navigate('/reservar', { state: { cancha } })}
          className="w-full bg-green-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-green-300 transition-all text-base"
        >
          Reservar esta cancha
        </button>
      )}

      {cancha.estado === 'ocupada' && (
        <div className="w-full bg-white/5 border border-white/10 py-4 rounded-xl text-center text-gray-500 text-sm">
          No hay horarios disponibles para esta cancha
        </div>
      )}
    </div>
  )
}

export default DetalleCancha