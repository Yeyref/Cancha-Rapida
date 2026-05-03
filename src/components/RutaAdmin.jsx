import { Navigate } from "react-router-dom"
import { useUser } from "../hooks/useUser"

export default function RutaAdmin({ children }) {
  const { user, perfil, loading } = useUser()

  if (loading) return null

  if (!user) return <Navigate to="/login" />

  if (!perfil) return <Navigate to="/" />

  const tieneAcceso = perfil?.rol === 'admin' || perfil?.rol === 'superadmin'

  if (!user || !tieneAcceso) {
    return <Navigate to="/" replace />
  }

  return children
}