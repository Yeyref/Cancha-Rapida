import { supabase } from './supabase'

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

export const signUp = async (email, password, nombre) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre }
    }
  })
  if (error) throw error
  return data
}

export const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  if (error) throw error
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}