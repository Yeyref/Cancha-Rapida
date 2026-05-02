import { supabase } from './supabase'

export const obtenerCanchas = async () => {
  const { data, error } = await supabase
    .from('canchas')
    .select('*')

  if (error) throw error
  return data
}