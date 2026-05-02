import { supabase } from './supabase'

export const obtenerReservas = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('reservas')
    .select('*, canchas(nombre, deporte)')
    .is('eliminado_en', null)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const crearReserva = async (reserva) => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('No autenticado')

  const { data, error } = await supabase
    .from('reservas')
    .insert([{ ...reserva, user_id: user.id }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const cancelarReserva = async (id) => {
  const { error } = await supabase
    .from('reservas')
    .update({ estado: 'cancelada' })
    .eq('id', id)

  if (error) throw error
}

export const softDeleteReserva = async (id) => {
  const { error } = await supabase
    .from('reservas')
    .update({ eliminado_en: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export const obtenerReservasPorCanchaYFecha = async (cancha_id, fecha) => {
  const { data, error } = await supabase
    .from('reservas')
    .select('hora')
    .eq('cancha_id', cancha_id)
    .eq('fecha', fecha)
    .eq('estado', 'confirmada')

  if (error) throw error
  return data
}