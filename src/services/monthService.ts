import { supabase } from '@/lib/supabase'
import type { Month } from '@/types'

export const monthService = {
  /**
   * Récupérer un mois (sans le créer)
   */
  async getMonth(userId: string, year: number, month: number): Promise<Month | null> {
    const { data, error } = await supabase
      .from('months')
      .select('*')
      .eq('userId', userId)
      .eq('year', year)
      .eq('month', month)
      .maybeSingle()

    if (error) throw error
    return data
  },

  /**
   * Créer un nouveau mois
   */
  async createMonth(userId: string, year: number, month: number): Promise<Month> {
    const { data, error } = await supabase
      .from('months')
      .insert({
        userId,
        year,
        month,
        revenue: 0
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Mettre à jour le revenu d'un mois
   */
  async updateRevenue(monthId: string, revenue: number): Promise<Month> {
    const { data, error } = await supabase
      .from('months')
      .update({ revenue })
      .eq('id', monthId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer tous les mois d'un utilisateur
   */
  async getUserMonths(userId: string): Promise<Month[]> {
    const { data, error } = await supabase
      .from('months')
      .select('*')
      .eq('userId', userId)
      .order('year', { ascending: false })
      .order('month', { ascending: false })

    if (error) throw error
    return data || []
  }
}
