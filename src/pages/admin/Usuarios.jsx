import { useEffect, useState } from "react"
import { supabase } from "../../services/supabase"

export default function Usuarios() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("perfiles")
        .select("*")

      setUsers(data)
    }

    load()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-gray-400">
            <th>Email</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-t border-white/10">
              <td>{u.email}</td>
              <td>{u.nombre ?? "—"}</td>
              <td>{u.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}