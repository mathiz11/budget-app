import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

export const authService = {
  /**
   * Inscription d'un nouvel utilisateur
   */
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  },

  /**
   * Connexion d'un utilisateur
   */
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  },

  /**
   * Déconnexion
   */
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user }
    } = await supabase.auth.getUser()
    if (!user) return null
    return {
      id: user.id,
      email: user.email || ''
    }
  },

  /**
   * Écouter les changements d'authentification
   */
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        callback({
          id: session.user.id,
          email: session.user.email || ''
        })
      } else {
        callback(null)
      }
    })
  }
}
