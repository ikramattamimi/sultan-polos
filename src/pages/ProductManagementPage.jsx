import React, {useEffect, useState} from 'react';
import {Search, X} from 'lucide-react';

// Components
import {ProductCard, ProductManagementHeader, ProductModal, ProductSearch} from '../components/products';
import {EmptyState} from '../components/common';

// Services
import ProductService from '../services/ProductService.js';
import {ProductVariantService} from '../services/ProductVariantService.js';

// Main Component
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showVariants, setShowVariants] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // State untuk tabs dan search
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchFilter, setShowSearchFilter] = useState(false);

  // Function untuk mengelompokkan produk berdasarkan tipe
  const groupProductsByType = (products) => {
    return products.reduce((acc, product) => {
      const typeName = product.types?.name || 'Tanpa Tipe';
      if (!acc[typeName]) {
        acc[typeName] = [];
      }
      acc[typeName].push(product);
      return acc;
    }, {});
  };

  // Function untuk filter produk berdasarkan search query
  const filterProductsBySearch = (products, query) => {
    if (!query.trim()) return products;

    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.categories?.name.toLowerCase().includes(lowercaseQuery) ||
      product.types?.name.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Function untuk mendapatkan produk berdasarkan tab aktif dan search
  const getFilteredProducts = () => {
    let filtered = products;

    // Filter berdasarkan search query terlebih dahulu
    filtered = filterProductsBySearch(filtered, searchQuery);

    // Kemudian filter berdasarkan tab
    if (activeTab === 'all') {
      return filtered;
    }

    const grouped = groupProductsByType(filtered);
    return grouped[activeTab] || [];
  };

  // Function untuk mendapatkan grouped products berdasarkan search
  const getSearchedGroupedProducts = () => {
    const searchFiltered = filterProductsBySearch(products, searchQuery);
    return groupProductsByType(searchFiltered);
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const productsData = await ProductService.getAll(true); // Include variants
      setProducts(productsData || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Gagal memuat data produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchProducts();
    } catch (err) {
      console.error('Error refreshing products:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      setLoading(true);

      // Create product in Supabase
      const newProduct = await ProductService.create({
        name: productData.name,
        category_id: productData.category, // assuming category is the ID
        type_id: productData.type, // assuming type is the ID
        base_price: productData.basePrice,
        description: productData.description,
      });

      // Refresh products list to get updated data
      await fetchProducts();

      // Show success message (you can add toast notification here)
      console.log('Product added successfully:', newProduct);

    } catch (err) {
      console.error('Error adding product:', err);
      setError('Gagal menambahkan produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVariant = async (productId, variantData) => {
    try {
      setLoading(true);
      console.log('Variant data:', variantData);
      // Create variant in Supabase
      const newVariant = await ProductVariantService.create({
        product_id: productId,
        selling_price: variantData.selling_price,
        stock: variantData.stock,
        size_id: variantData.size_id,
        color_id: variantData.color_id,
        convection_id: variantData.convection_id,
        convection_quantity: variantData.convection_quantity,
        convection_json: variantData.convection_json,
        partner: variantData.partner,
      });

      // Refresh products list to get updated data
      await fetchProducts();

      // Show success message (you can add toast notification here)
      console.log('Variant added successfully:', newVariant);

    } catch (err) {
      console.error('Error adding variant:', err);
      setError('Gagal menambahkan varian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (id, productData) => {
    try {
      setLoading(true);

      console.log('Product data:', productData);

      // Update product in Supabase
      await ProductService.update(id, productData);

      // Refresh products list to get updated data
      await fetchProducts();

      // Show success message (you can add toast notification here)
      console.log('Product updated successfully');

    } catch (err) {
      console.error('Error updating product:', err);
      setError('Gagal memperbarui produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (product) => {
    try {
      setLoading(true);
      setSelectedProduct(product);
      setShowEditProduct(true);
    } catch (err) {
      console.error('Error editing product:', err);
      setError('Gagal mengedit produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      return;
    }

    try {
      setLoading(true);
      await ProductService.delete(id);

      // Remove product from local state
      setProducts(products.filter(p => p.id !== id));

      // Show success message
      console.log('Product deleted successfully');

    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Gagal menghapus produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVariant = async (productId, variantId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus varian ini?')) {
      return;
    }

    try {
      setLoading(true);
      await ProductVariantService.delete(variantId);

      // Update local state
      setProducts(products.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            product_variants: (product.product_variants || []).filter(v => v.id !== variantId)
          };
        }
        return product;
      }));

      console.log('Variant deleted successfully');

    } catch (err) {
      console.error('Error deleting variant:', err);
      setError('Gagal menghapus varian. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (variantId, newStock) => {
    try {
      await ProductVariantService.updateStock(variantId, newStock);

      // Update local state
      setProducts(products.map(product => ({
        ...product,
        product_variants: (product.product_variants || []).map(variant =>
          variant.id === variantId
            ? { ...variant, stock: newStock }
            : variant
        )
      })));

      console.log('Stock updated successfully');

    } catch (err) {
      console.error('Error updating stock:', err);
      setError('Gagal mengupdate stok. Silakan coba lagi.');
    }
  };

  const toggleVariants = (productId) => {
    setShowVariants(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const clearError = () => {
    setError(null);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveTab('all');
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  // Get grouped products dan filtered products berdasarkan search
  const searchedGroupedProducts = getSearchedGroupedProducts();
  const filteredProducts = getFilteredProducts();
  const totalSearchResults = filterProductsBySearch(products, searchQuery).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <ProductManagementHeader
          onClickRefresh={handleRefresh}
          disabledRefresh={refreshing}
          onClickAdd={() => setShowAddProduct(true)}
          disabledAdd={loading}
        />

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5"/>
            </button>
          </div>
        )}

        {/* Product Search Component */}
        <ProductSearch
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
          totalResults={totalSearchResults}
          showFilter={true}
          onToggleFilter={() => setShowSearchFilter(!showSearchFilter)}
          className="mb-6"
        />

        {/* Add Product Modal */}
        <ProductModal
          show={showAddProduct}
          onClose={() => setShowAddProduct(false)}
          onAdd={handleAddProduct}
          mode="add"
        />

        <ProductModal
          show={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          onUpdate={handleUpdateProduct}
          productData={selectedProduct}
          mode="edit"
        />

        {/* Products List dengan Tabs */}
        {products.length > 0 ? (
          <div>
            {/* Tabs Navigation */}
            <div className="bg-white rounded-lg shadow-sm mb-6 p-1">
              <div className="flex gap-1 overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`flex-shrink-0 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 relative ${
                    activeTab === 'all'
                      ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    Semua Produk
                    <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold shadow-md border-2 ${
                      activeTab === 'all'
                        ? 'bg-white text-blue-600 border-blue-200 shadow-blue-200/50'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-500/30'
                    }`}>
                      {totalSearchResults}
                    </span>
                  </span>
                </button>

                {Object.entries(searchedGroupedProducts).map(([typeName, typeProducts]) => (
                  <button
                    key={typeName}
                    onClick={() => setActiveTab(typeName)}
                    className={`flex-shrink-0 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 relative ${
                      activeTab === typeName
                        ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {typeName}
                      <span className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold shadow-md border-2 ${
                        activeTab === typeName
                          ? 'bg-white text-blue-600 border-blue-200 shadow-blue-200/50'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-500/30'
                      }`}>
                        {typeProducts.length}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {/* Header untuk tab aktif dengan search info */}
              {(activeTab !== 'all' || searchQuery) && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {activeTab === 'all'
                          ? `Hasil Pencarian "${searchQuery}"`
                          : `Produk Tipe ${activeTab}${searchQuery ? ` - "${searchQuery}"` : ''}`
                        }
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Menampilkan {filteredProducts.length} produk
                        {activeTab !== 'all' ? ` dari tipe ${activeTab}` : ''}
                        {searchQuery ? ` yang cocok dengan pencarian` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-blue-400">
                        {filteredProducts.length} produk
                      </div>
                      {searchQuery && (
                        <button
                          onClick={handleClearSearch}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Bersihkan
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Products Display */}
              {filteredProducts.length > 0 ? (
                <div className="space-y-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDeleteProduct}
                      onToggleVariants={toggleVariants}
                      showVariants={showVariants[product.id]}
                      onAddVariant={handleAddVariant}
                      onDeleteVariant={handleDeleteVariant}
                      onUpdateStock={handleUpdateStock}
                      onUpdateProduct={handleUpdateProduct}
                      onEditProduct={handleEditProduct}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-2" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchQuery
                      ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                      : `Tidak ada produk tipe ${activeTab}`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? 'Coba gunakan kata kunci yang berbeda atau bersihkan pencarian'
                      : `Belum ada produk yang terdaftar untuk tipe ${activeTab}`
                    }
                  </p>
                  <div className="flex justify-center gap-3">
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Bersihkan Pencarian
                      </button>
                    )}
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Tambah Produk Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <EmptyState onAddProduct={() => setShowAddProduct(true)}/>
        )}

        {/* Loading overlay for actions */}
        {loading && products.length > 0 && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
            <div className="bg-white rounded-lg p-6 flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700">Memproses...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagementPage;