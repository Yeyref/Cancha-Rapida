import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const estadoEstilo = {
  confirmada: 'bg-green-400/10 text-green-400 border border-green-400/20',
  cancelada: 'bg-red-400/10 text-red-400 border border-red-400/20',
}

export default function Reservas() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("reservas")
        .select("*, canchas(nombre, deporte), perfiles(nombre, email)")
        .order("fecha", { ascending: false })

      if (error) console.error(error)
      setReservas(data || [])
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Reservas</h1>
        <p className="text-gray-400 text-sm">{reservas.length} reservas en total</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Usuario</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Cancha</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Fecha</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Hora</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Precio</th>
              <th className="text-left px-5 py-3 text-gray-400 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No hay reservas registradas
                </td>
              </tr>
            ) : (
              reservas.map(r => (
                <tr key={r.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                  <td className="px-5 py-4">
                    <p className="text-white font-medium">{r.perfiles?.nombre ?? 'Sin nombre'}</p>
                    <p className="text-gray-500 text-xs">{r.perfiles?.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white">{r.canchas?.nombre}</p>
                    <p className="text-gray-500 text-xs capitalize">{r.canchas?.deporte}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-300 capitalize">
                    {r.fecha ? format(new Date(r.fecha + 'T12:00:00'), "d 'de' MMMM yyyy", { locale: es }) : '—'}
                  </td>
                  <td className="px-5 py-4 text-gray-300">{r.hora}</td>
                  <td className="px-5 py-4 text-gray-300">
                    ${r.precio?.toLocaleString('es-CL')}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${estadoEstilo[r.estado] ?? ''}`}>
                      {r.estado}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}