import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { VariantSection } from './index';

// Component untuk Card Produk
const ProductCard = ({
  product,
  onDelete,
  onToggleVariants,
  showVariants,
  onAddVariant,
  onDeleteVariant,
  // onUpdateProduct,
  onEditProduct
}) => {

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Product Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{product.categories?.name}</span>
              {product.types && <span>• {product.types?.name}</span>}
            </div>
            <p className="text-lg font-medium text-green-600 mt-2">
              Rp {product.base_price.toLocaleString('id-ID')}
            </p>
            {product.description && (
              <p className="text-gray-700 mt-2">{product.description}</p>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onToggleVariants(product.id)}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              {showVariants ? 'Sembunyikan' : 'Lihat'} Varian ({product.product_variants.length})
            </button>
            <button
              onClick={() => onEditProduct(product)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <VariantSection
        product={product}
        show={showVariants}
        onAddVariant={onAddVariant}
        onDeleteVariant={onDeleteVariant}
      />

    </div>
  );
};

export default ProductCard;