<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body">
      <h2 class="card-title mb-4">Historique des dépenses</h2>

      <div v-if="expenses.length === 0" class="text-center py-8 text-base-content/70">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-16 h-16 mx-auto mb-4 opacity-50"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
        <p>Aucune dépense pour le moment</p>
      </div>

      <!-- Desktop: Table -->
      <div v-if="expenses.length > 0" class="hidden md:block overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Catégorie</th>
              <th class="text-right">Montant</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in sortedExpenses" :key="expense.id">
              <td>{{ formatDate(expense.date) }}</td>
              <td>{{ expense.description }}</td>
              <td>
                <span class="badge badge-outline">
                  {{ getCategoryName(expense.categoryId) }}
                </span>
              </td>
              <td class="text-right font-semibold">{{ formatCurrency(expense.amount) }}</td>
              <td>
                <div class="flex justify-end gap-1">
                  <button
                    @click="$emit('edit', expense)"
                    class="btn btn-ghost btn-sm btn-circle"
                    title="Modifier"
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
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                      />
                    </svg>
                  </button>
                  <button
                    @click="$emit('delete', expense.id)"
                    class="btn btn-ghost btn-sm btn-circle"
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
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile: Cards -->
      <div v-if="expenses.length > 0" class="md:hidden space-y-3">
        <div v-for="expense in sortedExpenses" :key="expense.id" class="bg-base-200 rounded-lg p-4">
          <div class="flex justify-between items-start mb-2">
            <div class="flex-1">
              <p class="font-semibold">{{ expense.description }}</p>
              <p class="text-sm text-base-content/70">{{ formatDate(expense.date) }}</p>
            </div>
            <div class="flex gap-1">
              <button
                @click="$emit('edit', expense)"
                class="btn btn-ghost btn-sm btn-circle"
                title="Modifier"
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
              <button
                @click="$emit('delete', expense.id)"
                class="btn btn-ghost btn-sm btn-circle"
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
          <div class="flex justify-between items-center gap-2">
            <span class="badge badge-outline px-3 py-3">
              {{ getCategoryName(expense.categoryId) }}
            </span>
            <span class="text-lg font-bold whitespace-nowrap">{{
              formatCurrency(expense.amount)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Expense, Category } from '@/types'
import { calculationService } from '@/services/calculationService'

const props = defineProps<{
  expenses: Expense[]
  categories: Category[]
}>()

defineEmits<{
  edit: [expense: Expense]
  delete: [expenseId: string]
}>()

const sortedExpenses = computed(() => {
  return [...props.expenses].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

const formatCurrency = (amount: number) => calculationService.formatCurrency(amount)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const getCategoryName = (categoryId: string) => {
  const category = props.categories.find((cat) => cat.id === categoryId)
  return category ? `${category.icon || ''} ${category.name}` : 'Inconnue'
}
</script>
