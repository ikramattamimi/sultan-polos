import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import masterDataService from '../../services/masterDataService.js';

// Component untuk Modal Edit Produk
const EditProductModal = ({ show, onClose, onUpdate, productData }) => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    category_id: '',
    type_id: '',
    base_price: '',
    description: ''
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load product data when modal opens or productData changes
  useEffect(() => {
    if (show && productData) {
      setProduct({
        id: productData.id || '',
        name: productData.name || '',
        category_id: productData.category_id || null,
        type_id: productData.type_id || null,
        base_price: productData.base_price?.toString() || '',
        description: productData.description || ''
      });
      fetchCategoriesAndTypes();
    }

    console.log(product)
  }, [show, productData]);

  const fetchCategoriesAndTypes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch categories and types in parallel
      const [categoriesData, typesData] = await Promise.all([
        masterDataService.categories.getAll(),
        masterDataService.types.getAll()
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
    if (product.name && product.category_id && product.type_id && product.base_price) {
      try {
        setLoading(true);
        await onUpdate(product.id, {
          ...product,
          category_id: parseInt(product.category_id),
          type_id: parseInt(product.type_id),
          base_price: parseInt(product.base_price)
        });
      } catch (err) {
        console.error('Error updating product:', err);
        setError('Gagal mengupdate produk. Silakan coba lagi.');
      } finally {
        onClose();
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-blend-darken bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Edit Produk
          </h2>
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
            value={product.category_id}
            onChange={(e) => setProduct({...product, category_id: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Memuat kategori...' : 'Pilih Kategori'}
            </option>
            {categories.map(category => (
              <option key={category.id} value={category.id} selected={category.id === product.category_id}>
                {category.name}
              </option>
            ))}
          </select>
          
          <select
            value={product.type_id}
            onChange={(e) => setProduct({...product, type_id: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Memuat tipe...' : 'Pilih Tipe'}
            </option>
            {types.map(type => (
              <option key={type.id} value={type.id} selected={type.id === product.type_id}>
                {type.name}
              </option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Harga Dasar"
            value={product.base_price}
            onChange={(e) => setProduct({...product, base_price: e.target.value})}
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
              disabled={loading || !product.name || !product.category_id || !product.type_id || !product.base_price}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Update
                </>
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

export default EditProductModal;