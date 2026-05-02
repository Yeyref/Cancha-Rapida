import { useUser } from '../hooks/useUser'
import { Navigate, useLocation } from 'react-router-dom'

function RutaPrivada({ children }) {
  const { user, loading } = useUser()
  const location = useLocation()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return children
}

export default RutaPrivada