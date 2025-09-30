<template>
  <div>
    <button @click="openModal" :disabled="!budgetStore.currentMonth" class="btn btn-primary">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Ajouter une dépense
    </button>

    <!-- Modal -->
    <dialog ref="modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-4">
          {{ editMode ? 'Modifier la dépense' : 'Nouvelle dépense' }}
        </h3>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Montant (€)</span>
            </label>
            <input
              v-model.number="formData.amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Catégorie</span>
            </label>
            <select v-model="formData.categoryId" class="select select-bordered" required>
              <option value="" disabled>Sélectionner une catégorie</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Description</span>
            </label>
            <input
              v-model="formData.description"
              type="text"
              placeholder="Ex: Courses du mois"
              class="input input-bordered"
              required
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Date</span>
            </label>
            <input v-model="formData.date" type="date" class="input input-bordered" required />
          </div>

          <div v-if="error" class="alert alert-error">
            <span>{{ error }}</span>
          </div>

          <div class="modal-action">
            <button type="button" @click="closeModal" class="btn">Annuler</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ editMode ? 'Modifier' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Category, Expense, ExpenseFormData } from '@/types'
import { useBudgetStore } from '@/stores/budgetStore'

const budgetStore = useBudgetStore()

const props = defineProps<{
  categories: Category[]
  expense?: Expense
}>()

const emit = defineEmits<{
  submit: [data: ExpenseFormData]
}>()

const modal = ref<HTMLDialogElement | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const editMode = ref(false)

const formData = ref<ExpenseFormData>({
  amount: null,
  categoryId: '',
  description: '',
  date: new Date().toISOString().split('T')[0]
})

watch(
  () => props.expense,
  (expense) => {
    if (expense) {
      editMode.value = true
      formData.value = {
        amount: expense.amount,
        categoryId: expense.categoryId,
        description: expense.description,
        date: expense.date.split('T')[0]
      }
    }
  }
)

const openModal = () => {
  modal.value?.showModal()
}

const closeModal = () => {
  modal.value?.close()
  resetForm()
}

const resetForm = () => {
  formData.value = {
    amount: null,
    categoryId: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  }
  editMode.value = false
  error.value = null
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null

    if (!formData.value.amount || formData.value.amount <= 0) {
      error.value = 'Le montant doit être supérieur à 0'
      return
    }

    emit('submit', formData.value)
    closeModal()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

defineExpose({
  openModal
})
</script>
