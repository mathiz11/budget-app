<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <!-- Revenu -->
    <div class="stats shadow bg-base-100">
      <div class="stat">
        <div class="stat-figure text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"
            />
          </svg>
        </div>
        <div class="stat-title">Budget</div>
        <div class="stat-value text-primary">{{ formatCurrency(summary.revenue) }}</div>
        <div class="stat-actions">
          <button @click="$emit('edit-revenue')" class="btn btn-sm btn-ghost">
            Modifier
          </button>
        </div>
      </div>
    </div>

    <!-- Dépenses -->
    <div class="stats shadow bg-base-100">
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
        </div>
        <div class="stat-title">Dépenses</div>
        <div class="stat-value text-secondary">{{ formatCurrency(summary.totalExpenses) }}</div>
        <div class="stat-desc">
          {{ calculatePercentage(summary.totalExpenses, summary.revenue) }}% du revenu
        </div>
      </div>
    </div>

    <!-- Solde -->
    <div class="stats shadow bg-base-100">
      <div class="stat">
        <div class="stat-figure" :class="summary.balance >= 0 ? 'text-success' : 'text-error'">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
            />
          </svg>
        </div>
        <div class="stat-title">Solde</div>
        <div
          class="stat-value"
          :class="summary.balance >= 0 ? 'text-success' : 'text-error'"
        >
          {{ formatCurrency(summary.balance) }}
        </div>
        <div class="stat-desc" v-if="summary.balance < 0">
          Budget dépassé !
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MonthSummary } from '@/types'
import { calculationService } from '@/services/calculationService'

defineProps<{
  summary: MonthSummary
}>()

defineEmits<{
  'edit-revenue': []
}>()

const formatCurrency = (amount: number) => calculationService.formatCurrency(amount)
const calculatePercentage = (spent: number, budget: number) =>
  calculationService.calculatePercentage(spent, budget)
</script>
