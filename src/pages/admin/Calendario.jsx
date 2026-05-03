import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import { supabase } from '../../services/supabase'
import { useUser } from '../../hooks/useUser'

export default function Calendario() {
  const { perfil } = useUser()
  const [canchas, setCanchas] = useState([])
  const [canchaSeleccionada, setCanchaSeleccionada] = useState('all')
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (perfil) cargarCanchas()
  }, [perfil])

  useEffect(() => {
    cargarReservas()
  }, [canchas, canchaSeleccionada])

  async function cargarCanchas() {
    let query = supabase.from('canchas').select('id, nombre')

    // Si tiene organizacion_id (admin normal), filtra por sus sedes
    if (perfil?.organizacion_id) {
      const { data: sedes } = await supabase
        .from('sedes')
        .select('id')
        .eq('organizacion_id', perfil.organizacion_id)

      const sedeIds = sedes?.map(s => s.id) || []
      if (sedeIds.length > 0) {
        query = query.in('sede_id', sedeIds)
      }
    }
    // superadmin no filtra — ve todas

    const { data } = await query
    if (data) setCanchas(data)
  }

  async function cargarReservas() {
    setLoading(true)

    let query = supabase
      .from('reservas')
      .select('id, fecha, hora, estado, cancha_id, perfiles(nombre), canchas(nombre, id)')
      .is('eliminado_en', null)

    if (canchaSeleccionada !== 'all') {
      query = query.eq('cancha_id', canchaSeleccionada)
    } else if (canchas.length > 0) {
      const canchaIds = canchas.map(c => c.id)
      query = query.in('cancha_id', canchaIds)
    }

    const { data, error } = await query
    if (error) { console.error(error); setLoading(false); return }

    const formattedEvents = (data || []).map(res => {
      const start = `${res.fecha}T${res.hora}:00`
      const [h, m] = res.hora.split(':')
      const endHour = String(parseInt(h) + 1).padStart(2, '0')
      const end = `${res.fecha}T${endHour}:${m}:00`

      return {
        id: res.id,
        title: `${res.canchas?.nombre} — ${res.perfiles?.nombre || 'Usuario'}`,
        start,
        end,
        backgroundColor: res.estado === 'confirmada' ? '#22c55e' : '#eab308',
        borderColor: 'transparent',
        textColor: '#000',
      }
    })

    setEventos(formattedEvents)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Calendario</h1>
          <p className="text-gray-400 text-sm">Reservas por cancha y fecha</p>
        </div>

        <select
          className="bg-white/5 border border-white/10 text-white rounded-xl p-2 outline-none focus:border-green-400 transition-all"
          value={canchaSeleccionada}
          onChange={(e) => setCanchaSeleccionada(e.target.value)}
        >
          <option value="all">Todas las canchas</option>
          {canchas.map(c => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-900 border border-white/10 p-4 rounded-2xl shadow-xl">
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={eventos}
          locale={esLocale}
          slotMinTime="08:00:00"
          slotMaxTime="23:00:00"
          allDaySlot={false}
          height="auto"
          nowIndicator={true}
          eventClick={(info) => alert(`${info.event.title}\n${info.event.startStr}`)}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: false
          }}
        />
      </div>

      <style>{`
        .fc { --fc-border-color: rgba(255,255,255,0.05); --fc-page-bg-color: transparent; }
        .fc-theme-standard td, .fc-theme-standard th { border: 1px solid rgba(255,255,255,0.05); }
        .fc-col-header-cell { padding: 10px 0; background: rgba(255,255,255,0.02); }
        .fc-timegrid-slot { height: 4rem !important; }
        .fc-timegrid-event { border-radius: 8px; padding: 2px; font-size: 0.85rem; }
        .fc-toolbar-title { font-weight: 800; text-transform: capitalize; color: white; }
        .fc-button-primary { background: #22c55e !important; border: none !important; color: #000 !important; font-weight: 700 !important; border-radius: 10px !important; }
        .fc-button-primary:disabled { background: #166534 !important; }
        .fc-v-event { border: none; }
        .fc-timegrid-now-indicator-line { border-color: #ef4444; }
        .fc-daygrid-event { border-radius: 6px; font-size: 0.8rem; }
        .fc-day-today { background: rgba(34,197,94,0.05) !important; }
      `}</style>
    </div>
  )
}