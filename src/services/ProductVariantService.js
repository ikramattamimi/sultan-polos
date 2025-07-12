import { supabase } from "../supabaseClient"

export const ProductVariantService = {
  // Get all variants for a product
  async getByProductId(productId) {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        products(id, name),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name),
        images(*)
      `)
      .eq('product_id', productId)
      .order('sku', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get unique partners from product_variants
  async getUniquePartners() {
    const { data, error } = await supabase
    .from('product_variants')
    .select('partner')
    .not('partner', 'is', null)
    .not('partner', 'eq', '')

    if (error) throw error

    // Extract unique partners
    const uniquePartners = [...new Set(data.map(item => item.partner))].filter(Boolean)
    return uniquePartners.sort()
  },


  // Get variant by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        products(id, name),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name),
        images(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new variant
  async create(variantData) {
    const { data, error } = await supabase
      .from('product_variants')
      .insert([variantData])
      .select(`
        *,
        products(id, name),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Update variant
  async update(id, variantData) {
    const { data, error } = await supabase
      .from('product_variants')
      .update(variantData)
      .eq('id', id)
      .select(`
        *,
        products(id, name),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Update stock
  async updateStock(id, newStock) {
    const { data, error } = await supabase
      .from('product_variants')
      .update({ stock: newStock })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Check low stock variants
  async getLowStock(threshold = 10) {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        *,
        products(id, name),
        sizes(id, name),
        colors(id, name, hex_code)
      `)
      .lte('stock', threshold)
      .order('stock', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Delete variant
  async delete(id) {
    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

export default ProductVariantService;