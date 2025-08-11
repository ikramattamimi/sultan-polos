import React, { useState, useEffect } from 'react';
import { Input, Select, TextArea } from '../ui/forms';
import { UtilityService } from '../../services/UtilityServices.js';
import MasterDataService from '../../services/MasterDataService.js';
import ProductService from '../../services/ProductService.js';

const ProductForm = ({
  productData = null,
  mode = 'add',
  onSubmit,
  onCancel,
  loading: externalLoading = false,
}) => {
  const [product, setProduct] = useState({
    id: '',
    name: '',
    category: '',
    type: null,
    basePrice: '',
    referencePrice: '',
    description: '',
    partner: ''
  });

  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showCustomPartner, setShowCustomPartner] = useState(false);
  const [customPartnerValue, setCustomPartnerValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const isEditMode = mode === 'edit' && productData;

  const getSelectedCategory = (id) => {
    return categories.find(cat => cat.id.toString() === id.toString())
  }

  useEffect(() => {
    if (isEditMode) {
      setProduct({
        id: productData.id || '',
        name: productData.name || '',
        category: productData.category_id || '',
        type: productData.type_id || '',
        basePrice: productData.base_price?.toString() || '',
        referencePrice: productData.reference_price?.toString() || '',
        description: productData.description || '',
        partner: productData.partner || ''
      });
      if (productData.partner && partners.length && !partners.includes(productData.partner)) {
        setShowCustomPartner(true);
        setCustomPartnerValue(productData.partner);
      }
    } else {
      setProduct({
        id: '',
        name: '',
        category: '',
        type: '',
        basePrice: '',
        referencePrice: '',
        description: '',
        partner: ''
      });
      setShowCustomPartner(false);
      setCustomPartnerValue('');
    }
    fetchCategoriesAndTypes();
    fetchPartners();
    // eslint-disable-next-line
  }, [productData, isEditMode]);

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
      setError('Gagal memuat data kategori dan tipe. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const partnersData = await ProductService.getUniquePartners();
      // if (partnersData && !partnersData.includes('Tambah Mitra Baru')) partnersData.push('Tambah Mitra Baru');
      setPartners(partnersData || []);
    } catch (err) {
      // setPartners(['Tambah Mitra Baru']);
    }
  };

  const handlePartnerChange = (e) => {
    const value = e.target.value;
    if (value === 'Tambah Mitra Baru') {
      setShowCustomPartner(true);
      setProduct(prev => ({ ...prev, partner: '' }));
    } else {
      setShowCustomPartner(false);
      setCustomPartnerValue('');
      setProduct(prev => ({ ...prev, partner: value }));
    }
  };

  const handleCustomPartnerChange = (e) => {
    const value = e.target.value;
    setCustomPartnerValue(value);
    setProduct(prev => ({ ...prev, partner: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(product, isEditMode);
    } catch (err) {
      setError('Gagal menyimpan produk. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      {error && (
        <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

        <Input
          type="text"
          placeholder="Nama Produk"
          value={product.name}
          onChange={(e) => setProduct({...product, name: e.target.value})}
          disabled={loading || externalLoading}
          label="Nama"
          required
        />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        <Select
            value={product.category}
            onChange={(e) => {
              setProduct({...product, category: e.target.value})
              setSelectedCategory(() => getSelectedCategory(e.target.value))
            }}
            disabled={loading || externalLoading}
            options={categories}
            valueKey="id"
            labelKey="name"
            placeholder="Kategori"
            label="Kategori"
            required
            className="flex-1"
          />

          <Select
            value={product.type}
            onChange={(e) => setProduct({...product, type: e.target.value})}
            disabled={
              loading ||
              externalLoading ||
              !(selectedCategory && selectedCategory.is_type_needed)
            }
            options={types}
            valueKey="id"
            labelKey="name"
            placeholder="Tipe"
            label="Tipe"
            required={selectedCategory && selectedCategory.is_type_needed}
            className="flex-1"
          />

        <Input
          type="text"
          placeholder="20.000"
          value={UtilityService.formatNumber(product.basePrice)}
          onChange={(e) => UtilityService.handlePriceInputChange(e, (value) => setProduct({...product, basePrice: value}))}
          disabled={loading || externalLoading}
          label="HPP"
          leftIcon="Rp"
          leftIconClassName='pl-3'
          required
        />

        <Input
          type="text"
          placeholder="24.000"
          value={UtilityService.formatNumber(product.referencePrice)}
          onChange={(e) => UtilityService.handlePriceInputChange(e, (value) => setProduct({...product, referencePrice: value}))}
          disabled={loading || externalLoading}
          label="Acuan"
          leftIcon="Rp"
          leftIconClassName='pl-3'
          required
        />
      </div>

      <TextArea
        placeholder="Deskripsi produk"
        value={product.description}
        onChange={(e) => setProduct({...product, description: e.target.value})}
        rows="2"
        disabled={loading || externalLoading}
        label="Deskripsi"
      />

      {/* Mitra Selection */}
      <Input
        label="Nama Mitra"
        value={product.partner}
        onChange={handlePartnerChange}
        // disabled={submitting}
        placeholder="Masukkan nama mitra"
        list="partner-list"
      />
      <datalist id="partner-list">
        {partners.map((c, idx) => (
          <option key={idx} value={c} />
        ))}
      </datalist>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Select
          id="partner"
          name="partner"
          label="Mitra"
          value={showCustomPartner ? 'Tambah Mitra Baru' : product.partner}
          onChange={handlePartnerChange}
          placeholder="Pilih Mitra"
          options={partners}
        />
        {showCustomPartner && (
          <div>
            <Input
              id="customPartner"
              name="customPartner"
              label="Mitra Baru"
              type="text"
              value={customPartnerValue}
              onChange={handleCustomPartnerChange}
              placeholder="Masukkan nama mitra baru"
            />
          </div>
        )}
      </div> */}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={loading || externalLoading || !product.name || !product.category || (selectedCategory?.is_type_needed && !product.type) || !product.basePrice || !product.referencePrice}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm"
        >
          {loading || externalLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            isEditMode ? 'Update' : 'Simpan'
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading || externalLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed text-gray-700 py-2 rounded transition-colors text-sm"
        >
          Batal
        </button>
      </div>
    </form>
  );
};

export default ProductForm;