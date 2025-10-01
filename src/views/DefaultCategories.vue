<template>
  <div class="min-h-screen bg-base-200">
    <AppHeader />

    <div class="container mx-auto px-4 py-8">
      <!-- Header with title and button -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div class="flex-1">
          <h1 class="text-3xl font-bold mb-2">Catégories par défaut</h1>
          <p class="text-base-content/70">
            Gérez vos catégories par défaut. Elles seront dupliquées lors de la création de nouveaux
            mois.
          </p>
        </div>
        <button 
          @click="handleAddCategory" 
          class="btn btn-primary sm:btn-md whitespace-nowrap self-start sm:self-auto"
          :disabled="loading"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Ajouter
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-error">
        <span>{{ error }}</span>
      </div>

      <!-- Content -->
      <div v-else>

        <!-- Categories List -->
        <div v-if="defaultCategories.length === 0" class="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-16 h-16 mx-auto mb-4 text-base-content/30"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
            />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2">Aucune catégorie par défaut</h3>
          <p class="text-base-content/70 mb-6">
            Créez vos premières catégories par défaut pour commencer
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="category in defaultCategories"
            :key="category.id"
            class="card bg-base-100 shadow-xl"
          >
            <div class="card-body">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-2 flex-1">
                  <span class="text-3xl">{{ category.icon || '📦' }}</span>
                  <div class="flex-1">
                    <h3 class="card-title text-lg">{{ category.name }}</h3>
                    <p class="text-sm text-base-content/70">
                      Budget: {{ formatCurrency(category.budgetLimit) }}
                    </p>
                  </div>
                </div>
                <div class="flex gap-1">
                  <button
                    @click="handleEditCategory(category)"
                    class="btn btn-sm btn-ghost btn-circle"
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
                    @click="handleDeleteCategory(category.id)"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <CategoryModal ref="categoryModal" @submit="handleCategorySubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppHeader from '@/components/AppHeader.vue'
import CategoryModal from '@/components/CategoryModal.vue'
import { categoryService } from '@/services/categoryService'
import { calculationService } from '@/services/calculationService'
import type { Category, CategoryFormData } from '@/types'

const authStore = useAuthStore()

const defaultCategories = ref<Category[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const categoryModal = ref<InstanceType<typeof CategoryModal> | null>(null)
const editingCategory = ref<Category | null>(null)

const formatCurrency = (amount: number) => calculationService.formatCurrency(amount)

const loadDefaultCategories = async () => {
  if (!authStore.user) return

  try {
    loading.value = true
    error.value = null
    defaultCategories.value = await categoryService.getDefaultCategories(authStore.user.id)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur de chargement'
  } finally {
    loading.value = false
  }
}

const handleAddCategory = () => {
  editingCategory.value = null
  categoryModal.value?.openModal()
}

const handleEditCategory = (category: Category) => {
  editingCategory.value = category
  categoryModal.value?.openModal(category)
}

const handleCategorySubmit = async (data: CategoryFormData) => {
  if (!authStore.user || !data.budgetLimit) return

  try {
    if (editingCategory.value) {
      // Modifier la catégorie par défaut
      await categoryService.updateCategory(editingCategory.value.id, {
        name: data.name,
        budgetLimit: data.budgetLimit,
        icon: data.icon
      })
    } else {
      // Créer une nouvelle catégorie par défaut
      await categoryService.createCategory(
        authStore.user.id,
        data.name,
        data.budgetLimit,
        data.icon,
        true // isDefault = true
      )
    }
    await loadDefaultCategories()
    editingCategory.value = null
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde'
  }
}

const handleDeleteCategory = async (categoryId: string) => {
  if (
    confirm(
      'Êtes-vous sûr de vouloir supprimer cette catégorie par défaut ? Elle ne sera plus dupliquée dans les nouveaux mois.'
    )
  ) {
    try {
      await categoryService.deleteCategory(categoryId)
      await loadDefaultCategories()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur lors de la suppression'
    }
  }
}

onMounted(() => {
  loadDefaultCategories()
})
</script>
