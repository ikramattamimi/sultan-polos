// loader.js

import { ProductService, CategoryService, MasterDataService, ConvectionService, ProductVariantService, SaleService, CottonCombedService } from './services/index.js'
// ===========================================
// EXISTING LOADER (keeping your original)
// ===========================================
export const productsLoader = async ({ params }) => {
  try {
    const includeVariants = params?.includeVariants || false
    const products = await ProductService.getAll(includeVariants)
    return { products }
  } catch (error) {
    console.error("Error in productsLoader:", error);
    throw new Response("Failed to load products", { status: 500 })
  }
}

// ===========================================
// DASHBOARD LOADER
// ===========================================
export const dashboardLoader = async () => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const [
      recentSales,
      salesSummary,
      lowStockVariants,
      lowStockConvections,
      totalProducts
    ] = await Promise.all([
      SaleService.getAll(10, 0),
      SaleService.getSalesSummary(thirtyDaysAgo, today),
      ProductVariantService.getLowStock(10),
      ConvectionService.getLowStock(),
      ProductService.getAll(false)
    ])

    return {
      recentSales,
      salesSummary,
      lowStockVariants,
      lowStockConvections,
      totalProducts: totalProducts.length
    }
  } catch (error) {
    console.error("Error in dashboardLoader:", error);
    throw new Response("Failed to load dashboard data", { status: 500 })
  }
}

// ===========================================
// PRODUCT LOADERS
// ===========================================
export const productLoader = async ({ params }) => {
  try {
    const { id } = params
    
    if (!id) {
      throw new Response("Product ID is required", { status: 400 })
    }

    const [product, categories, masterData] = await Promise.all([
      ProductService.getById(id, true),
      CategoryService.getAll(),
      Promise.all([
        MasterDataService.colors.getAll(),
        MasterDataService.sizes.getAll(),
        MasterDataService.types.getAll(),
        MasterDataService.printTypes.getAll()
      ])
    ])

    return { 
      product,
      categories,
      colors: masterData[0],
      sizes: masterData[1],
      types: masterData[2],
      printTypes: masterData[3]
    }
  } catch (error) {
    if (error.code === 'PGRST116') {
      throw new Response("Product not found", { status: 404 })
    }
    throw new Response("Failed to load product", { status: 500 })
  }
}

export const productFormLoader = async ({ params }) => {
  try {
    const { id } = params
    
    const [categories, colors, sizes, types, convections] = await Promise.all([
      CategoryService.getAll(),
      MasterDataService.colors.getAll(),
      MasterDataService.sizes.getAll(),
      MasterDataService.types.getAll(),
      ConvectionService.getAll()
    ])

    let product = null
    
    if (id && id !== 'new') {
      product = await ProductService.getById(id, true)
    }

    return {
      product,
      categories,
      colors,
      sizes,
      types,
      convections
    }
  } catch (error) {
    if (error.code === 'PGRST116' && params.id) {
      throw new Response("Product not found", { status: 404 })
    }
    throw new Response("Failed to load form data", { status: 500 })
  }
}

// Loader untuk router
export const cottonCombodLoader = async () => {
  try {
    const products = await CottonCombedService.getAllCottonCombod30s()
    return { products, typeName: 'Cotton Combod 30s' }
  } catch (error) {
    console.error("Error in cottonCombodLoader:", error);
    throw new Response("Failed to load Cotton Combod 30s products", { status: 500 })
  }
}

// Loader dengan parameter type name
export const productsByTypeLoader = async ({ params }) => {
  try {
    const { typeName } = params
    
    if (!typeName) {
      throw new Response("Type name is required", { status: 400 })
    }

    const products = await ProductService.getByTypeName(typeName)
    return { products, typeName }
  } catch (error) {
    console.error("Error in productsByTypeLoader:", error);
    throw new Response(`Failed to load products for type: ${params.typeName}`, { status: 500 })
  }
}


// ===========================================
// CONVECTION LOADERS
// ===========================================
export const convectionsLoader = async () => {
  try {
    const convections = await ConvectionService.getAll()
    return { convections }
  } catch (error) {
    console.error("Error in convectionsLoader:", error);
    throw new Response("Failed to load convections", { status: 500 })
  }
}

export const convectionLoader = async ({ params }) => {
  try {
    const { id } = params
    
    if (!id) {
      throw new Response("Convection ID is required", { status: 400 })
    }

    const convection = await ConvectionService.getById(id)
    return convection
  } catch (error) {
    if (error.code === 'PGRST116') {
      throw new Response("Convection not found", { status: 404 })
    }
    throw new Response("Failed to load convection", { status: 500 })
  }
}

// ===========================================
// REPORT LOADER
// ===========================================
export const salesReportLoader = async ({ request }) => {
  try {
    const url = new URL(request.url)
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')
    
    const defaultEndDate = new Date().toISOString().split('T')[0]
    const defaultStartDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const actualStartDate = startDate || defaultStartDate
    const actualEndDate = endDate || defaultEndDate

    const [sales, summary] = await Promise.all([
      SaleService.getByDateRange(actualStartDate, actualEndDate),
      SaleService.getSalesSummary(actualStartDate, actualEndDate)
    ])

    return { 
      sales, 
      summary,
      dateRange: { startDate: actualStartDate, endDate: actualEndDate }
    }
  } catch (error) {
    console.error("Error in salesReportLoader:", error);
    throw new Response("Failed to load sales report", { status: 500 })
  }
}

// ===========================================
// MASTER DATA LOADER
// ===========================================
export const masterDataLoader = async () => {
  try {
    const [colors, sizes, types, printTypes, categories] = await Promise.all([
      MasterDataService.colors.getAll(),
      MasterDataService.sizes.getAll(),
      MasterDataService.types.getAll(),
      MasterDataService.printTypes.getAll(),
      CategoryService.getAll()
    ])

    return { 
      colors, 
      sizes, 
      types, 
      printTypes,
      categories
    }
  } catch (error) {
    console.error("Error in masterDataLoader:", error);
    throw new Response("Failed to load master data", { status: 500 })
  }
}

// ===========================================
// LEGACY LOADERS (for backward compatibility)
// ===========================================
export const convectionDetailLoader = convectionLoader
export const inventoryDetailLoader = productLoader
export const inventoryLoader = productsLoader