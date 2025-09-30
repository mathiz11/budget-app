<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-3xl font-bold text-center mb-6">Connexion</h2>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input
              v-model="email"
              type="email"
              placeholder="votre@email.com"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Mot de passe</span>
            </label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="input input-bordered"
              required
            />
          </div>

          <div v-if="error" class="alert alert-error">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{{ error }}</span>
          </div>

          <div v-if="isBlocked" class="alert alert-warning">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span>Trop de tentatives échouées. Réessayez dans {{ remainingTime }} secondes.</span>
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" :disabled="loading || isBlocked">
              <span v-if="loading" class="loading loading-spinner"></span>
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

// Gestion des tentatives de connexion
const MAX_ATTEMPTS = 5
const BLOCK_DURATION = 300 // 5 minutes en secondes
const STORAGE_KEY = 'login_attempts'
const BLOCK_KEY = 'login_blocked_until'

const failedAttempts = ref(0)
const blockedUntil = ref<number | null>(null)
const remainingTime = ref(0)
let intervalId: number | null = null

const isBlocked = computed(() => {
  if (!blockedUntil.value) return false
  return Date.now() < blockedUntil.value
})

const loadAttempts = () => {
  const attempts = localStorage.getItem(STORAGE_KEY)
  const blocked = localStorage.getItem(BLOCK_KEY)
  
  if (attempts) {
    failedAttempts.value = parseInt(attempts, 10)
  }
  
  if (blocked) {
    blockedUntil.value = parseInt(blocked, 10)
    if (Date.now() >= blockedUntil.value) {
      // Le blocage est expiré
      resetAttempts()
    } else {
      startCountdown()
    }
  }
}

const resetAttempts = () => {
  failedAttempts.value = 0
  blockedUntil.value = null
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(BLOCK_KEY)
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

const incrementAttempts = () => {
  failedAttempts.value++
  localStorage.setItem(STORAGE_KEY, failedAttempts.value.toString())
  
  if (failedAttempts.value >= MAX_ATTEMPTS) {
    const blockUntil = Date.now() + (BLOCK_DURATION * 1000)
    blockedUntil.value = blockUntil
    localStorage.setItem(BLOCK_KEY, blockUntil.toString())
    startCountdown()
  }
}

const startCountdown = () => {
  if (intervalId) clearInterval(intervalId)
  
  const updateRemaining = () => {
    if (!blockedUntil.value) return
    
    const remaining = Math.ceil((blockedUntil.value - Date.now()) / 1000)
    remainingTime.value = Math.max(0, remaining)
    
    if (remaining <= 0) {
      resetAttempts()
    }
  }
  
  updateRemaining()
  intervalId = window.setInterval(updateRemaining, 1000)
}

onMounted(() => {
  loadAttempts()
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const handleSubmit = async () => {
  if (isBlocked.value) return
  
  try {
    loading.value = true
    error.value = null

    await authStore.signIn(email.value, password.value)
    // Connexion réussie, réinitialiser les tentatives
    resetAttempts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
    // Incrémenter les tentatives échouées
    incrementAttempts()
  } finally {
    loading.value = false
  }
}
</script>
