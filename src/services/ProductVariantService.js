import { supabase } from "../supabaseClient"
import StockTransactionService from './StockTransactionService.js';
import ConvectionService from './ConvectionService.js';

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
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
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
    // Validate convection quantity vs available stock
    if (variantData.convection_id && variantData.convection_quantity > 0) {
      const convection = await ConvectionService.getById(variantData.convection_id);
      const available = convection?.stock || 0;
      if (variantData.convection_quantity > available) {
        throw new Error(`Jumlah bahan (${variantData.convection_quantity}) melebihi stok tersedia (${available})`);
      }
    }

    // Force initial stock = 0, akan dinaikkan via transaksi INIT
    const initialStock = variantData.stock || 0;
    const insertPayload = { ...variantData, stock: 0, updated_at: new Date().toISOString() };

    const { data: variant, error } = await supabase
      .from('product_variants')
      .insert([insertPayload])
      .select(`*`)
      .single();
    if (error) throw error;

    // Catat INIT stock jika > 0
    if (initialStock > 0) {
      await StockTransactionService.recordProductTransaction(variant.id, initialStock, 'INIT');
    }

    // Catat penggunaan bahan baku (PRODUCTION)
    if (variantData.convection_id && variantData.convection_quantity > 0) {
      await StockTransactionService.recordConvectionTransaction(
        variantData.convection_id,
        -variantData.convection_quantity,
        'PRODUCTION'
      );
    }

    return variant;
  },

  // Update variant
  async update(id, variantData) {
    // Validasi convection_quantity pada UPDATE juga
    if (variantData.convection_id && variantData.convection_quantity >= 0) {
      const convection = await ConvectionService.getById(variantData.convection_id);
      const available = convection?.stock || 0;
      if (variantData.convection_quantity > available) {
        throw new Error(`Jumlah bahan (${variantData.convection_quantity}) melebihi stok tersedia (${available})`);
      }
    }

    const { data, error } = await supabase
      .from('product_variants')
      .update({ ...variantData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
    if (error) throw error;
    return data;
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