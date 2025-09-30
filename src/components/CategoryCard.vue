<template>
  <div class="card bg-base-100 shadow-xl relative">
    <!-- Badge par défaut en haut à droite -->
    <div v-if="category.isDefault" class="absolute top-2 right-8 z-10">
      <span class="badge badge-sm badge-success badge-outline">Par défaut</span>
    </div>

    <div class="card-body">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2 flex-1 pr-2">
          <span class="text-3xl">{{ category.icon || '📦' }}</span>
          <div class="flex-1">
            <h3 class="card-title text-lg">{{ category.name }}</h3>
            <p class="text-sm text-base-content/70">
              {{ formatCurrency(category.spent) }} / {{ formatCurrency(category.budgetLimit) }}
            </p>
          </div>
        </div>
        <div v-if="!isVirtualCategory" class="flex gap-1 flex-shrink-0">
          <button @click="$emit('edit')" class="btn btn-sm btn-ghost btn-circle" title="Modifier">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
          </button>
          <button
            @click="$emit('delete')"
            class="btn btn-sm btn-ghost btn-circle"
            title="Supprimer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Barre de progression native avec Tailwind -->
      <div class="w-full bg-base-300 rounded-full h-4 overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-300"
          :class="progressColorClass"
          :style="{ width: `${Math.min(category.percentage, 100)}%` }"
        ></div>
      </div>

      <div class="flex justify-between items-center mt-2">
        <span class="text-sm font-semibold" :class="progressTextClass">
          {{ category.percentage }}%
        </span>
        <span class="text-sm text-base-content/70">
          Reste: {{ formatCurrency(category.budgetLimit - category.spent) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CategoryWithExpenses } from '@/types'
import { calculationService } from '@/services/calculationService'

const props = defineProps<{
  category: CategoryWithExpenses
}>()

defineEmits<{
  edit: []
  delete: []
}>()

const formatCurrency = (amount: number) => calculationService.formatCurrency(amount)

const isVirtualCategory = computed(() => props.category.id === 'virtual-autre')

const progressColorClass = computed(() => {
  if (props.category.percentage <= 100) return 'bg-success'
  return 'bg-error'
})

const progressTextClass = computed(() => {
  if (props.category.percentage <= 100) return 'text-success'
  return 'text-error'
})
</script>
