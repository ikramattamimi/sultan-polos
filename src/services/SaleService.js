// ===========================================
// SALES METHODS
// ===========================================
import {supabase} from "../supabaseClient"

export const SaleService = {
// Get unique customer names from sales.customer
  async getCustomerNames() {
    const { data, error } = await supabase
      .from('sales')
      .select('customer')
      .neq('customer', null);
    if (error) throw error;
    // Ambil hanya nama unik, urutkan by nama
    const names = Array.from(new Set((data || []).map(row => row.customer?.trim()).filter(Boolean)));
    names.sort((a, b) => a.localeCompare(b, 'id'));
    return names;
  },

  // Get all sales
  async getAll(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items(
          *,
          product_variants(
            *,
            products(
              name,
              categories(name)
            ),
            sizes(name),
            colors(name, hex_code)
          ),
          print_types(name, price)
        )
      `)
      .order('sale_date', { ascending: false })
      .range(offset, offset + limit - 1)
    
    if (error) throw error
    return data
  },

  // Get sale by ID
  async getById(id) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items(
          *,
          product_variants(
            *,
            products(name),
            sizes(name),
            colors(name, hex_code)
          ),
          print_types(name, price)
        )
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create new sale with items
  async createSaleAndItems(saleData, saleItems) {
    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert([saleData])
      .select()
      .single()
    
    if (saleError) throw saleError

    // Add sale_id to each item
    const itemsWithSaleId = saleItems.map(item => ({
      ...item,
      sale_id: sale.id
    }))

    const { data: items, error: itemsError } = await supabase
      .from('sale_items')
      .insert(itemsWithSaleId)
      .select(`
        *,
        product_variants(
          *,
          products(name),
          sizes(name),
          colors(name, hex_code)
        ),
        print_types(name, price)
      `)
    
    if (itemsError) throw itemsError

    return { ...sale, sale_items: items }
  },

  // Get sales by date range
  async getByDateRange(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items(
          *,
          product_variants(
            *,
            products(name),
            sizes(name),
            colors(name, hex_code)
          )
        )
      `)
      .gte('sale_date', startDate)
      .lte('sale_date', endDate)
      .order('sale_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Get sales summary
  async getSalesSummary(startDate, endDate) {
    const { data, error } = await supabase
      .from('sales')
      .select('total_price, sale_date')
      .gte('sale_date', startDate)
      .lte('sale_date', endDate)
    
    if (error) throw error
    
    const totalSales = data.reduce((sum, sale) => sum + parseFloat(sale.total_price), 0)
    const totalTransactions = data.length
    
    return {
      totalSales,
      totalTransactions,
      averageTransaction: totalTransactions > 0 ? totalSales / totalTransactions : 0
    }
  },

  // Delete sale and its items
  async delete(saleId) {
    // Mulai transaction dengan mengambil detail sale beserta items
    const { data: saleWithItems, error: fetchError } = await supabase
    .from('sales')
    .select(`
      *,
      sale_items(
        *,
        product_variants(id, stock)
      )
    `)
    .eq('id', saleId)
    .single()

    if (fetchError) throw fetchError
    if (!saleWithItems) throw new Error('Sale tidak ditemukan')

    // 1. Restore stock untuk setiap item yang dijual
    for (const item of saleWithItems.sale_items) {
      // Update stock produk (tambahkan kembali quantity yang dijual)
      const { error: stockError } = await supabase
      .from('product_variants')
      .update({
        stock: item.product_variants.stock + item.quantity
      })
      .eq('id', item.variant_id)

      if (stockError) throw stockError

      // Buat record transaksi stok untuk tracking
      const { error: transactionError } = await supabase
      .from('product_stock_transactions')
      .insert({
        variant_id: item.variant_id,
        quantity: item.quantity, // Positif karena stock kembali
        transaction_type: 'ADJUSTMENT',
        notes: `Stock restored from deleted sale ${saleWithItems.order_number}`
      })

      if (transactionError) throw transactionError
    }

    // 2. Delete semua sale items
    const { error: deleteItemsError } = await supabase
    .from('sale_items')
    .delete()
    .eq('sale_id', saleId)

    if (deleteItemsError) throw deleteItemsError

    // 3. Delete sale record
    const { error: deleteSaleError } = await supabase
    .from('sales')
    .delete()
    .eq('id', saleId)

    if (deleteSaleError) throw deleteSaleError

    return {
      success: true,
      message: `Sale ${saleWithItems.order_number} berhasil dihapus dan stock dikembalikan`
    }
  }

}

export default SaleService;