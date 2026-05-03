import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/usuarios', label: 'Usuarios' },
  { to: '/admin/reservas', label: 'Reservas' },
  { to: '/admin/canchas', label: 'Canchas' },
  { to: '/admin/sedes', label: 'Sedes' },
  { to: '/admin/calendario', label: 'Calendario' },
]

export default function AdminLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { pathname } = useLocation()

  const linkEstilo = (to) =>
    `block px-3 py-2 rounded-lg text-sm transition-all ${
      pathname === to
        ? 'bg-green-400/10 text-green-400 font-semibold'
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`

  return (
    <div className="min-h-screen flex bg-gray-950 text-white">

      {/* Sidebar desktop */}
      <aside className="hidden md:flex w-48 bg-gray-900 border-r border-white/10 p-4 flex-col gap-4 shrink-0">
        <h1 className="text-green-400 font-bold text-lg px-3">Admin</h1>
        <nav className="flex flex-col gap-1">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={linkEstilo(l.to)}>
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900 border-t border-white/10 flex items-center justify-around px-2 py-2">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all ${
              pathname === l.to
                ? 'text-green-400 font-semibold'
                : 'text-gray-500'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}