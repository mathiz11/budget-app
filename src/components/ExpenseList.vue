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

      <div v-else class="overflow-x-auto">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Catégorie</th>
              <th class="text-right">Montant</th>
              <th></th>
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
                <div class="dropdown dropdown-end">
                  <label tabindex="0" class="btn btn-ghost btn-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      class="w-4 h-4"
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
                    class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32"
                  >
                    <li><a @click="$emit('edit', expense)">Modifier</a></li>
                    <li><a @click="$emit('delete', expense.id)" class="text-error">Supprimer</a></li>
                  </ul>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
