// ===========================================
// SALES METHODS
// ===========================================
import {supabase} from "../supabaseClient"
import StockTransactionService from './StockTransactionService.js';

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
            products(name, partner),
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

  // Contoh create (pastikan panggil ini saat menyimpan sale + items)
  async create(saleData, saleItems) {
    // Simpan sale
    const { data: sale, error: saleErr } = await supabase
      .from('sales')
      .insert([saleData])
      .select('*')
      .single();
    if (saleErr) throw saleErr;

    // Simpan items
    const itemsPayload = saleItems.map(it => ({ ...it, sale_id: sale.id }));
    const { data: items, error: itemsErr } = await supabase
      .from('sale_items')
      .insert(itemsPayload)
      .select('*');
    if (itemsErr) throw itemsErr;

    // Kurangi stok varian + catat transaksi SALE (manual)
    for (const it of items) {
      await StockTransactionService.recordProductTransaction(it.variant_id, -it.quantity, 'SALE');
    }

    return { sale, items };
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
    // Ambil sale + items dulu
    const { data: saleWithItems, error: fetchError } = await supabase
      .from('sales')
      .select(`
        *,
        sale_items(*)
      `)
      .eq('id', saleId)
      .single();
    if (fetchError) throw fetchError;
    if (!saleWithItems) throw new Error('Sale tidak ditemukan');

    // Kembalikan stok varian
    for (const it of (saleWithItems.sale_items || [])) {
      await StockTransactionService.recordProductTransaction(it.variant_id, it.quantity, 'SALE_DELETED');
    }

    // Hapus items lalu sale
    const { error: delItemsErr } = await supabase.from('sale_items').delete().eq('sale_id', saleId);
    if (delItemsErr) throw delItemsErr;

    const { error: delSaleErr } = await supabase.from('sales').delete().eq('id', saleId);
    if (delSaleErr) throw delSaleErr;

    return { success: true, message: `Sale ${saleWithItems.order_number} berhasil dihapus` };
  },

  // Delete multiple: sama, tapi bulk
  async deleteMultiple(saleIds = []) {
    if (!Array.isArray(saleIds) || saleIds.length === 0) {
      return { success: false, message: "Tidak ada penjualan yang dipilih" };
    }

    // Ambil semua items dari sales tsb
    const { data: items, error: fetchErr } = await supabase
      .from('sale_items')
      .select('*')
      .in('sale_id', saleIds);
    if (fetchErr) throw fetchErr;

    // Restock semua varian terkait
    for (const it of (items || [])) {
      await StockTransactionService.recordProductTransaction(it.variant_id, it.quantity, 'SALE_DELETED');
    }

    // Hapus items lalu sales
    const { error: delItemsErr } = await supabase.from('sale_items').delete().in('sale_id', saleIds);
    if (delItemsErr) throw delItemsErr;

    const { error: delSalesErr } = await supabase.from('sales').delete().in('id', saleIds);
    if (delSalesErr) throw delSalesErr;

    return { success: true, message: `${saleIds.length} penjualan berhasil dihapus` };
  }

}

export default SaleService;