
// ===========================================
// STOCK TRANSACTION METHODS

import { supabase } from "../supabaseClient"

// ===========================================
export const StockTransactionService = {
  // Record product stock transaction
  async recordProductTransaction(variantId, quantity, transactionType) {
    const { data, error } = await supabase
      .from('product_stock_transactions')
      .insert([{
        variant_id: variantId,
        quantity: quantity,
        transaction_type: transactionType
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Record convection stock transaction
  async recordConvectionTransaction(convectionId, quantity, transactionType) {
    const { data, error } = await supabase
      .from('convection_stock_transactions')
      .insert([{
        convection_id: convectionId,
        quantity: quantity,
        transaction_type: transactionType
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Get product stock history
  async getProductStockHistory(variantId, limit = 50) {
    const { data, error } = await supabase
      .from('product_stock_transactions')
      .select(`
        *,
        product_variants(
          sku,
          products(name),
          sizes(name),
          colors(name)
        )
      `)
      .eq('variant_id', variantId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  // Get convection stock history
  async getConvectionStockHistory(convectionId, limit = 50) {
    const { data, error } = await supabase
      .from('convection_stock_transactions')
      .select(`
        *,
        convections(
          name,
          categories(name),
          colors(name),
          types(name)
        )
      `)
      .eq('convection_id', convectionId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}

export default StockTransactionService