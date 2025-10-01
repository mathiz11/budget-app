import { supabase } from '@/lib/supabase'
import type { Expense } from '@/types'

export const expenseService = {
  /**
   * Créer une nouvelle dépense
   */
  async createExpense(
    monthId: string,
    categoryId: string,
    amount: number,
    description: string,
    date: string
  ): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        monthId,
        categoryId,
        amount,
        description,
        date
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer toutes les dépenses d'un mois
   */
  async getMonthExpenses(monthId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('monthId', monthId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Récupérer les dépenses par catégorie pour un mois
   */
  async getExpensesByCategory(monthId: string, categoryId: string): Promise<Expense[]> {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('monthId', monthId)
      .eq('categoryId', categoryId)
      .order('date', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Mettre à jour une dépense
   */
  async updateExpense(
    expenseId: string,
    updates: Partial<Pick<Expense, 'amount' | 'description' | 'date' | 'categoryId'>>
  ): Promise<Expense> {
    const { data, error } = await supabase
      .from('expenses')
      .update(updates)
      .eq('id', expenseId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer une dépense
   */
  async deleteExpense(expenseId: string): Promise<void> {
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId)
    if (error) throw error
  },

  /**
   * Calculer le total des dépenses pour un mois
   */
  async getTotalExpenses(monthId: string): Promise<number> {
    const expenses = await this.getMonthExpenses(monthId)
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  },

  /**
   * Calculer le total des dépenses par catégorie
   */
  async getCategoryTotal(monthId: string, categoryId: string): Promise<number> {
    const expenses = await this.getExpensesByCategory(monthId, categoryId)
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }
}
