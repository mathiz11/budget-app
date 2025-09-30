<template>
  <div v-if="authStore.loading" class="min-h-screen flex items-center justify-center bg-base-200">
    <span class="loading loading-spinner loading-lg"></span>
  </div>
  <div v-else>
    <Dashboard v-if="authStore.user" />
    <AuthForm v-else />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AuthForm from '@/components/AuthForm.vue'
import Dashboard from '@/views/Dashboard.vue'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.initialize()
})
</script>
