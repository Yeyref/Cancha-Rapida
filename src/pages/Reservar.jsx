import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Swal from 'sweetalert2'
import { obtenerReservasPorCanchaYFecha } from '../services/reservas'
import MapaCancha from '../components/MapaCancha'
import SelectorFecha from '../components/SelectorFecha'
import { Helmet } from 'react-helmet-async'
import { crearReserva } from '../services/reservas'

const horariosBase = [
  '08:00','09:00','10:00','11:00','12:00',
  '13:00','14:00','15:00','16:00','17:00',
  '18:00','19:00'
]


function Reservar() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const [horaSeleccionada, setHoraSeleccionada] = useState(null)
  const [fecha, setFecha] = useState(null)
  const [horarios, setHorarios] = useState([])

  // Referencias para hacer scroll automático
  const refHorarios = useRef(null)
  const refResumen = useRef(null)

  if (!state?.cancha) { navigate('/'); return null }
  const { cancha } = state

   useEffect(() => {
  if (!fecha) return

  const cargar = async () => {
    const fechaFormateada = fecha.toISOString().split('T')[0]

    const data = await obtenerReservasPorCanchaYFecha(
      cancha.id,
      fechaFormateada
    )

    const horasOcupadas = data.map(r => r.hora)

    const resultado = horariosBase.map(h => ({
      hora: h,
      estado: horasOcupadas.includes(h) ? 'ocupado' : 'libre'
    }))

    setHorarios(resultado)
  }

  cargar()
}, [fecha, cancha.id])

  const estiloSlot = (estado, hora) => {
    if (estado === 'ocupado') return 'bg-white/5 text-gray-600 cursor-not-allowed line-through border-white/5'
    if (estado === 'parcial') return 'bg-yellow-400/5 text-yellow-600 border-yellow-400/10 cursor-not-allowed'
    if (horaSeleccionada === hora) return 'bg-green-400 text-gray-900 border-green-400 font-bold'
    return 'bg-white/5 text-gray-300 border-white/10 hover:border-green-400/50 hover:bg-green-400/10 hover:text-green-400 cursor-pointer'
  }

  const handleFecha = (nuevaFecha) => {
    setFecha(nuevaFecha)
    setHoraSeleccionada(null)
    // Scroll automático a horarios cuando seleccionas fecha
    setTimeout(() => {
      refHorarios.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const handleHora = (hora) => {
    setHoraSeleccionada(hora)
    // Scroll automático al resumen cuando seleccionas hora
    setTimeout(() => {
      refResumen.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

const confirmar = async () => {
  const resultado = await Swal.fire({
    title: '¿Confirmar reserva?',
    html: `
      <div style="text-align:left; font-size:14px; color:#9ca3af;">
        <p style="margin-bottom:8px;"><strong style="color:white;">${cancha.nombre}</strong></p>
        <p style="margin-bottom:4px;">Fecha: <strong style="color:white;">${format(fecha, "EEEE d 'de' MMMM", { locale: es })}</strong></p>
        <p style="margin-bottom:4px;">Horario: <strong style="color:white;">${horaSeleccionada}</strong></p>
        <p>Precio: <strong style="color:white;">$${cancha.precio.toLocaleString('es-CL')}</strong></p>
      </div>
    `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, reservar',
    cancelButtonText: 'Cancelar',
    background: '#111827',
    color: '#ffffff',
    confirmButtonColor: '#4ade80',
    cancelButtonColor: '#374151',
  })

  if (!resultado.isConfirmed) return

  try {

    await crearReserva({
      cancha_id: cancha.id,
      fecha: fecha.toISOString().split('T')[0], 
      hora: horaSeleccionada,
      precio: cancha.precio,
      estado: 'confirmada'
    })

    await Swal.fire({
      title: '¡Reserva confirmada!',
      text: `Te esperamos el ${format(fecha, "d 'de' MMMM", { locale: es })} a las ${horaSeleccionada}`,
      icon: 'success',
      background: '#111827',
      color: '#ffffff',
      confirmButtonColor: '#4ade80',
      confirmButtonText: 'Ver mis reservas',
    })

    const data = await obtenerReservasPorCanchaYFecha(
      cancha.id,
      fecha.toISOString().split('T')[0]
    )

    const horasOcupadas = data.map(r => r.hora)

    setHorarios(
      horariosBase.map(h => ({
        hora: h,
        estado: horasOcupadas.includes(h) ? 'ocupado' : 'libre'
      }))
    )

    setHoraSeleccionada(null)

    navigate('/mis-reservas')


  } catch (error) {
  console.log('Error completo:', error)
  console.log('Mensaje:', error.message)
  console.log('Detalles:', error.details)
  console.log('Hint:', error.hint)
  console.log('Code:', error.code)
  Swal.fire({
    title: 'Error al reservar',
    text: error.message || 'Hubo un problema al guardar tu reserva.',
    icon: 'error',
    background: '#111827',
    color: '#ffffff',
    confirmButtonColor: '#4ade80',
  })
}
}
  return (
    
    <div className="px-8 py-10 max-w-2xl mx-auto">
      <Helmet>
        <title>Reservar — Cancha Rápida</title>
      </Helmet>
      <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-green-400 mb-8 flex items-center gap-2 transition-all">
        ← Volver a canchas
      </button>

      <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">{cancha.deporte}</p>
      <h1 className="text-3xl font-extrabold text-white mb-1">{cancha.nombre}</h1>
      <p className="text-gray-500 mb-8 flex items-center gap-2 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
        {cancha.direccion}
      </p>

      {/* Mapa */}
      <div className="mb-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Ubicación</h2>
        <MapaCancha cancha={cancha} />
      </div>

      {/* Fecha */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Selecciona una fecha</h2>
        <SelectorFecha fecha={fecha} onChange={handleFecha} />
      </div>

      {/* Horarios — scroll automático aquí */}
      {fecha && (
        <div className="mb-10" ref={refHorarios}>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Selecciona un horario</h2>
          <p className="text-green-400 text-xs mb-4 capitalize">
            {format(fecha, "EEEE d 'de' MMMM yyyy", { locale: es })}
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {horarios.map(h => (
              <button
                key={h.hora}
                disabled={h.estado !== 'libre'}
                onClick={() => handleHora(h.hora)}
                className={`border rounded-xl py-3 text-sm transition-all ${estiloSlot(h.estado, h.hora)}`}
              >
                {h.hora}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resumen — scroll automático aquí */}
      {fecha && horaSeleccionada && (
        <div ref={refResumen} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold text-white mb-5">Resumen de reserva</h3>
          <div className="space-y-3 text-sm mb-6">
            {[
              ['Cancha', cancha.nombre],
              ['Fecha', format(fecha, "EEEE d 'de' MMMM", { locale: es })],
              ['Horario', `${horaSeleccionada} — ${String(parseInt(horaSeleccionada) + 1).padStart(2, '0')}:00`],
              ['Precio', `$${cancha.precio.toLocaleString('es-CL')}`],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="text-white font-medium capitalize">{val}</span>
              </div>
            ))}
          </div>
          <button
            onClick={confirmar}
            className="w-full bg-green-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-green-300 transition-all"
          >
            Confirmar reserva
          </button>
        </div>
      )}
    </div>
  )
}

export default Reservar