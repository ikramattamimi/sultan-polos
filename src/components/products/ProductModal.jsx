import React from 'react';
import { Plus, Edit2, Save, X } from 'lucide-react';
import ProductForm from './ProductForm';

const ProductModal = ({
  show,
  onClose,
  onAdd,
  onUpdate,
  productData = null,
  mode = 'add'
}) => {
  const isEditMode = mode === 'edit' && productData;

  const handleSubmit = async (product, isEdit) => {
    if (isEdit) {
      await onUpdate(product.id, {
        name: product.name,
        category_id: parseInt(product.category),
        type_id: parseInt(product.type),
        base_price: parseInt(product.basePrice),
        reference_price: product.referencePrice ? parseInt(product.referencePrice) : null,
        description: product.description,
        partner: product.partner || null
      });
    } else {
      await onAdd({
        name: product.name,
        category: product.category,
        type: parseInt(product.type),
        basePrice: parseInt(product.basePrice),
        referencePrice: product.referencePrice ? parseInt(product.referencePrice) : null,
        description: product.description,
        partner: product.partner || null,
        variants: []
      });
    }
    onClose();
  };

  if (!show) return null;

  const modalTitle = isEditMode ? 'Edit Produk' : 'Tambah Produk Baru';
  const TitleIcon = isEditMode ? Edit2 : Plus;

  return (
    <div className="fixed inset-0 bg-blend-darken bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="flex justify-between items-center mb-4 border-b border-gray-200 px-6 py-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <TitleIcon className="w-5 h-5" />
            {modalTitle}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-6 pb-6">
          <ProductForm
            productData={productData}
            mode={mode}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />

        </div>
      </div>
    </div>
  );
};

export default ProductModal;