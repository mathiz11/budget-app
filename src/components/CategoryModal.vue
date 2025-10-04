<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">
        {{ editMode ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
      </h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Nom</span>
          </label>
          <input
            v-model="formData.name"
            type="text"
            placeholder="Ex: Alimentation"
            class="input input-bordered"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Budget limite (€)</span>
          </label>
          <input
            v-model.number="formData.budgetLimit"
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
            <span class="label-text">Icône (emoji)</span>
          </label>
          <input v-model="formData.icon" type="text" class="input input-bordered" maxlength="2" />
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CategoryFormData, Category } from '@/types'

const emit = defineEmits<{
  submit: [data: CategoryFormData]
}>()

const modal = ref<HTMLDialogElement | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const editMode = ref(false)

const formData = ref<CategoryFormData>({
  name: '',
  budgetLimit: null,
  icon: ''
})

const openModal = (category?: Category) => {
  if (category) {
    editMode.value = true
    formData.value = {
      name: category.name,
      budgetLimit: category.budgetLimit,
      icon: category.icon || ''
    }
  } else {
    editMode.value = false
    formData.value = {
      name: '',
      budgetLimit: null,
      icon: ''
    }
  }
  modal.value?.showModal()
}

const closeModal = () => {
  modal.value?.close()
  error.value = null
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = null

    if (!formData.value.name.trim()) {
      error.value = 'Le nom est requis'
      return
    }

    if (!formData.value.budgetLimit || formData.value.budgetLimit <= 0) {
      error.value = 'Le budget doit être supérieur à 0'
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
