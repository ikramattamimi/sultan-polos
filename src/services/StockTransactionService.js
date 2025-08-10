// ===========================================
// STOCK TRANSACTION METHODS

import { supabase } from "../supabaseClient"

// ===========================================
export const StockTransactionService = {
  // Record product stock transaction + update product_variants.stock (manual)
  async recordProductTransaction(variantId, quantity, transactionType) {
    const { data: txn, error: txnError } = await supabase
      .from('product_stock_transactions')
      .insert([{
        variant_id: variantId,
        quantity,
        transaction_type: transactionType
      }])
      .select()
      .single();

    if (txnError) throw txnError;

    // Manual stock update for product_variants
    const { data: variant, error: getErr } = await supabase
      .from('product_variants')
      .select('stock')
      .eq('id', variantId)
      .single();
    if (getErr) throw getErr;

    const newStock = (variant?.stock || 0) + quantity;
    if (newStock < 0) {
      throw new Error(`Stok produk tidak boleh negatif (variant_id=${variantId})`);
    }

    const { error: updErr } = await supabase
      .from('product_variants')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', variantId);

    if (updErr) throw updErr;
    return txn;
  },

  // Record convection stock transaction + update convections.stock (manual)
  async recordConvectionTransaction(convectionId, quantity, transactionType) {
    const { data: txn, error: txnError } = await supabase
      .from('convection_stock_transactions')
      .insert([{
        convection_id: convectionId,
        quantity,
        transaction_type: transactionType
      }])
      .select()
      .single();

    if (txnError) throw txnError;

    // Manual stock update for convections
    const { data: conv, error: getErr } = await supabase
      .from('convections')
      .select('stock')
      .eq('id', convectionId)
      .single();
    if (getErr) throw getErr;

    const newStock = (conv?.stock || 0) + quantity;
    if (newStock < 0) {
      throw new Error(`Stock bahan mentah tidak boleh negatif (convection_id=${convectionId})`);
    }

    const { error: updErr } = await supabase
      .from('convections')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', convectionId);

    if (updErr) throw updErr;
    return txn;
  },

  // Get product stock history
  async getProductStockHistory(variantId, limit = 50) {
    const { data, error } = await supabase
      .from('product_stock_transactions')
      .select(`
        *,
        product_variants(
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