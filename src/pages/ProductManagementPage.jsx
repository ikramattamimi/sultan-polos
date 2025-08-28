import React, {useEffect, useState} from 'react';
import {Search, X} from 'lucide-react';

// Components
import {ProductCard, ProductManagementHeader, ProductModal, ProductSearch, ProductTabs, PartnerFilter} from '../components/products/index.js';
import {EmptyState} from '../components/common/index.js';

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
  const [partnerFilter, setPartnerFilter] = useState('all'); // all | with | without

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

  const hasPartner = (p) => Boolean(p?.partner && String(p.partner).trim().length > 0);

  const applyPartnerFilter = (list) => {
    if (partnerFilter === 'with') return list.filter(hasPartner);
    if (partnerFilter === 'without') return list.filter(p => !hasPartner(p));
    return list;
  };

  // Function untuk mendapatkan produk berdasarkan tab aktif dan search
  const getFilteredProducts = () => {
    let filtered = products;

    // search
    filtered = filterProductsBySearch(filtered, searchQuery);

    // partner filter
    filtered = applyPartnerFilter(filtered);

    // tab by type
    if (activeTab === 'all') return filtered;

    const grouped = groupProductsByType(filtered);
    return grouped[activeTab] || [];
  };

  // Function untuk mendapatkan grouped products berdasarkan search (+ partner filter)
  const getSearchedGroupedProducts = () => {
    let list = filterProductsBySearch(products, searchQuery);
    list = applyPartnerFilter(list);
    return groupProductsByType(list);
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
      await ProductService.create({
        name: productData.name,
        category_id: productData.category,
        type_id: productData.type,
        base_price: productData.basePrice,
        reference_price: productData.referencePrice,
        description: productData.description,
        partner: productData.partner || null,
      });

      // Refresh products list to get updated data
      await fetchProducts();

      // Show success message (you can add toast notification here)
      alert('Produk berhasil ditambahkan!');

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
      // Create variant in Supabase
      await ProductVariantService.create({
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
      alert('Varian berhasil ditambahkan!');

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

      // Update product in Supabase
      await ProductService.update(id, productData);

      // Refresh products list to get updated data
      await fetchProducts();

      // Show success message (you can add toast notification here)
      alert('Produk berhasil diperbarui!');

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
      alert('Produk berhasil dihapus!');

    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Gagal menghapus produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVariant = async (variantId, variantData) => {
  try {
    setLoading(true);
    await ProductVariantService.update(variantId, variantData);
    await fetchProducts();
    alert('Varian berhasil diperbarui!');
  } catch (err) {
    setError('Gagal memperbarui varian. Silakan coba lagi.');
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

      alert('Varian berhasil dihapus!');

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

      alert('Stok berhasil diperbarui!');

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  // Get grouped products dan filtered products berdasarkan search
  const searchedGroupedProducts = getSearchedGroupedProducts();
  const filteredProducts = getFilteredProducts();
  const totalSearchResults = filterProductsBySearch(products, searchQuery).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ProductManagementHeader
          onClickRefresh={handleRefresh}
          disabledRefresh={refreshing}
          onClickAdd={() => setShowAddProduct(true)}
          disabledAdd={loading}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-lg mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <span className="text-sm sm:text-base break-words">{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 self-end sm:self-auto"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5"/>
            </button>
          </div>
        )}

        {/* Search + Partner dropdown - Mobile optimized */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3">
          <ProductSearch
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            totalResults={totalSearchResults}
            onToggleFilter={() => setShowSearchFilter(!showSearchFilter)}
            className="w-full"
          />
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <PartnerFilter
              value={partnerFilter}
              onChange={setPartnerFilter}
            />
          </div>
        </div>

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
            {/* Tabs dipindahkan ke component ProductTabs */}
            <ProductTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              groupedProducts={searchedGroupedProducts}
              totalSearchResults={totalSearchResults}
              filteredCount={filteredProducts.length}
              searchQuery={searchQuery}
              onClearSearch={handleClearSearch}
            />

            {/* Products Display */}
            <div className="transition-all duration-300">
              {filteredProducts.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onDelete={handleDeleteProduct}
                      onToggleVariants={toggleVariants}
                      showVariants={showVariants[product.id]}
                      onAddVariant={handleAddVariant}
                      onUpdateVariant={handleUpdateVariant}
                      onDeleteVariant={handleDeleteVariant}
                      onUpdateStock={handleUpdateStock}
                      onUpdateProduct={handleUpdateProduct}
                      onEditProduct={handleEditProduct}
                      loading={loading}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12 bg-white rounded-lg shadow-sm mx-2 sm:mx-0">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2" />
                  </div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 px-4">
                    {searchQuery
                      ? `Tidak ada produk yang cocok dengan "${searchQuery}"`
                      : `Tidak ada produk tipe ${activeTab}`
                    }
                  </h3>
                  <p className="text-gray-600 mb-6 text-sm sm:text-base px-4">
                    {searchQuery
                      ? 'Coba gunakan kata kunci yang berbeda atau bersihkan pencarian'
                      : `Belum ada produk yang terdaftar untuk tipe ${activeTab}`
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 px-4">
                    {searchQuery && (
                      <button
                        onClick={handleClearSearch}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Bersihkan Pencarian
                      </button>
                    )}
                    <button
                      onClick={() => setShowAddProduct(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors text-sm sm:text-base"
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

        {/* Loading overlay for actions - Mobile optimized */}
        {loading && products.length > 0 && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 flex items-center gap-3 max-w-xs w-full">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 text-sm sm:text-base">Memproses...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagementPage;