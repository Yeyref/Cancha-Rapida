function CanchaCard({ cancha, onSelect }) {
  const badges = {
    libre:   { texto: 'Disponible',     clase: 'bg-green-400/10 text-green-400 border border-green-400/20' },
    parcial: { texto: 'Pocos horarios', clase: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' },
    ocupada: { texto: 'Sin horarios',   clase: 'bg-red-400/10 text-red-400 border border-red-400/20' },
  }

  const badge = badges[cancha.estado]
  const deshabilitada = cancha.estado === 'ocupada'

  return (
    <div
      onClick={() => !deshabilitada && onSelect(cancha)}
      className={`
        group relative bg-white/5 border border-white/10 rounded-2xl p-5 transition-all duration-200
        ${deshabilitada
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer hover:bg-white/10 hover:border-green-400/40 hover:scale-[1.02]'
        }
      `}
    >
      {/* Sport tag */}
      <span className="text-xs font-bold uppercase tracking-widest text-green-400 mb-4 block">
        {cancha.deporte}
      </span>

      <h3 className="text-lg font-bold text-white mb-1">{cancha.nombre}</h3>
      <p className="text-sm text-gray-500 mb-5 flex items-center gap-1">
        <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
        </span> {cancha.ubicacion}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div>
          <span className="text-xl font-bold text-white">${cancha.precio.toLocaleString('es-CL')}</span>
          <span className="text-xs text-gray-500 ml-1">/ hora</span>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badge.clase}`}>
          {badge.texto}
        </span>
      </div>
      {!deshabilitada && (
        <p className="text-xs text-green-400/60 mt-3 text-right">Ver detalle →</p>
        )}
    </div>
  )
}

export default CanchaCard