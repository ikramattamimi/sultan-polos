import React from 'react';
import VariantList from './VariantList.jsx';

// Component untuk Section Varian
const VariantSection = ({ product, show, onAddVariant, onDeleteVariant, onUpdateVariant }) => {
  if (!show) return null;

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50">
      <h4 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 mb-2 sm:mb-3 lg:mb-4">
        Varian Produk
      </h4>
      
      {/* Container dengan scroll horizontal untuk mobile jika diperlukan */}
      <div className="w-full">
        <VariantList
          productId={product.id}
          variants={product.product_variants} 
          onDelete={(variantId) => onDeleteVariant(product.id, variantId)} 
          onAdd={onAddVariant}
          onUpdate={onUpdateVariant}
        />
      </div>
    </div>
  );
};

export default VariantSection;