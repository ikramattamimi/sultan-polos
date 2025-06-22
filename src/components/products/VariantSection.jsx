import React from 'react';
import VariantList from './VariantList.jsx';

// Component untuk Section Varian
const VariantSection = ({ product, show, onAddVariant, onDeleteVariant }) => {
  if (!show) return null;

  return (
    <div className="p-6 bg-gray-50">
      <h4 className="text-lg font-medium text-gray-900 mb-4">Varian Produk</h4>
      
      <VariantList
        productId={product.id}
        variants={product.product_variants} 
        onDelete={(variantId) => onDeleteVariant(product.id, variantId)} 
        onAdd={onAddVariant}
      />
    </div>
  );
};

export default VariantSection;