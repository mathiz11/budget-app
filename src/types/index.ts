// Types pour l'application de gestion de budget

export interface User {
  id: string
  email: string
}

export interface Month {
  id: string
  userId: string
  year: number
  month: number
  revenue: number
  createdAt: string
}

export interface Category {
  id: string
  userId: string
  monthId: string | null // NULL pour catégories par défaut, défini pour catégories spécifiques au mois
  name: string
  budgetLimit: number
  icon?: string
  isDefault: boolean
  order: number
  createdAt: string
  updatedAt: string
}

export interface Expense {
  id: string
  monthId: string
  categoryId: string
  amount: number
  description: string
  date: string
  createdAt: string
}

// Types pour les vues enrichies
export interface CategoryWithExpenses extends Category {
  spent: number
  budgetLimit: number
  percentage: number
}

export interface MonthSummary {
  revenue: number
  totalExpenses: number
  balance: number
  categories: CategoryWithExpenses[]
}

// Types pour les formulaires
export interface ExpenseFormData {
  amount: number | null
  categoryId: string
  description: string
  date: string
}

export interface CategoryFormData {
  name: string
  budgetLimit: number | null
  icon?: string
}

export interface MonthFormData {
  revenue: number | null
  year: number
  month: number
}
