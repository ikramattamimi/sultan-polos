import React from 'react';
import {X, Package} from 'lucide-react';
import {VariantForm} from './index.js';

// Modal Component untuk Add Variant
const AddVariantModal = ({ isOpen, onClose, productId, onVariantAdded }) => {
  if (!isOpen) return null;

  const handleVariantAdd = async (productId, variantData) => {
    try {
      // Call your API to add variant here
      // const result = await yourApiService.addVariant(productId, variantData);
      
      // Notify parent component
      if (onVariantAdded) {
        onVariantAdded(productId, variantData);
      }
      
      // Close modal on success
      onClose();
    } catch (error) {
      console.error('Error adding variant:', error);
      throw error; // Let the form handle the error
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Tambah Varian Produk
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <VariantForm
            productId={productId} 
            onAdd={handleVariantAdd}
          />
        </div>

        {/* Modal Footer */}
        {/* <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
          <p className="text-sm text-gray-500 self-center">
            Isi form di atas untuk menambah varian
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default AddVariantModal;