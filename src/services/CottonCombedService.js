import { supabase } from "../supabaseClient"
import ProductService from "./ProductService.js"

export const CottonCombedService = {
  // Ambil semua produk Cotton Combod 30s
  async getAllCottonCombod30s() {
    return await ProductService.getByTypeName('Cotton Combod 30s')
  },

  // Ambil product variants Cotton Combod 30s dengan stock info
  async getCottonCombod30sWithStock() {
    // Jika type_id ada di product_variants
    const { data: variantsData, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products(id, name, price),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name, stock, buffer_stock),
        types(id, name)
      `)
      .eq('types.name', 'Cotton Combod 30s')
      .order('products.name', { ascending: true })
    
    if (!variantsError && variantsData.length > 0) {
      return variantsData
    }

    // Fallback: jika type_id ada di products
    const { data: productsData, error: productsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products!inner(id, name, price, types!inner(id, name)),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name, stock, buffer_stock)
      `)
      .eq('products.types.name', 'Cotton Combod 30s')
      .order('products.name', { ascending: true })
    
    if (productsError) throw productsError
    return productsData
  },

  // Ambil hanya yang stocknya masih ada
  async getAvailableCottonCombod30s() {
    // Try with variant type first
    const { data: variantsData, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products(id, name, price),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name, stock, buffer_stock),
        types(id, name)
      `)
      .eq('types.name', 'Cotton Combod 30s')
      .gt('stock', 0)
      .order('products.name', { ascending: true })
    
    if (!variantsError && variantsData.length > 0) {
      return variantsData
    }

    // Fallback: try with product type
    const { data: productsData, error: productsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        products!inner(id, name, price, types!inner(id, name)),
        sizes(id, name),
        colors(id, name, hex_code),
        convections(id, name, stock, buffer_stock)
      `)
      .eq('products.types.name', 'Cotton Combod 30s')
      .gt('stock', 0)
      .order('products.name', { ascending: true })
    
    if (productsError) throw productsError
    return productsData
  }
}

export default CottonCombedService;