// ===========================================
// TYPES METHODS

import { supabase } from "../supabaseClient"

// ===========================================
export const TypeService = {
  // Get all types
  async getAll() {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get type by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Get types by category ID
  async getByCategoryId(categoryId) {
    const { data, error } = await supabase
      .from('types')
      .select('*')
      .eq('category_id', categoryId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Create new type
  async create(typeData) {
    const { data, error } = await supabase
      .from('types')
      .insert([typeData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update type
  async update(id, typeData) {
    const { data, error } = await supabase
      .from('types')
      .update(typeData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete type
  async delete(id) {
    const { error } = await supabase
      .from('types')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export default TypeService