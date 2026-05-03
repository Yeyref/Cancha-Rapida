import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp, signInWithGoogle } from '../services/auth'
import { Helmet } from 'react-helmet-async'
import { useUser } from '../hooks/useUser'
import { supabase } from '../services/supabase'

const slides = [
  {
    titulo: 'Encuentra tu cancha',
    descripcion: 'Fútbol, básquet, tenis y más. Todo en un solo lugar.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253" />
      </svg>
    ),
  },
  {
    titulo: 'Reserva en segundos',
    descripcion: 'Elige fecha, horario y confirma. Sin llamadas, sin esperas.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
  },
  {
    titulo: 'Gestiona tus reservas',
    descripcion: 'Ve tu historial, cancela cuando necesites y reserva de nuevo.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
      </svg>
    ),
  },
]

function Login() {
  const [fase, setFase] = useState('splash')
  const [slideActual, setSlideActual] = useState(0)
  const [modoForm, setModoForm] = useState(null)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user, perfil, loading: userLoading } = useUser()

  /// 1. Efecto para redireccionar si ya hay sesión activa
  useEffect(() => {
    if (!userLoading && user) {
      if (perfil?.rol === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }
  }, [user, perfil, userLoading, navigate])

  // 2. Splash screen de 2 segundos
  useEffect(() => {
    const timer = setTimeout(() => setFase('onboarding'), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    let authUser

    if (modoForm === 'login') {
      const data = await signIn(email, password)
      authUser = data?.user
    } else {
      const data = await signUp(email, password, nombre)
      authUser = data?.user
    }

    if (!authUser) throw new Error('No se pudo obtener el usuario')

    const { data: p } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', authUser.id)
      .single()

    if (p?.rol === 'admin' || p?.rol === 'superadmin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  } catch (err) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}

  // SPLASH
  if (fase === 'splash') {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
        <Helmet><title>Cancha Rápida</title></Helmet>
        <div className="flex items-center gap-3 animate-pulse">
          <span className="text-green-400 text-4xl">⬡</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Cancha<span className="text-green-400">Rápida</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm mt-4">Santiago, Chile</p>
      </div>
    )
  }

  // ONBOARDING
  if (fase === 'onboarding' && !modoForm) {
    const slide = slides[slideActual]
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col">
        <Helmet><title>Cancha Rápida</title></Helmet>

        {/* Slide content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="text-green-400 mb-8">
            {slide.icono}
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            {slide.titulo}
          </h2>
          <p className="text-gray-400 text-base max-w-xs">
            {slide.descripcion}
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideActual(i)}
              className={`rounded-full transition-all ${
                i === slideActual
                  ? 'w-6 h-2 bg-green-400'
                  : 'w-2 h-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Botones */}
        <div className="px-8 pb-12 flex flex-col gap-3">
          <button
            onClick={() => setModoForm('registro')}
            className="w-full bg-green-400 text-gray-900 py-4 rounded-2xl font-bold text-base hover:bg-green-300 transition-all"
          >
            Crear cuenta
          </button>
          <button
            onClick={() => setModoForm('login')}
            className="w-full text-gray-400 py-3 text-sm hover:text-white transition-all"
          >
            ¿Ya tienes cuenta? <span className="text-green-400 font-semibold">Inicia sesión</span>
          </button>
        </div>
      </div>
    )
  }

  // FORMULARIO
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Helmet>
        <title>{modoForm === 'login' ? 'Iniciar sesión' : 'Crear cuenta'} — Cancha Rápida</title>
      </Helmet>

      {/* Header */}
      <div className="px-6 pt-12 pb-8">
        <button
          onClick={() => setModoForm(null)}
          className="text-gray-500 hover:text-white transition-all text-sm flex items-center gap-2 mb-8"
        >
          ← Volver
        </button>
        <h2 className="text-3xl font-extrabold text-white">
          {modoForm === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta'}
        </h2>
        <p className="text-gray-400 text-sm mt-2">
          {modoForm === 'login'
            ? 'Inicia sesión para reservar tu cancha'
            : 'Empieza a reservar en segundos'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6">
        {error && (
          <div className="bg-red-400/10 border border-red-400/20 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

        {modoForm === 'registro' && (
            <div>
                <label className="text-xs text-gray-400 mb-1 block">Nombre completo</label>
                <input
                type="text"
                placeholder="Juan Pérez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-green-400 outline-none text-white text-sm"
                />
            </div>
            )}

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Correo</label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-green-400 outline-none text-white text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-green-400 outline-none text-white text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-400 text-gray-900 py-4 rounded-xl font-bold hover:bg-green-300 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Cargando...' : modoForm === 'login' ? 'Entrar' : 'Crear cuenta'}
          </button>
        </form>

        {modoForm === 'login' && (
            <button
                type="button"
                onClick={async () => {
                if (!email) {
                    setError('Ingresa tu correo primero')
                    return
                }
                try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`
                    })
                    if (error) throw error
                    setError(null)
                    alert('Te enviamos un correo para restablecer tu contraseña')
                } catch (err) {
                    setError(err.message)
                }
                }}
                className="w-full text-right text-xs text-gray-500 hover:text-green-400 transition-all mt-1"
            >
                ¿Olvidaste tu contraseña?
            </button>
            )}

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-600 text-xs">o continúa con</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        <button
          onClick={async () => {
            try { await signInWithGoogle() }
            catch (err) { setError(err.message) }
          }}
          className="w-full border border-white/10 py-4 rounded-xl text-sm text-gray-400 hover:bg-white/5 transition-all flex items-center justify-center gap-3"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continuar con Google
        </button>
      </div>

      <div className="px-6 pb-12 pt-6 text-center text-sm text-gray-500">
        {modoForm === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <button
          onClick={() => setModoForm(modoForm === 'login' ? 'registro' : 'login')}
          className="ml-2 text-green-400 hover:underline"
        >
          {modoForm === 'login' ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </div>
    </div>
  )
}

export default Login