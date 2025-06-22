import React from 'react';
import { Plus, Package } from 'lucide-react';

// Component untuk Empty State
const EmptyState = ({ onAddProduct }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Belum ada produk</h3>
      <p className="text-gray-600 mb-6">Mulai dengan menambahkan produk pertama Anda</p>
      <button
        onClick={onAddProduct}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Tambah Produk Pertama
      </button>
    </div>
  );
};

export default EmptyState;