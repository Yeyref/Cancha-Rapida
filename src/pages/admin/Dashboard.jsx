import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"
import { useUser } from "../../hooks/useUser"

export default function Dashboard() {
  const { user, perfil } = useUser()
  const [stats, setStats] = useState({ usuarios: 0, reservas: 0 })

  useEffect(() => {
    const load = async () => {
      const { count: usuarios } = await supabase
        .from("perfiles")
        .select("*", { count: "exact", head: true })

      const { count: reservas } = await supabase
        .from("reservas")
        .select("*", { count: "exact", head: true })

      setStats({ usuarios, reservas })
    }

    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-6">Panel de control de {perfil?.nombre || user?.email}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Usuarios Registrados" value={stats.usuarios} />
        <Card title="Reservas Realizadas" value={stats.reservas} />
      </div>
    </div>
  )
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-green-400 mt-1">{value ?? 0}</p>
    </div>
  )
}