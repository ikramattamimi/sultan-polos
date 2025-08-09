
// ===========================================
// PRODUCTS METHODS

import { supabase } from "../supabaseClient"

// ===========================================
export const ProductService = {
  // Get all products with category info
  async getAll(includeVariants = false) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(name),
        types(name)
      `)
      .order('name', { ascending: true })

    if (includeVariants) {
      query = supabase
        .from('products')
        .select(`
          *,
          categories(name),
          types(name),
          product_variants(
            *,
            sizes(id, name),
            colors(id, name, hex_code),
            convections(id, name)
          )
        `)
        .order('name', { ascending: true })
    }

    
    let { data, error } = await query
    if (includeVariants && data) {
      data = data.map(product => ({
        ...product,
        product_variants: product.product_variants?.sort((a, b) => {
          // Sort berdasarkan nama color
          const colorA = a.colors?.name || ''
          const colorB = b.colors?.name || ''
          return colorA.localeCompare(colorB)
          
          // Atau sort berdasarkan color_id:
          // return a.color_id - b.color_id
        })
      }))
    }
    if (error) throw error
    return data
  },
  
  // Get unique partners from product_variants
  async getUniquePartners() {
    const { data, error } = await supabase
    .from('products')
    .select('partner')
    .not('partner', 'is', null)
    .not('partner', 'eq', '')

    if (error) throw error

    // Extract unique partners
    const uniquePartners = [...new Set(data.map(item => item.partner))].filter(Boolean)
    return uniquePartners.sort()
  },

  // Get product by ID
  async getById(id, includeVariants = true) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(id, name)
      `)
      .eq('id', id)

    if (includeVariants) {
      query = supabase
        .from('products')
        .select(`
          *,
          categories(id, name),
          product_variants(
            *,
            sizes(id, name),
            colors(id, name, hex_code),
            convections(id, name),
            images(*)
          ),
          images(*)
        `)
        .eq('id', id)
    }

    const { data, error } = await query.single()
    if (error) throw error
    return data
  },

  // Create new product
  async create(productData) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select(`
        *,
        categories(id, name)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Update product
  async update(id, productData) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select(`
        *,
        categories(name)
      `)
      .single()
    
    if (error) throw error
    return data
  },

  // Delete product
  async delete(id) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  },

  // Alternative method dengan filter yang lebih eksplisit
  async getProductsByType(typeName) {
    // Pertama, ambil type_id berdasarkan nama
    const { data: typeData, error: typeError } = await supabase
      .from('types')
      .select('id')
      .eq('name', typeName)
      .single()
    
    if (typeError) throw typeError
    if (!typeData) return []

    // Kemudian ambil convection_ids yang menggunakan type tersebut
    const { data: convectionData, error: convectionError } = await supabase
      .from('convections')
      .select('id')
      .eq('type_id', typeData.id)
    
    if (convectionError) throw convectionError
    if (!convectionData.length) return []

    const convectionIds = convectionData.map(c => c.id)

    // Terakhir, ambil products yang menggunakan convections tersebut
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name),
        product_variants!inner(
          *,
          sizes(id, name),
          colors(id, name, hex_code),
          convections(
            id, 
            name,
            types(id, name),
            categories(id, name),
            colors(id, name, hex_code)
          )
        )
      `)
      .in('product_variants.convection_id', convectionIds)
      .order('name', { ascending: true })
    
    if (productsError) throw productsError
    return products
  },

  // Method yang lebih fleksibel untuk multiple filters
  async getProductsWithFilters({ typeName, categoryName, colorName, sizeName }) {
    let query = supabase
      .from('products')
      .select(`
        *,
        categories(id, name),
        types(id, name),
        product_variants(
          *,
          sizes(id, name),
          colors(id, name, hex_code),
          convections(id, name, stock, buffer_stock)
        )
      `)

    // Apply filters
    if (typeName) {
      query = query.eq('types.name', typeName)
    }
    
    if (categoryName) {
      query = query.eq('categories.name', categoryName)
    }
    
    if (colorName) {
      query = query.eq('product_variants.colors.name', colorName)
    }
    
    if (sizeName) {
      query = query.eq('product_variants.sizes.name', sizeName)
    }

    const { data, error } = await query.order('name', { ascending: true })
    
    if (error) throw error
    return data
  }
}

export default ProductService;