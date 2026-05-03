import { useState, useEffect } from "react"
import { supabase } from "../services/supabase"

export default function ModalCancha({ isOpen, onClose, onSave, sedes }) {
  const [nombre, setNombre] = useState("")
  const [deporte, setDeporte] = useState("Fútbol 5")
  const [precio, setPrecio] = useState("")
  const [sedeId, setSedeId] = useState("")
  const [loading, setLoading] = useState(false)

  // Seleccionar la primera sede por defecto si existen
  useEffect(() => {
    if (sedes.length > 0) setSedeId(sedes[0].id)
  }, [sedes])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase
      .from("canchas")
      .insert([{ 
        nombre, 
        deporte, 
        precio: parseInt(precio), 
        sede_id: sedeId 
      }])
      .select()

    if (!error) {
      onSave(data[0])
      setNombre("")
      setPrecio("")
      onClose()
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-gray-900 border border-white/10 w-full max-w-md rounded-2xl shadow-2xl">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Nueva Cancha</h2>
          
          <div>
            <label className="text-xs text-gray-400 block mb-1">Nombre / Número</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-400"
              placeholder="Ej: Cancha 1 (Sintética)" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Deporte</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
                value={deporte} onChange={(e) => setDeporte(e.target.value)}>
                <option value="Fútbol 5">Fútbol 5</option>
                <option value="Fútbol 7">Fútbol 7</option>
                <option value="Pádel">Pádel</option>
                <option value="Tenis">Tenis</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Precio x Hora</label>
              <input required type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-green-400"
                placeholder="25000" value={precio} onChange={(e) => setPrecio(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Ubicación (Sede)</label>
            <select required className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none"
              value={sedeId} onChange={(e) => setSedeId(e.target.value)}>
              {sedes.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 bg-white/5 text-white font-bold py-3 rounded-xl">Cancelar</button>
            <button type="submit" disabled={loading} className="flex-1 bg-green-400 text-black font-bold py-3 rounded-xl disabled:opacity-50">
              {loading ? "Guardando..." : "Crear Cancha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}