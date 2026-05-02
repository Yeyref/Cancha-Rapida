import { supabase } from './supabase'

export const obtenerReservas = async () => {
  const { data, error } = await supabase
    .from('reservas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const crearReserva = async (reserva) => {
  const { data, error } = await supabase
    .from('reservas')
    .insert([reserva])
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