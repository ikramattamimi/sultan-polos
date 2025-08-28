import React, { useState, useEffect } from 'react';
import { Plus, Save } from 'lucide-react';
import MasterDataService from '../../services/MasterDataService.js';
import {Input, Select, NumberInput} from '../ui/forms';
import { UtilityService } from '../../services/UtilityServices.js';
import { SketchPicker } from 'react-color'; // Tambah import
import ColorCircle from '../common/ColorCircle.jsx';

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
    stock: '',
    convection_qty: ''
  });

  const [convectionMode, setConvectionMode] = useState('none');
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

  // State for max convection quantity
  const [maxConvectionQty, setMaxConvectionQty] = useState(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState({ name: '', hex: '#000000' });
  const [showAddColorModal, setShowAddColorModal] = useState(false); // Tambahkan state untuk modal tambah warna

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
      stock: variant.stock?.toString() || '',
      convection_qty: variant.convection_quantity?.toString() || ''
    });

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
      setConvectionMode('none');
    }
  };

  const resetForm = () => {
    setFormData({
      color_id: '',
      size_id: '',
      convection_id: '',
      stock: '',
      convection_qty: ''
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
    setConvectionMode('none');
  };

  const fetchFormData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch colors, sizes, and convections in parallel
      const [
        colorsData,
        sizesData,
        convectionsData
      ] = await Promise.all([
        MasterDataService.colors.getAll(),
        MasterDataService.sizes.getAll(),
        MasterDataService.convections.getAll()
      ]);

      setColors(colorsData || []);
      setSizes(sizesData || []);
      setConvections(convectionsData || []);
    } catch (err) {
      console.error('Error fetching form data:', err);
      setError('Gagal memuat data form. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
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
    const isExistingValid = convectionMode === 'existing';
    const isCustomValid = convectionMode === 'custom' &&
      customConvection.material_name &&
      customConvection.material_type &&
      customConvection.material_category &&
      customConvection.color &&
      customConvection.unit &&
      customConvection.purchase_price &&
      customConvection.quantity;
    const isNoneValid = convectionMode === 'none';

    if (
      formData.color_id &&
      formData.size_id &&
      (isExistingValid || isCustomValid || isNoneValid) &&
      formData.stock
    ) {
      try {
        setLoading(true);
        setError(null);

        const selectedColor = colors.find(c => c.id === parseInt(formData.color_id));
        const selectedSize = sizes.find(s => s.id === parseInt(formData.size_id));

        let variantData = {
          color_id: parseInt(formData.color_id),
          size_id: parseInt(formData.size_id),
          stock: parseInt(formData.stock),
          convection_quantity: parseInt(formData.convection_qty) || 0,
          // name: `${selectedColor?.name} - ${selectedSize?.name}`
        };

        if (convectionMode === 'existing') {
          variantData.convection_id = parseInt(formData.convection_id);
          variantData.convection_json = null;
        } else if (convectionMode === 'custom') {
          variantData.convection_id = null;
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
          } else if (convectionMode === 'none') {
            variantData.convection_id = null;
            variantData.convection_json = null;
            variantData.convection_quantity = null;
          }

          if (isEditMode) {
            // if ('name' in variantData) delete variantData.name;
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
    // Remove selling_price from validation
    const basicValid = formData.color_id && formData.size_id && formData.stock;
    const convectionValid =
      convectionMode === 'existing'
        ? true
        : convectionMode === 'custom'
        ? (customConvection.material_name &&
          customConvection.material_type &&
          customConvection.material_category &&
          customConvection.color &&
          customConvection.unit &&
          customConvection.purchase_price &&
          customConvection.quantity)
        : convectionMode === 'none'
        ? true
        : false;

    return basicValid && convectionValid;
  };

  const submitButtonText = isEditMode ? 'Update Varian' : 'Tambah Varian';
  const submitIcon = isEditMode ? Save : Plus;
  const loadingText = isEditMode ? 'Memperbarui...' : 'Menambahkan...';

  // Handler untuk tambah warna baru
  const handleAddColor = async () => {
    if (newColor.name && newColor.hex) {

      await MasterDataService.colors.create({ name: newColor.name, hex_code: newColor.hex })
      var colors = await MasterDataService.colors.getAll()
      
      setColors(colors);
      setNewColor({ name: '', hex: '#000000' });
      setShowColorPicker(false);
    }
  };

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
        <React.Fragment>
          <label className="block text-sm font-medium mb-1">Warna</label>
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-3">
              <Select
                value={formData.color_id}
                onChange={(e) => setFormData({...formData, color_id: e.target.value})}
                disabled={loading}
                options={colors}
                valueKey="id"
                labelKey="name"
                placeholder={loading ? 'Memuat warna...' : 'Pilih Warna'}
                required
                // Tampilkan preview warna di option
                renderOption={(color) => (
                  <div className="flex items-center gap-2">
                    <ColorCircle color={color.hex_code} size={16} />
                    <span>{color.name}</span>
                  </div>
                )}
              />
            </div>
            <button
              type="button"
              className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 border border-blue-300"
              onClick={() => setShowAddColorModal(true)}
              disabled={loading}
            >
              + Warna Baru
            </button>
          </div>
        </React.Fragment>

        {/* Modal Tambah Warna Baru */}
        {showAddColorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs">
              <h3 className="text-lg font-semibold mb-3">Tambah Warna Baru</h3>
              <label className="block text-sm font-medium mb-1">Nama Warna</label>
              <Input
                type="text"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                placeholder="Contoh: Magenta"
                disabled={loading}
                required
                className="mb-2"
              />
              <label className="block text-sm font-medium mt-2 mb-1">Pilih Warna</label>
              <SketchPicker
                color={newColor.hex}
                onChangeComplete={(color) => setNewColor({ ...newColor, hex: color.hex })}
                disableAlpha
              />
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs">Preview:</span>
                <ColorCircle color={newColor.hex} title={newColor.name} size={32} />
                <span className="text-xs text-gray-500">{newColor.hex}</span>
              </div>
              {newColor.name && colors.some(c => c.name.toLowerCase() === newColor.name.toLowerCase()) && (
                <div className="text-xs text-red-600 mt-1">Nama warna sudah ada!</div>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  type="button"
                  className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                  onClick={async () => {
                    if (!newColor.name || colors.some(c => c.name.toLowerCase() === newColor.name.toLowerCase())) return;
                    await handleAddColor();
                    // Otomatis pilih warna baru
                    const latestColors = await MasterDataService.colors.getAll();
                    const added = latestColors.find(c => c.name === newColor.name && c.hex_code === newColor.hex);
                    if (added) setFormData({...formData, color_id: added.id.toString()});
                    setShowAddColorModal(false);
                  }}
                  disabled={loading || !newColor.name || colors.some(c => c.name.toLowerCase() === newColor.name.toLowerCase())}
                >
                  Simpan Warna
                </button>
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                  onClick={() => setShowAddColorModal(false)}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

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
          <div className="gap-4 mb-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="convectionMode"
                value="none"
                checked={convectionMode === 'none'}
                onChange={(e) => handleConvectionModeChange(e.target.value)}
                className="w-4 h-4"
              />
              <span>Tanpa Konveksi</span>
            </label>
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

        {/* Price and Stock Row */}
        <div className="grid grid-cols-2 gap-4">
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