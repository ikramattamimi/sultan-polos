import { Package, Plus, Search } from "lucide-react";
import UtilityService from "../../../services/UtilityServices.js";

// ProductSelector Component
const ProductSelector = ({ 
  products, 
  searchQuery, 
  setSearchQuery, 
  onProductSelect, 
  onAddProductClick,
  submitting 
}) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categories?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.types?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Package className="mr-2 text-green-600" />
        Pilih Produk
      </h2>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cari produk..."
          disabled={submitting}
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductSelect(product)}
            disabled={submitting}
          />
        ))}
        
        {filteredProducts.length === 0 && (
          <EmptyProductList />
        )}
      </div>

      <button
        onClick={onAddProductClick}
        disabled={submitting}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Produk ke Keranjang
      </button>
    </div>
  );
};



// EmptyProductList Component
const EmptyProductList = () => (
  <div className="text-center py-8 text-gray-500">
    <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
    <p>Tidak ada produk ditemukan</p>
    <p className="text-sm">Coba sesuaikan kata kunci pencarian</p>
  </div>
);


// ProductCard Component
const ProductCard = ({ product, onClick, disabled }) => (
  <div
    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors"
    onClick={() => !disabled && onClick()}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {product.categories?.name} • {product.types?.name}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {product.product_variants?.length || 0} varian tersedia
        </p>
      </div>
      <span className="text-lg font-semibold text-green-600">
        {UtilityService.formatCurrency(product.base_price || 0)}
      </span>
    </div>
  </div>
);


export default ProductSelector;