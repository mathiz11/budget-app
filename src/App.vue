<template>
  <div v-if="authStore.loading || isNavigating" class="min-h-screen flex items-center justify-center bg-base-200">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  <RouterView v-else />
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const isNavigating = ref(false)

// Afficher le loader pendant les navigations
router.beforeEach(() => {
  isNavigating.value = true
})

router.afterEach(() => {
  // Petit délai pour éviter le clignotement
  setTimeout(() => {
    isNavigating.value = false
  }, 100)
})

// Rediriger automatiquement après l'initialisation de l'auth
watch(() => authStore.loading, (loading, wasLoading) => {
  if (wasLoading && !loading) {
    // L'initialisation vient de se terminer
    const currentRoute = router.currentRoute.value
    
    if (authStore.user && currentRoute.path === '/login') {
      // Utilisateur connecté sur /login → rediriger vers /
      router.push('/')
    } else if (!authStore.user && currentRoute.meta.requiresAuth) {
      // Utilisateur non connecté sur page protégée → rediriger vers /login
      router.push('/login')
    }
  }
})

onMounted(async () => {
  await authStore.initialize()
})
</script>
