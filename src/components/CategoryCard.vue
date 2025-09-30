<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex justify-between items-start mb-4">
        <div class="flex items-center gap-2">
          <span class="text-3xl">{{ category.icon || '📦' }}</span>
          <div>
            <h3 class="card-title text-lg">{{ category.name }}</h3>
            <p class="text-sm text-base-content/70">
              {{ formatCurrency(category.spent) }} / {{ formatCurrency(category.budgetLimit) }}
            </p>
          </div>
        </div>
        <div v-if="!isVirtualCategory" class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-sm btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="w-5 h-5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a @click="$emit('edit')">Modifier</a></li>
            <li><a @click="$emit('delete')" class="text-error">Supprimer</a></li>
          </ul>
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
