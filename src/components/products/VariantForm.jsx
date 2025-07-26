import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import MasterDataService from '../../services/MasterDataService.js';
import {Input, Select, NumberInput, FormGroup, FormLabel} from '../ui/forms';
import { UtilityService } from '../../services/UtilityServices.js';
import {ProductVariantService} from "../../services/index.js";

// Component untuk Form Tambah/Edit Varian (Updated)
const VariantForm = ({
                       productId,
                       onAdd,
                       onUpdate,
                       variant = null,
                       mode = 'add' // 'add' or 'edit'
                     }) => {
  const [formData, setFormData] = useState({
    color_id: '',
    size_id: '',
    convection_id: '',
    selling_price: '',
    stock: '',
    convection_qty: '',
    partner: ''
  });

  const [convectionMode, setConvectionMode] = useState('existing'); // 'existing' or 'custom'
  const [customConvection, setCustomConvection] = useState({
    material_name: '',
    material_type: '',
    material_category: '',
    color: '',
    unit: '',
    purchase_price: '',
    quantity: ''
  });

  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [convections, setConvections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [partners, setPartners] = useState([]);
  const [showCustomPartner, setShowCustomPartner] = useState(true);
  const [customPartnerValue, setCustomPartnerValue] = useState('');

  // State for max convection quantity
  const [maxConvectionQty, setMaxConvectionQty] = useState(null);


  const isEditMode = mode === 'edit' && variant;

  // Fetch colors, sizes, and convections when component mounts
  useEffect(() => {
    fetchFormData();
  }, []);

  // Populate form data when variant changes (for edit mode)
  useEffect(() => {
    if (isEditMode && variant) {
      populateFormData();
    } else if (!isEditMode) {
      resetForm();
    }
  }, [variant, mode]);

  const populateFormData = () => {
    setFormData({
      color_id: variant.color_id?.toString() || '',
      size_id: variant.size_id?.toString() || '',
      convection_id: variant.convection_id?.toString() || '',
      selling_price: variant.selling_price?.toString() || '',
      stock: variant.stock?.toString() || '',
      convection_qty: variant.convection_quantity?.toString() || '',
      partner: variant.partner || ''
    });

    // Check if variant partner is new
    if (variant.partner && !partners.includes(variant.partner)) {
      setShowCustomPartner(true);
      setCustomPartnerValue(variant.partner);
    }

    // Check if variant has custom convection
    if (variant.convection_json) {
      setConvectionMode('custom');
      setCustomConvection({
        material_name: variant.convection_json.material_name || '',
        material_type: variant.convection_json.material_type || '',
        material_category: variant.convection_json.material_category || '',
        color: variant.convection_json.color || '',
        unit: variant.convection_json.unit || '',
        purchase_price: variant.convection_json.purchase_price?.toString() || '',
        quantity: variant.convection_json.quantity?.toString() || ''
      });
    } else {
      setConvectionMode('existing');
    }
  };

  const resetForm = () => {
    setFormData({
      color_id: '',
      size_id: '',
      convection_id: '',
      selling_price: '',
      stock: '',
      convection_qty: '',
      partner: ''
    });
    setCustomConvection({
      material_name: '',
      material_type: '',
      material_category: '',
      color: '',
      unit: '',
      purchase_price: '',
      quantity: ''
    });
    setConvectionMode('existing');
    setShowCustomPartner(false);
    setCustomPartnerValue('');
  };

  const fetchFormData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch colors, sizes, and convections in parallel
      const [
        colorsData,
        sizesData,
        convectionsData,
        partnersData
      ] = await Promise.all([
        MasterDataService.colors.getAll(),
        MasterDataService.sizes.getAll(),
        MasterDataService.convections.getAll(),
        ProductVariantService.getUniquePartners()
      ]);

      partnersData.push('others');

      setColors(colorsData || []);
      setSizes(sizesData || []);
      setConvections(convectionsData || []);
      setPartners(partnersData || []);
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError('Gagal memuat data form. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePartnerChange = (e) => {
    const value = e.target.value;

    if (value === 'others') {
      setShowCustomPartner(true);
      setFormData(prev => ({ ...prev, partner: '' }));
    } else {
      setShowCustomPartner(false);
      setCustomPartnerValue('');
      setFormData(prev => ({ ...prev, partner: value }));
    }
  };

  const handleCustomPartnerChange = (e) => {
    const value = e.target.value;
    setCustomPartnerValue(value);
    setFormData(prev => ({ ...prev, partner: value }));
  };

  const handleConvectionModeChange = (mode) => {
    setConvectionMode(mode);
    setFormData(prev => ({ ...prev, convection_id: '' }));
    setMaxConvectionQty(null);
  };

  // Update maxConvectionQty when convection_id changes (only for existing mode)
  useEffect(() => {
    if (convectionMode === 'existing' && formData.convection_id) {
      const selectedConvection = convections.find(c => c.id === parseInt(formData.convection_id));
      setMaxConvectionQty(selectedConvection && typeof selectedConvection.stock === 'number' ? selectedConvection.stock : null);
    } else {
      setMaxConvectionQty(null);
    }
  }, [formData.convection_id, convectionMode, convections]);

  const handleSubmit = async () => {
    const isExistingValid = convectionMode === 'existing' && formData.convection_id;
    const isCustomValid = convectionMode === 'custom' &&
      customConvection.material_name &&
      customConvection.material_type &&
      customConvection.material_category &&
      customConvection.color &&
      customConvection.unit &&
      customConvection.purchase_price &&
      customConvection.quantity;

    if (formData.color_id && formData.size_id && (isExistingValid || isCustomValid) && formData.selling_price && formData.stock) {
      try {
        setLoading(true);
        setError(null);

        // Find the selected objects for display names
        const selectedColor = colors.find(c => c.id === parseInt(formData.color_id));
        const selectedSize = sizes.find(s => s.id === parseInt(formData.size_id));

        // Prepare variant data based on convection mode
        let variantData = {
          color_id: parseInt(formData.color_id),
          size_id: parseInt(formData.size_id),
          selling_price: parseInt(formData.selling_price),
          stock: parseInt(formData.stock),
          convection_quantity: parseInt(formData.convection_qty) || 0,
          // Add display name for UI
          name: `${selectedColor?.name} - ${selectedSize?.name}`,
          partner: formData.partner || null
        };

        if (convectionMode === 'existing') {
          // For existing convection, save convection_id
          variantData.convection_id = parseInt(formData.convection_id);
          variantData.convection_json = null; // Clear any previous custom data
        } else {
          // For custom convection, save as JSON in convection_json field
          variantData.convection_id = null; // Clear any previous convection_id
          variantData.convection_quantity = null;
          variantData.convection_json = {
            material_name: customConvection.material_name,
            material_type: customConvection.material_type,
            material_category: customConvection.material_category,
            color: customConvection.color,
            unit: customConvection.unit,
            purchase_price: parseFloat(customConvection.purchase_price),
            quantity: parseInt(customConvection.quantity),
            created_at: isEditMode ? variant.convection_json?.created_at : new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        }

        if (isEditMode) {
          await onUpdate(variant.id, variantData);
        } else {
          await onAdd(productId, variantData);
        }

        // Reset form on success (only for add mode)
        if (!isEditMode) {
          resetForm();
        }

      } catch (err) {
        console.error(`Error ${isEditMode ? 'updating' : 'adding'} variant:`, err);
        setError(`Gagal ${isEditMode ? 'memperbarui' : 'menambahkan'} varian. Silakan coba lagi.`);
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const basicValid = formData.color_id && formData.size_id && formData.selling_price && formData.stock;
    const convectionValid = convectionMode === 'existing' ?
      formData.convection_id :
      (customConvection.material_name &&
        customConvection.material_type &&
        customConvection.material_category &&
        customConvection.color &&
        customConvection.unit &&
        customConvection.purchase_price &&
        customConvection.quantity);

    return basicValid && convectionValid;
  };

  const submitButtonText = isEditMode ? 'Update Varian' : 'Tambah Varian';
  const submitIcon = isEditMode ? Save : Plus;
  const loadingText = isEditMode ? 'Memperbarui...' : 'Menambahkan...';

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        {isEditMode
          ? 'Ubah data varian produk'
          : 'Lengkapi semua field untuk menambahkan varian produk baru'
        }
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Color Selection */}
        <Select
          value={formData.color_id}
          onChange={(e) => setFormData({...formData, color_id: e.target.value})}
          disabled={loading}
          options={colors}
          valueKey="id"
          labelKey="name"
          placeholder={loading ? 'Memuat warna...' : 'Pilih Warna'}
          label="Warna"
          required={true}
        />

        {/* Size Selection */}
        <Select
          value={formData.size_id}
          onChange={(e) => setFormData({...formData, size_id: e.target.value})}
          disabled={loading}
          options={sizes}
          valueKey="id"
          labelKey="name"
          placeholder={loading ? 'Memuat ukuran...' : 'Pilih Ukuran'}
          label="Ukuran"
          required={true}
        />

        {/* Convection Selection Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Pilih Sumber Konveksi
          </label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="convectionMode"
                value="existing"
                checked={convectionMode === 'existing'}
                onChange={(e) => handleConvectionModeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span>Pilih dari Konveksi yang Ada</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="convectionMode"
                value="custom"
                checked={convectionMode === 'custom'}
                onChange={(e) => handleConvectionModeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span>Buat Konveksi Custom</span>
            </label>
          </div>

          {/* Existing Convection Selection */}
          {convectionMode === 'existing' && (
            <Select
              value={formData.convection_id}
              onChange={(e) => setFormData({...formData, convection_id: e.target.value})}
              disabled={loading}
              options={convections.map(convection => ({
                id: convection.id,
                name: `${convection.name}${convection.colors ? ` (${convection.colors.name})` : ''}${convection.stock !== undefined ? ` - Stok: ${convection.stock}` : ''}`
              }))}
              valueKey="id"
              labelKey="name"
              placeholder={loading ? 'Memuat konveksi...' : 'Pilih Konveksi'}
            />
          )}

          {/* Custom Convection Input */}
          {convectionMode === 'custom' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
              <div className="mb-3">
                <h4 className="font-medium text-green-800 mb-2">Material Konveksi Custom</h4>
                <p className="text-sm text-green-600">
                  {isEditMode ? 'Ubah data material konveksi custom' : 'Isi data material konveksi baru yang akan dibuat'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Input
                  type="text"
                  placeholder="Nama Material"
                  value={customConvection.material_name}
                  onChange={(e) => setCustomConvection({...customConvection, material_name: e.target.value})}
                  disabled={loading}
                  required={true}
                />

                <Input
                  type="text"
                  placeholder="Tipe Material"
                  value={customConvection.material_type}
                  onChange={(e) => setCustomConvection({...customConvection, material_type: e.target.value})}
                  disabled={loading}
                  required={true}
                />

                <Input
                  type="text"
                  placeholder="Kategori Material"
                  value={customConvection.material_category}
                  onChange={(e) => setCustomConvection({...customConvection, material_category: e.target.value})}
                  disabled={loading}
                  required={true}
                />

                <Input
                  type="text"
                  placeholder="Warna"
                  value={customConvection.color}
                  onChange={(e) => setCustomConvection({...customConvection, color: e.target.value})}
                  disabled={loading}
                  required={true}
                />

                <Input
                  type="text"
                  placeholder="Unit"
                  value={customConvection.unit}
                  onChange={(e) => setCustomConvection({...customConvection, unit: e.target.value})}
                  disabled={loading}
                  required={true}
                />

                <Input
                  type="text"
                  placeholder="Harga Beli"
                  value={UtilityService.formatNumber(customConvection.purchase_price)}
                  onChange={(e) => UtilityService.handlePriceInputChange(e, (value) => setCustomConvection({...customConvection, purchase_price: value}))}
                  disabled={loading}
                  required={true}
                  label="Harga Beli"
                />

                <NumberInput
                  placeholder="Jumlah"
                  value={customConvection.quantity}
                  onChange={(e) => setCustomConvection({...customConvection, quantity: e.target.value})}
                  disabled={loading}
                  min="0"
                  required={true}
                />
              </div>

              <div className="text-xs text-green-600">
                💡 Material konveksi custom akan disimpan sebagai JSON data di field convection_json
              </div>
            </div>
          )}
        </div>

        {/* Convection Quantity */}
        {(convectionMode === 'existing' && formData.convection_id) && (
          <div>
            <NumberInput
              placeholder="0"
              value={formData.convection_qty}
              onChange={(e) => {
                let val = e.target.value;
                // Batasi ke maxConvectionQty jika ada
                if (maxConvectionQty !== null && val) {
                  val = Math.min(Number(val), maxConvectionQty).toString();
                }
                setFormData({...formData, convection_qty: val});
              }}
              disabled={loading}
              min="0"
              max={maxConvectionQty !== null ? maxConvectionQty : undefined}
              label="Jumlah Konveksi"
            />
            <p className="text-xs text-gray-500 mt-1">
              Jumlah konveksi yang akan digunakan untuk varian ini
              {maxConvectionQty !== null && (
                <span className="ml-2 text-blue-600">(Maksimal: {maxConvectionQty})</span>
              )}
            </p>
          </div>
        )}

        {/* Mitra Selection */}
        <FormGroup>
          <FormLabel htmlFor="partner">Mitra (Opsional)</FormLabel>
          <Select
            id="partner"
            name="partner"
            value={showCustomPartner ? 'others' : formData.partner}
            onChange={handlePartnerChange}
            placeholder="Pilih Mitra"
            options={partners}
          >
          </Select>
        </FormGroup>

        {/* Custom Mitra Input */}
        {showCustomPartner && (
          <FormGroup>
            <FormLabel htmlFor="customPartner">Mitra Baru</FormLabel>
            <Input
              id="customPartner"
              name="customPartner"
              type="text"
              value={customPartnerValue}
              onChange={handleCustomPartnerChange}
              placeholder="Masukkan nama mitra baru"
            />
          </FormGroup>
        )}

        {/* Price and Stock Row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Harga Jual"
            value={UtilityService.formatNumber(formData.selling_price)}
            onChange={(e) => UtilityService.handlePriceInputChange(e, (value) => setFormData({...formData, selling_price: value}))}
            disabled={loading}
            label="Harga Jual"
            required={true}
          />

          <NumberInput
            placeholder="0"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            disabled={loading}
            min="0"
            label="Stok"
            required={true}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleSubmit}
            disabled={loading || !validateForm()}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {loadingText}
              </>
            ) : (
              <>
                {React.createElement(submitIcon, { className: "w-4 h-4" })}
                {submitButtonText}
              </>
            )}
          </button>

          {!isEditMode && (
            <button
              onClick={fetchFormData}
              disabled={loading}
              className="px-4 py-3 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:text-blue-300 disabled:border-blue-300 transition-colors"
            >
              Refresh
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VariantForm;