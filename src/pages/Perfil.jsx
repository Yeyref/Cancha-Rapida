import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useUser } from '../hooks/useUser'
import { supabase } from '../services/supabase'
import Swal from 'sweetalert2'

function Perfil() {
  const { user, perfil } = useUser()
  const [nombre, setNombre] = useState(perfil?.nombre ?? '')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const guardar = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
        .from('perfiles')
        .upsert({ 
        id: user.id,
        nombre: nombre,
        email: user.email
        })

    setLoading(false)

    if (error) {
        Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el perfil.',
        icon: 'error',
        background: '#111827',
        color: '#ffffff',
        confirmButtonColor: '#4ade80',
        })
        return
    }

    Swal.fire({
        title: 'Perfil actualizado',
        icon: 'success',
        background: '#111827',
        color: '#ffffff',
        confirmButtonColor: '#4ade80',
        timer: 2000,
        showConfirmButton: false,
    })
    }

  const iniciales = perfil?.nombre
    ? perfil.nombre.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?'

  return (
    <div className="px-4 sm:px-8 py-10 max-w-lg mx-auto">
      <Helmet><title>Mi perfil — Cancha Rápida</title></Helmet>

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-green-400 mb-8 flex items-center gap-2 transition-all"
      >
        ← Volver
      </button>

      <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-2">Cuenta</p>
      <h1 className="text-3xl font-extrabold text-white mb-8">Mi perfil</h1>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-green-400 flex items-center justify-center text-gray-900 font-bold text-xl">
          {iniciales}
        </div>
        <div>
          <p className="text-white font-semibold">{perfil?.nombre ?? 'Sin nombre'}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={guardar} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-1 block">Nombre completo</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-green-400 outline-none text-white text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Correo</label>
          <input
            type="email"
            value={user?.email ?? ''}
            disabled
            className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none text-gray-500 text-sm cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-400 text-gray-900 py-3 rounded-xl font-bold hover:bg-green-300 transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}

export default Perfil