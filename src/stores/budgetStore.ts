import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { monthService } from '@/services/monthService'
import { categoryService } from '@/services/categoryService'
import { expenseService } from '@/services/expenseService'
import { calculationService } from '@/services/calculationService'
import type {
  Month,
  Category,
  Expense,
  CategoryWithExpenses,
  MonthSummary
} from '@/types'

export const useBudgetStore = defineStore('budget', () => {
  // État
  const currentMonth = ref<Month | null>(null)
  const categories = ref<Category[]>([])
  const expenses = ref<Expense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const categoriesWithExpenses = computed<CategoryWithExpenses[]>(() => {
    if (!currentMonth.value) return []

    return categories.value.map((category) => {
      const categoryExpenses = expenses.value.filter(
        (exp) => exp.categoryId === category.id
      )
      const spent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      const percentage = calculationService.calculatePercentage(spent, category.budgetLimit)

      return {
        ...category,
        spent,
        percentage
      }
    })
  })

  const monthSummary = computed<MonthSummary | null>(() => {
    if (!currentMonth.value) return null

    return calculationService.calculateMonthSummary(
      currentMonth.value.revenue,
      categoriesWithExpenses.value
    )
  })

  /**
   * Charger un mois (sans le créer)
   */
  async function loadMonth(userId: string, year: number, month: number) {
    try {
      loading.value = true
      error.value = null

      // Récupérer le mois (sans le créer)
      currentMonth.value = await monthService.getMonth(userId, year, month)

      // Si le mois existe, charger les catégories et dépenses
      if (currentMonth.value) {
        await Promise.all([
          loadCategories(currentMonth.value.id),
          loadExpenses(currentMonth.value.id)
        ])
      } else {
        // Mois inexistant, réinitialiser les données
        categories.value = []
        expenses.value = []
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de chargement'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Charger les catégories spécifiques au mois
   */
  async function loadCategories(monthId: string) {
    try {
      categories.value = await categoryService.getMonthSpecificCategories(monthId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de chargement des catégories'
      throw err
    }
  }

  /**
   * Charger les dépenses
   */
  async function loadExpenses(monthId: string) {
    try {
      expenses.value = await expenseService.getMonthExpenses(monthId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de chargement des dépenses'
      throw err
    }
  }

  /**
   * Mettre à jour le revenu
   */
  async function updateRevenue(revenue: number) {
    if (!currentMonth.value) return

    try {
      currentMonth.value = await monthService.updateRevenue(currentMonth.value.id, revenue)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de mise à jour du revenu'
      throw err
    }
  }

  /**
   * Ajouter une dépense
   */
  async function addExpense(
    categoryId: string,
    amount: number,
    description: string,
    date: string
  ) {
    if (!currentMonth.value) return

    try {
      const expense = await expenseService.createExpense(
        currentMonth.value.id,
        categoryId,
        amount,
        description,
        date
      )
      expenses.value.unshift(expense)
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur d'ajout de dépense"
      throw err
    }
  }

  /**
   * Modifier une dépense
   */
  async function updateExpense(
    expenseId: string,
    updates: Partial<Pick<Expense, 'amount' | 'description' | 'date' | 'categoryId'>>
  ) {
    try {
      const updated = await expenseService.updateExpense(expenseId, updates)
      const index = expenses.value.findIndex((exp) => exp.id === expenseId)
      if (index !== -1) {
        expenses.value[index] = updated
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de modification de dépense'
      throw err
    }
  }

  /**
   * Supprimer une dépense
   */
  async function deleteExpense(expenseId: string) {
    try {
      await expenseService.deleteExpense(expenseId)
      expenses.value = expenses.value.filter((exp) => exp.id !== expenseId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de suppression de dépense'
      throw err
    }
  }

  /**
   * Ajouter une catégorie spécifique au mois actuel
   */
  async function addCategory(
    userId: string,
    name: string,
    budgetLimit: number,
    icon?: string
  ) {
    if (!currentMonth.value) return

    try {
      const category = await categoryService.createMonthCategory(
        userId,
        currentMonth.value.id,
        name,
        budgetLimit,
        icon
      )
      categories.value.push(category)
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur d'ajout de catégorie"
      throw err
    }
  }

  /**
   * Modifier une catégorie spécifique au mois
   */
  async function updateCategory(
    categoryId: string,
    updates: Partial<Pick<Category, 'name' | 'budgetLimit' | 'icon'>>
  ) {
    try {
      const updated = await categoryService.updateCategory(categoryId, updates)
      const index = categories.value.findIndex((cat) => cat.id === categoryId)
      if (index !== -1) {
        categories.value[index] = updated
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de modification de catégorie'
      throw err
    }
  }

  /**
   * Modifier le budget d'une catégorie pour le mois actuel
   */
  async function updateCategoryForCurrentMonth(
    categoryId: string,
    budgetLimit: number
  ) {
    if (!currentMonth.value) return

    try {
      // Mettre à jour directement la catégorie spécifique au mois
      await categoryService.updateCategory(categoryId, { budgetLimit })
      
      // Recharger les catégories pour refléter le changement
      await loadCategories(currentMonth.value.id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de modification du budget'
      throw err
    }
  }

  /**
   * Supprimer une catégorie
   */
  async function deleteCategory(categoryId: string) {
    try {
      await categoryService.deleteCategory(categoryId)
      categories.value = categories.value.filter((cat) => cat.id !== categoryId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de suppression de catégorie'
      throw err
    }
  }

  /**
   * Initialiser les catégories par défaut
   */
  async function initializeDefaultCategories(userId: string) {
    try {
      const defaultCategories = await categoryService.initializeDefaultCategories(userId)
      categories.value = defaultCategories
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erreur d\'initialisation des catégories'
      throw err
    }
  }

  /**
   * Initialiser un nouveau mois avec ses catégories
   */
  async function initializeMonth(userId: string, year: number, month: number) {
    try {
      loading.value = true
      error.value = null

      // Créer le mois
      currentMonth.value = await monthService.createMonth(userId, year, month)

      // Dupliquer les catégories par défaut vers le nouveau mois
      await categoryService.duplicateDefaultCategoriesToMonth(userId, currentMonth.value.id)

      // Charger les catégories et dépenses
      await Promise.all([
        loadCategories(currentMonth.value.id),
        loadExpenses(currentMonth.value.id)
      ])
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Erreur d\'initialisation du mois'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    currentMonth,
    categories,
    expenses,
    loading,
    error,
    categoriesWithExpenses,
    monthSummary,
    loadMonth,
    updateRevenue,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    updateCategoryForCurrentMonth,
    deleteCategory,
    initializeDefaultCategories,
    initializeMonth
  }
})
