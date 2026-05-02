import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Swal from 'sweetalert2'
import { Helmet } from 'react-helmet-async'


const estadoEstilo = {
  confirmada: 'bg-green-400/10 text-green-400 border border-green-400/20',
  cancelada:  'bg-red-400/10 text-red-400 border border-red-400/20',
}

function MisReservas() {
  const [reservas, setReservas] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem('reservas') || '[]')
    setReservas(guardadas)
  }, [])

  const cancelar = async (id) => {
    const reserva = reservas.find(r => r.id === id)

    const resultado = await Swal.fire({
      title: '¿Cancelar reserva?',
      text: `${reserva.cancha} — ${reserva.hora}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
      background: '#111827',
      color: '#ffffff',
      confirmButtonColor: '#f87171',
      cancelButtonColor: '#374151',
    })

    if (!resultado.isConfirmed) return

    const actualizadas = reservas.map(r =>
      r.id === id ? { ...r, estado: 'cancelada' } : r
    )
    setReservas(actualizadas)
    localStorage.setItem('reservas', JSON.stringify(actualizadas))

    Swal.fire({
      title: 'Reserva cancelada',
      icon: 'info',
      background: '#111827',
      color: '#ffffff',
      timer: 2000,
      showConfirmButton: false,
    })
  }

  return (
    <div className="px-8 py-10 max-w-2xl mx-auto">
        
    <Helmet>
    <title>Mis reservas — Cancha Rápida</title>
    </Helmet>
      <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Tu historial</p>
      <h1 className="text-3xl font-extrabold text-white mb-8">Mis reservas</h1>

      {reservas.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
          <p className="text-gray-500 mb-6">No tienes reservas aún</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold hover:bg-green-300 transition-all"
          >
            Ver canchas disponibles
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {reservas.map(r => (
            <div key={r.id} className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between gap-3 mb-2">
                <p className="font-bold text-white">{r.cancha}</p>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${estadoEstilo[r.estado]}`}>
                    {r.estado}
                </span>
                </div>
                <p className="text-sm text-gray-500 capitalize">
                {r.fecha ? format(new Date(r.fecha), "d 'de' MMMM", { locale: es }) : ''}
                {r.fecha ? ' · ' : ''}{r.hora} · ${r.precio.toLocaleString('es-CL')}
                </p>
                <p className="text-xs text-gray-600 mt-1 capitalize">{r.deporte}</p>
                {r.estado === 'confirmada' && (
                <button
                    onClick={() => cancelar(r.id)}
                    className="mt-3 text-xs text-gray-500 hover:text-red-400 transition-all border border-white/10 hover:border-red-400/30 px-3 py-1.5 rounded-full"
                >
                    Cancelar reserva
                </button>
                )}
            </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default MisReservas