import type { CategoryWithExpenses, MonthSummary } from '@/types'

export const calculationService = {
  /**
   * Calculer le pourcentage de budget consommé
   */
  calculatePercentage(spent: number, budget: number): number {
    if (budget === 0) return 0
    return Math.round((spent / budget) * 100)
  },

  /**
   * Déterminer la couleur selon le pourcentage
   */
  getProgressColor(percentage: number): string {
    if (percentage < 70) return 'success'
    if (percentage < 90) return 'warning'
    return 'error'
  },

  /**
   * Calculer le résumé du mois
   */
  calculateMonthSummary(
    revenue: number,
    categories: CategoryWithExpenses[]
  ): MonthSummary {
    const totalExpenses = categories.reduce((sum, cat) => sum + cat.spent, 0)
    const balance = revenue - totalExpenses

    return {
      revenue,
      totalExpenses,
      balance,
      categories
    }
  },

  /**
   * Formater un montant en euros
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  },

  /**
   * Formater une date
   */
  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  },

  /**
   * Obtenir le nom du mois
   */
  getMonthName(month: number): string {
    const months = [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ]
    return months[month - 1] || ''
  }
}
