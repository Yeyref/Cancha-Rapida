import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-8">
        <Helmet>
        <title>Página no encontrada — Cancha Rápida</title>
        </Helmet>
      <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">Error 404</p>
      <h1 className="text-6xl font-extrabold text-white mb-4">Página no encontrada</h1>
      <p className="text-gray-500 text-lg mb-10 max-w-md">
        Esta cancha no existe. Quizás fue cancelada, o la URL está mal.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-green-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-green-300 transition-all"
      >
        Volver al inicio
      </button>
    </div>
  )
}

export default NotFound