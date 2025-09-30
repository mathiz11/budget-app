import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/authService'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  /**
   * Initialiser l'authentification
   */
  async function initialize() {
    try {
      loading.value = true
      user.value = await authService.getCurrentUser()

      // Écouter les changements d'authentification
      authService.onAuthStateChange((newUser) => {
        user.value = newUser
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur inconnue'
    } finally {
      loading.value = false
    }
  }

  /**
   * Connexion
   */
  async function signIn(email: string, password: string) {
    try {
      error.value = null
      loading.value = true
      await authService.signIn(email, password)
      user.value = await authService.getCurrentUser()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de connexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Inscription
   */
  async function signUp(email: string, password: string) {
    try {
      error.value = null
      loading.value = true
      await authService.signUp(email, password)
      user.value = await authService.getCurrentUser()
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur d'inscription"
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Déconnexion
   */
  async function signOut() {
    try {
      error.value = null
      await authService.signOut()
      user.value = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de déconnexion'
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    initialize,
    signIn,
    signUp,
    signOut
  }
})
