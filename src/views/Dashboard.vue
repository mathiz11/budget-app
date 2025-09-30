<template>
  <div class="min-h-screen bg-base-200">
    <!-- Header -->
    <div class="navbar bg-base-100 shadow-lg">
      <div class="flex-1">
        <a class="btn btn-ghost normal-case text-xl">💰 Budget App</a>
      </div>
      <div class="flex-none gap-2">
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </label>
          <ul
            tabindex="0"
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-64"
          >
            <li class="menu-title">
              <span class="text-xs truncate">{{ authStore.user?.email }}</span>
            </li>
            <li>
              <a @click="handleSignOut" class="hover:bg-error hover:text-white">Déconnexion</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="budgetStore.loading" class="flex justify-center items-center min-h-[400px]">
        <span class="loading loading-spinner loading-lg"></span>
      </div>

      <!-- Error State -->
      <div v-else-if="budgetStore.error" class="alert alert-error">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ budgetStore.error }}</span>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Month Selector -->
        <MonthSelector :year="currentYear" :month="currentMonth" @change="handleMonthChange" />

        <!-- Summary Cards -->
        <MonthSummaryCard
          v-if="budgetStore.monthSummary"
          :summary="budgetStore.monthSummary"
          @edit-revenue="revenueModal?.openModal()"
        />

        <!-- Actions -->
        <div class="flex flex-wrap gap-4 mb-6">
          <ExpenseForm
            ref="expenseForm"
            :categories="budgetStore.categories"
            @submit="handleAddExpense"
          />
          <button
            @click="categoryModal?.openModal()"
            :disabled="!budgetStore.currentMonth"
            class="btn btn-outline"
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
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
              />
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" />
            </svg>
            Ajouter une catégorie
          </button>
        </div>

        <!-- Info pour budget non catégorisé -->
        <div
          v-if="uncategorizedBudget > 0"
          class="bg-base-100 rounded-lg p-3 shadow mb-6 flex items-center gap-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="shrink-0 h-5 w-5 text-base-content/70"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span class="text-sm text-base-content/80">
            <span class="hidden sm:inline"
              >{{ formatCurrency(uncategorizedBudget) }} non catégorisé</span
            >
            <span class="sm:hidden">{{ formatCurrency(uncategorizedBudget) }} restant</span>
          </span>
        </div>

        <!-- Empty state - Initialiser le mois -->
        <div v-if="!budgetStore.currentMonth" class="text-center py-12">
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
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z"
            />
          </svg>
          <h3 class="text-xl font-semibold mb-2">Mois non initialisé</h3>
          <p class="text-base-content/70 mb-6">
            Initialisez ce mois pour commencer à gérer votre budget et vos dépenses
          </p>
          <button
            @click="handleInitializeMonth"
            class="btn btn-primary"
            :disabled="budgetStore.loading"
          >
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
            <span v-if="budgetStore.loading" class="loading loading-spinner"></span>
            Initialiser le mois
          </button>
        </div>

        <!-- Categories Grid -->
        <div
          v-else-if="budgetStore.currentMonth"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          <CategoryCard
            v-for="category in realCategories"
            :key="category.id"
            :category="category"
            @edit="handleEditCategory(category)"
            @delete="handleDeleteCategory(category.id)"
          />
        </div>

        <!-- Expenses List Toggle -->
        <div class="mb-4">
          <button @click="showExpenses = !showExpenses" class="btn btn-outline btn-block">
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
                d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
              />
            </svg>
            {{ showExpenses ? 'Masquer' : 'Voir' }} l'historique des dépenses
          </button>
        </div>

        <!-- Expenses List -->
        <ExpenseList
          v-if="showExpenses"
          :expenses="budgetStore.expenses"
          :categories="budgetStore.categories"
          @edit="handleEditExpense"
          @delete="handleDeleteExpense"
        />
      </div>
    </div>

    <!-- Modals -->
    <RevenueModal
      ref="revenueModal"
      :current-revenue="budgetStore.currentMonth?.revenue"
      @submit="handleUpdateRevenue"
    />
    <CategoryModal ref="categoryModal" @submit="handleCategorySubmit" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useBudgetStore } from '@/stores/budgetStore'
import MonthSelector from '@/components/MonthSelector.vue'
import MonthSummaryCard from '@/components/MonthSummaryCard.vue'
import CategoryCard from '@/components/CategoryCard.vue'
import ExpenseForm from '@/components/ExpenseForm.vue'
import ExpenseList from '@/components/ExpenseList.vue'
import RevenueModal from '@/components/RevenueModal.vue'
import CategoryModal from '@/components/CategoryModal.vue'
import type {
  ExpenseFormData,
  CategoryFormData,
  Category,
  Expense,
  CategoryWithExpenses
} from '@/types'

const authStore = useAuthStore()
const budgetStore = useBudgetStore()

const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)

const revenueModal = ref<InstanceType<typeof RevenueModal> | null>(null)
const categoryModal = ref<InstanceType<typeof CategoryModal> | null>(null)
const expenseForm = ref<InstanceType<typeof ExpenseForm> | null>(null)

const editingCategory = ref<Category | null>(null)
const showExpenses = ref(false)

const realCategories = computed(() => {
  return budgetStore.categoriesWithExpenses.filter((cat) => cat.id !== 'virtual-autre')
})

const uncategorizedBudget = computed(() => {
  if (!budgetStore.currentMonth) return 0
  const totalBudgetAllocated = realCategories.value.reduce(
    (sum: number, cat: CategoryWithExpenses) => sum + cat.budgetLimit,
    0
  )
  return Math.max(0, budgetStore.currentMonth.revenue - totalBudgetAllocated)
})

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount)
}

onMounted(async () => {
  if (authStore.user) {
    await budgetStore.loadMonth(authStore.user.id, currentYear.value, currentMonth.value)
  }
})

const handleMonthChange = async (year: number, month: number) => {
  currentYear.value = year
  currentMonth.value = month
  if (authStore.user) {
    await budgetStore.loadMonth(authStore.user.id, year, month)
  }
}

const handleUpdateRevenue = async (revenue: number) => {
  await budgetStore.updateRevenue(revenue)
}

const handleAddExpense = async (data: ExpenseFormData) => {
  if (!authStore.user || !data.amount) return
  await budgetStore.addExpense(
    authStore.user.id,
    data.categoryId,
    data.amount,
    data.description,
    data.date
  )
}

const handleEditExpense = async (expense: Expense) => {
  // TODO: Implement edit expense
  console.log('Edit expense:', expense)
}

const handleDeleteExpense = async (expenseId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) {
    await budgetStore.deleteExpense(expenseId)
  }
}

const handleCategorySubmit = async (data: CategoryFormData) => {
  if (!authStore.user || !data.budgetLimit) return

  if (editingCategory.value) {
    await budgetStore.updateCategory(editingCategory.value.id, {
      name: data.name,
      budgetLimit: data.budgetLimit,
      icon: data.icon
    })
    editingCategory.value = null
  } else {
    await budgetStore.addCategory(authStore.user.id, data.name, data.budgetLimit, data.icon)
  }
}

const handleEditCategory = (category: Category) => {
  editingCategory.value = category
  categoryModal.value?.openModal(category)
}

const handleDeleteCategory = async (categoryId: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    await budgetStore.deleteCategory(categoryId)
  }
}

const handleSignOut = async () => {
  await authStore.signOut()
}

const handleInitializeMonth = async () => {
  if (!authStore.user) return
  await budgetStore.initializeMonth(authStore.user.id, currentYear.value, currentMonth.value)
}
</script>
