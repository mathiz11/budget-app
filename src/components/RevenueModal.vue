<template>
  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg mb-4">Définir le revenu du mois</h3>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Revenu mensuel (€)</span>
          </label>
          <input
            v-model.number="revenue"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            class="input input-bordered input-lg"
            required
          />
        </div>

        <div v-if="error" class="alert alert-error">
          <span>{{ error }}</span>
        </div>

        <div class="modal-action">
          <button type="button" @click="closeModal" class="btn">Annuler</button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner"></span>
            Enregistrer
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

const props = defineProps<{
  currentRevenue?: number
}>()

const emit = defineEmits<{
  submit: [revenue: number]
}>()

const modal = ref<HTMLDialogElement | null>(null)
const revenue = ref(props.currentRevenue || 0)
const loading = ref(false)
const error = ref<string | null>(null)

const openModal = () => {
  revenue.value = props.currentRevenue || 0
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

    if (!revenue.value || revenue.value < 0) {
      error.value = 'Le revenu doit être supérieur ou égal à 0'
      return
    }

    emit('submit', revenue.value)
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
