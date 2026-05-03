import { useState, useEffect } from "react"
import { supabase } from "../services/supabase"

export default function ModalReservaManual({ isOpen, onClose, onSave, canchas, fechaSeleccionada, horaSeleccionada }) {
  const [canchaId, setCanchaId] = useState("")
  const [nombreCliente, setNombreCliente] = useState("")
  const [precio, setPrecio] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (canchas.length > 0) setCanchaId(canchas[0].id)
  }, [canchas])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from("reservas")
      .insert([{
        fecha: fechaSeleccionada,
        hora: horaSeleccionada,
        cancha_id: canchaId,
        precio: parseInt(precio) || 0,
        estado: 'confirmada',
        // Para reservas manuales, podemos guardar el nombre en una columna extra o nota
        // Por ahora, lo manejaremos simple.
      }])
      .select()

    if (!error) {
      onSave()
      setNombreCliente("")
      setPrecio("")
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-green-400">●</span> Nueva Reserva
          </h2>
          
          <div className="bg-white/5 p-3 rounded-xl border border-white/5 mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider">Horario seleccionado</p>
            <p className="text-white font-semibold">{fechaSeleccionada} a las {horaSeleccionada} hrs</p>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Nombre del Cliente / Referencia</label>
            <input 
              required 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-400"
              placeholder="Ej: Juan Pérez o 'Partido del Jefe'" 
              value={nombreCliente} 
              onChange={(e) => setNombreCliente(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Cancha</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                value={canchaId} 
                onChange={(e) => setCanchaId(e.target.value)}
              >
                {canchas.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Precio acordado</label>
              <input 
                type="number" 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-400"
                placeholder="$" 
                value={precio} 
                onChange={(e) => setPrecio(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl hover:bg-white/10 transition-all">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 bg-green-400 text-black font-bold py-3 rounded-xl hover:bg-green-500 transition-all disabled:opacity-50">
              {loading ? "Reservando..." : "Confirmar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}