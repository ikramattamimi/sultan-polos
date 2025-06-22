// ===========================================
// CONVECTION (RAW MATERIALS) METHODS
// ===========================================



import { supabase } from "../supabaseClient"

export const convectionService = {
  // Get all convections
  async getAll() {
    const { data, error } = await supabase
      .from('convections')
      .select(`
        *,
        colors(id, name, hex_code)
      `)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get convection by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('convections')
      .select(`
        *,
        colors(id, name, hex_code)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new convection
  async create(convectionData) {
    const { data, error } = await supabase
      .from('convections')
      .insert([convectionData])
      .select(`
        *,
        colors(id, name, hex_code)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Update convection
  async update(id, convectionData) {
    const { data, error } = await supabase
      .from('convections')
      .update(convectionData)
      .eq('id', id)
      .select(`
        *,
        colors(id, name, hex_code)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Check low stock convections
  async getLowStock() {
    const { data, error } = await supabase
      .from('convections')
      .select(`
        *,
        colors(id, name, hex_code)
      `)
      .lt('stock', supabase.raw('buffer_stock'))
      .order('stock', { ascending: true })
    
    if (error) throw error
    return data
  }
}

export default convectionService