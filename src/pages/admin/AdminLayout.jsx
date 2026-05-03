import { Link, Outlet } from "react-router-dom"

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-950 text-white">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 p-4 space-y-4">
        <h1 className="text-green-400 font-bold text-xl">Admin</h1>

        <nav className="flex flex-col gap-2 text-sm">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/usuarios">Usuarios</Link>
          <Link to="/admin/reservas">Reservas</Link>
          <Link to="/admin/canchas">Canchas</Link>
          <Link to="/admin/sedes">Sedes</Link>
          <Link to="/admin/calendario">Calendario</Link>
        </nav>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>

    </div>
  )
}