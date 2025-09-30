<template>
  <div class="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
    <div class="flex gap-2 items-center">
      <button @click="previousMonth" class="btn btn-circle btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <h2 class="text-2xl font-bold">
        {{ monthName }} {{ year }}
      </h2>

      <button @click="nextMonth" class="btn btn-circle btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-5 h-5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>

    <button @click="goToCurrentMonth" class="btn btn-sm btn-outline">
      Mois actuel
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { calculationService } from '@/services/calculationService'

const props = defineProps<{
  year: number
  month: number
}>()

const emit = defineEmits<{
  change: [year: number, month: number]
}>()

const monthName = computed(() => calculationService.getMonthName(props.month))

const previousMonth = () => {
  let newMonth = props.month - 1
  let newYear = props.year

  if (newMonth < 1) {
    newMonth = 12
    newYear--
  }

  emit('change', newYear, newMonth)
}

const nextMonth = () => {
  let newMonth = props.month + 1
  let newYear = props.year

  if (newMonth > 12) {
    newMonth = 1
    newYear++
  }

  emit('change', newYear, newMonth)
}

const goToCurrentMonth = () => {
  const now = new Date()
  emit('change', now.getFullYear(), now.getMonth() + 1)
}
</script>
