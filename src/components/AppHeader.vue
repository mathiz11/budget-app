<template>
  <div class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">💰 Budget App</a>
    </div>
    <div v-if="authStore.user" class="flex-none gap-2">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </label>
        <ul
          tabindex="0"
          class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64"
        >
          <li class="menu-title">
            <span class="text-xs truncate">{{ authStore.user?.email }}</span>
          </li>
          <li>
            <a @click="handleSignOut" class="hover:bg-error hover:text-white">Déconnexion</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const handleSignOut = async () => {
  await authStore.signOut()
}
</script>
