
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Save, X } from 'lucide-react';
import MasterDataService from '../../services/MasterDataService.js';
import { Input, Select, NumberInput, TextArea } from '../ui/forms';
import { UtilityService } from '../../services/UtilityServices.js';

// Unified Product Modal - handles both Add and Edit
const ProductModal = ({
                        show,
                        onClose,
                        onAdd,
                        onUpdate,
                        productData = null,
                        mode = 'add' // 'add' or 'edit'
                      }) => {
  const [product, setProduct] = useState({
    id: '',
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isEditMode = mode === 'edit' && productData;

  const getSelectedCategory = (id) => {
    return categories.find(cat => cat.id.toString() === id.toString())
  }

  // Reset or populate form data when modal opens or productData changes
  useEffect(() => {
    if (show) {
      if (isEditMode) {
        // Populate form with existing product data for edit mode
        setProduct({
          id: productData.id || '',
          name: productData.name || '',
          category: productData.category_id || '',
          type: productData.type_id || '',
          basePrice: productData.base_price?.toString() || '',
          description: productData.description || ''
        });
      } else {
        // Reset form for add mode
        setProduct({
          id: '',
          name: '',
          category: '',
          type: '',
          basePrice: '',
          description: ''
        });
      }
      fetchCategoriesAndTypes();
    }
  }, [show, productData, isEditMode]);

  const fetchCategoriesAndTypes = async () => {
    setLoading(true);
    setError(null);

    try {
      const [categoriesData, typesData] = await Promise.all([
        MasterDataService.categories.getAll(),
        MasterDataService.types.getAll()
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

        if (isEditMode) {
          // Update existing product
          await onUpdate(product.id, {
            name: product.name,
            category_id: parseInt(product.category),
            type_id: parseInt(product.type),
            base_price: parseInt(product.basePrice),
            description: product.description
          });
        } else {
          // Create new product
          await onAdd({
            name: product.name,
            category: product.category,
            type: product.type,
            basePrice: parseInt(product.basePrice),
            description: product.description,
            variants: []
          });
        }

        handleClose();
      } catch (err) {
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} product:`, err);
        setError(`Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} produk. Silakan coba lagi.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    if (!isEditMode) {
      setProduct({
        id: '',
        name: '',
        category: '',
        type: '',
        basePrice: '',
        description: ''
      });
    }
    setError(null);
    onClose();
  };

  if (!show) return null;

  const modalTitle = isEditMode ? 'Edit Produk' : 'Tambah Produk Baru';
  const submitButtonText = isEditMode ? 'Update' : 'Simpan';
  const TitleIcon = isEditMode ? Edit2 : Plus;

  return (
    <div className="fixed inset-0 bg-blend-darken bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TitleIcon className="w-5 h-5" />
            {modalTitle}
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
          <Input
            type="text"
            placeholder="Kaos Anak"
            value={product.name}
            onChange={(e) => setProduct({...product, name: e.target.value})}
            disabled={loading}
            label="Nama Produk"
          />

          <Select
            value={product.category}
            onChange={(e) => {
              setProduct({...product, category: e.target.value})
              setSelectedCategory(() => getSelectedCategory(e.target.value))
            }}
            disabled={loading}
            options={categories}
            valueKey="id"
            labelKey="name"
            placeholder="Pilih Kategori"
            label="Kategori Bahan"
          />

          { selectedCategory && selectedCategory.is_type_needed &&
            <Select
              value={product.type}
              onChange={(e) => setProduct({...product, type: e.target.value})}
              disabled={loading}
              options={types}
              valueKey="id"
              labelKey="name"
              placeholder="Pilih Tipe"
              label="Tipe Bahan"
            />
          }

          <Input
            type="text"
            placeholder="Harga Dasar"
            value={UtilityService.formatNumber(product.basePrice)}
            onChange={(e) => UtilityService.handlePriceInputChange(e, (value) => setProduct({...product, basePrice: value}))}
            disabled={loading}
            label="Harga Dasar"
          />

          <TextArea
            placeholder="Pakaian tebal"
            value={product.description}
            onChange={(e) => setProduct({...product, description: e.target.value})}
            rows="3"
            disabled={loading}
            label="Deskripsi Produk"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !product.name || !product.category || !product.type || !product.basePrice}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  {isEditMode ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  {submitButtonText}
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

// Export dengan nama yang backward-compatible
export default ProductModal;