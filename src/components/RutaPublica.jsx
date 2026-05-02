import { useUser } from '../hooks/useUser'
import { Navigate } from 'react-router-dom'

function RutaPublica({ children }) {
  const { user, loading } = useUser()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-6 h-6 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (user) return <Navigate to="/" replace />

  return children
}

export default RutaPublica