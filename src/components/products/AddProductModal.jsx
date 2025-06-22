import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Package } from 'lucide-react';
import categoryService from '../../services/categoryService.js';
import typeService from '../../services/typeService.js';
import masterDataService from '../../services/masterDataService.js';

// Component untuk Modal Tambah Produk
const AddProductModal = ({ show, onClose, onAdd }) => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    type: '',
    basePrice: '',
    description: ''
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch categories and types when modal opens
  useEffect(() => {
    if (show) {
      fetchCategoriesAndTypes();
    }
  }, [show]);

  const fetchCategoriesAndTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch categories and types in parallel
      const [categoriesData, typesData] = await Promise.all([
        masterDataService.categories.getAll(),
        masterDataService.types.getAll() // You'll need to create this service similar to categoryService
      ]);
      
      setCategories(categoriesData || []);
      setTypes(typesData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Gagal memuat data kategori dan tipe. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (product.name && product.category && product.type && product.basePrice) {
      try {
        setLoading(true);
        await onAdd({
          ...product,
          basePrice: parseInt(product.basePrice),
          variants: []
        });
        setProduct({ name: '', category: '', type: '', basePrice: '', description: '' });
        onClose();
      } catch (err) {
        console.error('Error adding product:', err);
        setError('Gagal menambahkan produk. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setProduct({ name: '', category: '', type: '', basePrice: '', description: '' });
    setError(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-blend-darken bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tambah Produk Baru</h2>
          <button 
            onClick={handleClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nama Produk"
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <select
            value={product.category}
            onChange={(e) => setProduct({...product, category: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Memuat kategori...' : 'Pilih Kategori'}
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={product.type}
            onChange={(e) => setProduct({...product, type: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Memuat tipe...' : 'Pilih Tipe'}
            </option>
            {types.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Harga Dasar"
            value={product.basePrice}
            onChange={(e) => setProduct({...product, basePrice: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <textarea
            placeholder="Deskripsi Produk"
            value={product.description}
            onChange={(e) => setProduct({...product, description: e.target.value})}
            rows="3"
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !product.name || !product.category || !product.type || !product.basePrice}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Simpan'
              )}
            </button>
            <button
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 py-3 rounded-lg transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;