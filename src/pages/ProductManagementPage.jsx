import React, { useState, useEffect } from 'react';
import { Plus, X, Package, RefreshCw } from 'lucide-react';

// Components
import { ProductCard, AddProductModal, EditProductModal } from '../components/products';
import { EmptyState } from '../components/common';

// Services
import productService from '../services/productService';
import { productVariantService } from '../services/productVariantService';

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

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await productService.getAll(true); // Include variants
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
      const newProduct = await productService.create({
        name: productData.name,
        category_id: productData.category, // assuming category is the ID
        type_id: productData.type, // assuming type is the ID
        base_price: productData.basePrice,
        description: productData.description
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
      const newVariant = await productVariantService.create({
        product_id: productId,
        selling_price: variantData.selling_price,
        stock: variantData.stock,
        size_id: variantData.size_id,
        color_id: variantData.color_id,
        convection_id: variantData.convection_id,
        convection_quantity: variantData.convection_quantity,
        convection_json: variantData.convection_json
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
      await productService.update(id, productData);
      
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
      await productService.delete(id);
      
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
      await productVariantService.delete(variantId);
      
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
      await productVariantService.updateStock(variantId, newStock);
      
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

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-600" />
                Manajemen Produk
              </h1>
              <p className="text-gray-600 mt-2">Kelola produk dan varian dengan mudah</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={() => setShowAddProduct(true)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Tambah Produk
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Add Product Modal */}
        <AddProductModal
          show={showAddProduct}
          onClose={() => setShowAddProduct(false)}
          onAdd={handleAddProduct}
        />
        
        <EditProductModal
          show={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          onUpdate={handleUpdateProduct}
          productData={selectedProduct}
        />

        {/* Products List */}
        {products.length > 0 ? (
          <div className="space-y-6">
            {products.map((product) => (
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
          <EmptyState onAddProduct={() => setShowAddProduct(true)} />
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