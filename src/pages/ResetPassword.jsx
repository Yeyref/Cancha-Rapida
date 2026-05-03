import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { Helmet } from 'react-helmet-async'

function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [listo, setListo] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase maneja el token automáticamente desde la URL
    const { data: listener } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // Ya está listo para cambiar contraseña
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setListo(true)
    setTimeout(() => navigate('/'), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-6">
      <Helmet><title>Nueva contraseña — Cancha Rápida</title></Helmet>

      <div className="w-full max-w-md">
        <div className="mb-8">
          <span className="text-green-400 text-3xl">⬡</span>
          <h1 className="text-3xl font-extrabold text-white mt-4 mb-1">Nueva contraseña</h1>
          <p className="text-gray-400 text-sm">Elige una contraseña segura para tu cuenta</p>
        </div>

        {listo ? (
          <div className="bg-green-400/10 border border-green-400/20 text-green-400 px-4 py-3 rounded-xl text-sm">
            Contraseña actualizada. Redirigiendo...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs text-gray-400 mb-1 block">Nueva contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-green-400 outline-none text-white text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-green-300 transition-all disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword