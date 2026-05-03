import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { useUser } from "../../hooks/useUser"

export default function Sedes() {
  const { perfil } = useUser()
  const [sedes, setSedes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (perfil?.organizacion_id || perfil?.rol === 'superadmin') {
      fetchSedes()
    }
  }, [perfil])

  async function fetchSedes() {
    setLoading(true)
    let query = supabase.from("sedes").select("*")

    // Si no es superadmin, solo traer sedes de su organización
    if (perfil?.rol !== 'superadmin') {
      query = query.eq("organizacion_id", perfil.organizacion_id)
    }

    const { data, error } = await query
    if (!error) setSedes(data)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mis Sedes</h1>
          <p className="text-gray-400 text-sm">Gestiona los puntos físicos donde están tus canchas</p>
        </div>
        <button className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg font-bold transition-colors">
          + Nueva Sede
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-white/5 animate-pulse rounded-xl"></div>
          <div className="h-24 bg-white/5 animate-pulse rounded-xl"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sedes.map((sede) => (
            <div key={sede.id} className="bg-gray-900 border border-white/10 p-5 rounded-xl">
              <h3 className="font-bold text-lg text-white">{sede.nombre}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {sede.direccion}
              </p>
            </div>
          ))}
        </div>
      )}

      {sedes.length === 0 && !loading && (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <p className="text-gray-500">No tienes sedes registradas. Crea una para empezar.</p>
        </div>
      )}
    </div>
  )
}