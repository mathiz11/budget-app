import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

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
   * Dupliquer les catégories par défaut pour un mois spécifique
   */
  async duplicateDefaultCategoriesToMonth(userId: string, monthId: string): Promise<Category[]> {
    // Récupérer les catégories par défaut
    const defaultCategories = await this.getDefaultCategories(userId)

    // Vérifier si des catégories existent déjà pour ce mois
    const { data: existing } = await supabase.from('categories').select('*').eq('monthId', monthId)

    if (existing && existing.length > 0) {
      return existing
    }

    // Créer des copies spécifiques au mois
    const monthCategories = defaultCategories.map((cat) => ({
      userId,
      monthId,
      name: cat.name,
      budgetLimit: cat.budgetLimit,
      icon: cat.icon,
      isDefault: false, // Catégorie spécifique au mois
      order: cat.order
    }))

    const { data, error } = await supabase.from('categories').insert(monthCategories).select()

    if (error) throw error
    return data || []
  },

  /**
   * Récupérer les catégories spécifiques à un mois
   */
  async getMonthSpecificCategories(monthId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('monthId', monthId)
      .order('order')

    if (error) throw error
    return data || []
  },

  /**
   * Créer une catégorie spécifique à un mois
   */
  async createMonthCategory(
    userId: string,
    monthId: string,
    name: string,
    budgetLimit: number,
    icon?: string
  ): Promise<Category> {
    // Récupérer le nombre de catégories pour ce mois
    const { count } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('monthId', monthId)

    const { data, error } = await supabase
      .from('categories')
      .insert({
        userId,
        monthId,
        name,
        budgetLimit,
        icon,
        isDefault: false, // Spécifique au mois
        order: count || 0
      })
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
      const category = await this.createCategory(userId, cat.name, cat.budgetLimit, cat.icon, true)
      categories.push(category)
    }

    return categories
  }
}
