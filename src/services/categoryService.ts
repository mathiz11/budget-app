import { supabase } from '@/lib/supabase'
import type { Category, MonthCategory } from '@/types'

export const categoryService = {
  /**
   * Créer une catégorie par défaut
   */
  async createCategory(
    userId: string,
    name: string,
    budgetLimit: number,
    icon?: string,
    isDefault: boolean = true
  ): Promise<Category> {
    // Récupérer le nombre de catégories pour définir l'ordre
    const { count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('userId', userId)

    const { data, error } = await supabase
      .from('categories')
      .insert({
        userId,
        name,
        budgetLimit,
        icon,
        isDefault,
        order: count || 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer toutes les catégories par défaut d'un utilisateur
   */
  async getDefaultCategories(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('userId', userId)
      .eq('isDefault', true)
      .order('order')

    if (error) throw error
    return data || []
  },

  /**
   * Mettre à jour une catégorie
   */
  async updateCategory(
    categoryId: string,
    updates: Partial<Pick<Category, 'name' | 'budgetLimit' | 'icon'>>
  ): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer une catégorie
   */
  async deleteCategory(categoryId: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    if (error) throw error
  },

  /**
   * Copier les catégories par défaut vers un mois
   */
  async copyCategoriesToMonth(userId: string, monthId: string): Promise<MonthCategory[]> {
    // Récupérer les catégories par défaut
    const defaultCategories = await this.getDefaultCategories(userId)

    // Vérifier si les catégories existent déjà pour ce mois
    const { data: existing } = await supabase
      .from('month_categories')
      .select('*')
      .eq('monthId', monthId)

    if (existing && existing.length > 0) {
      return existing
    }

    // Créer les month_categories
    const monthCategories = defaultCategories.map((cat) => ({
      userId,
      monthId,
      categoryId: cat.id,
      budgetLimit: cat.budgetLimit
    }))

    const { data, error } = await supabase
      .from('month_categories')
      .insert(monthCategories)
      .select()

    if (error) throw error
    return data || []
  },

  /**
   * Récupérer les catégories d'un mois avec leurs budgets
   */
  async getMonthCategories(monthId: string): Promise<MonthCategory[]> {
    const { data, error } = await supabase
      .from('month_categories')
      .select('*, categories(*)')
      .eq('monthId', monthId)

    if (error) throw error
    return data || []
  },

  /**
   * Mettre à jour le budget d'une catégorie pour un mois spécifique
   */
  async updateMonthCategoryBudget(
    monthCategoryId: string,
    budgetLimit: number
  ): Promise<MonthCategory> {
    const { data, error } = await supabase
      .from('month_categories')
      .update({ budgetLimit, updatedAt: new Date().toISOString() })
      .eq('id', monthCategoryId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Initialiser les catégories par défaut pour un nouvel utilisateur
   */
  async initializeDefaultCategories(userId: string): Promise<Category[]> {
    const defaultCategories = [
      { name: 'Alimentation', budgetLimit: 300, icon: '🍔' },
      { name: 'Transport', budgetLimit: 150, icon: '🚗' },
      { name: 'Loisirs', budgetLimit: 200, icon: '🎮' },
      { name: 'Logement', budgetLimit: 800, icon: '🏠' },
      { name: 'Santé', budgetLimit: 100, icon: '💊' }
    ]

    const categories: Category[] = []
    for (const cat of defaultCategories) {
      const category = await this.createCategory(
        userId,
        cat.name,
        cat.budgetLimit,
        cat.icon,
        true
      )
      categories.push(category)
    }

    return categories
  }
}
