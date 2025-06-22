
// ===========================================
// MASTER DATA METHODS (Colors, Sizes, Types, Print Types)

import { supabase } from "../supabaseClient"

// ===========================================
export const masterDataService = {
  // Colors
  colors: {
    async getAll() {
      const { data, error } = await supabase
        .from('colors')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(colorData) {
      const { data, error } = await supabase
        .from('colors')
        .insert([colorData])
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id, colorData) {
      const { data, error } = await supabase
        .from('colors')
        .update(colorData)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Sizes
  sizes: {
    async getAll() {
      const { data, error } = await supabase
        .from('sizes')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(sizeData) {
      const { data, error } = await supabase
        .from('sizes')
        .insert([sizeData])
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  convections: {
    async getAll() {
      const { data, error } = await supabase
        .from('convections')
        .select(`
          *
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
        `)
        .lt('stock', supabase.raw('buffer_stock'))
        .order('stock', { ascending: true })
      
      if (error) throw error
      return data
    }
  },

  // Types
  types: {
    async getAll() {
      const { data, error } = await supabase
        .from('types')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(typeData) {
      const { data, error } = await supabase
        .from('types')
        .insert([typeData])
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // Print Types
  printTypes: {
    async getAll() {
      const { data, error } = await supabase
        .from('print_types')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(printTypeData) {
      const { data, error } = await supabase
        .from('print_types')
        .insert([printTypeData])
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  categories: {
    async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get category by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new category
  async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update category
  async update(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete category
  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
  }
}

export default masterDataService;