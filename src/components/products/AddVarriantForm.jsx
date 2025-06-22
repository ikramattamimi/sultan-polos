import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import masterDataService from '../../services/masterDataService.js';

// Component untuk Form Tambah Varian (Updated)

const AddVariantForm = ({ productId, onAdd }) => {
  const [variant, setVariant] = useState({
    color_id: '',
    size_id: '',
    convection_id: '',
    selling_price: '',
    stock: '',
    convection_qty: ''
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

  // Fetch colors, sizes, and convections when component mounts
  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch colors, sizes, and convections in parallel
      const [colorsData, sizesData, convectionsData] = await Promise.all([
        masterDataService.colors.getAll(),
        masterDataService.sizes.getAll(),
        masterDataService.convections.getAll()
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
    setVariant(prev => ({ ...prev, convection_id: '' }));
    // setCustomConvection({ 
    //   material_name: '', 
    //   material_type: '', 
    //   material_category: '', 
    //   color: '', 
    //   unit: '', 
    //   purchase_price: '', 
    //   quantity: '' 
    // });
  };

  // No longer need auto-generate SKU

  const handleSubmit = async () => {
    const isExistingValid = convectionMode === 'existing' && variant.convection_id;
    const isCustomValid = convectionMode === 'custom' && 
      customConvection.material_name && 
      customConvection.material_type && 
      customConvection.material_category && 
      customConvection.color && 
      customConvection.unit && 
      customConvection.purchase_price && 
      customConvection.quantity;
    
    if (variant.color_id && variant.size_id && (isExistingValid || isCustomValid) && variant.selling_price && variant.stock) {
      try {
        setLoading(true);
        setError(null);
        
        // Find the selected objects for display names
        const selectedColor = colors.find(c => c.id === parseInt(variant.color_id));
        const selectedSize = sizes.find(s => s.id === parseInt(variant.size_id));
        
        // Prepare variant data based on convection mode
        let variantData = {
          color_id: parseInt(variant.color_id),
          size_id: parseInt(variant.size_id),
          selling_price: parseInt(variant.selling_price),
          stock: parseInt(variant.stock),
          convection_quantity: parseInt(variant.convection_qty) || 0,
          // Add display name for UI
          name: `${selectedColor?.name} - ${selectedSize?.name}`
        };

        if (convectionMode === 'existing') {
          // For existing convection, save convection_id
          variantData.convection_id = parseInt(variant.convection_id);
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
            created_at: new Date().toISOString(),
          };
        }
        
        await onAdd(productId, variantData);
        
        // Reset form on success
        setVariant({ 
          color_id: '', 
          size_id: '', 
          convection_id: '', 
          selling_price: '', 
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
        
      } catch (err) {
        console.error('Error adding variant:', err);
        setError('Gagal menambahkan varian. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const basicValid = variant.color_id && variant.size_id && variant.selling_price && variant.stock;
    const convectionValid = convectionMode === 'existing' ? 
      variant.convection_id : 
      (customConvection.material_name && 
       customConvection.material_type && 
       customConvection.material_category && 
       customConvection.color && 
       customConvection.unit && 
       customConvection.purchase_price && 
       customConvection.quantity);
    
    return basicValid && convectionValid;
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Lengkapi semua field untuk menambahkan varian produk baru
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Color Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Warna *
          </label>
          <select
            value={variant.color_id}
            onChange={(e) => setVariant({...variant, color_id: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Memuat warna...' : 'Pilih Warna'}
            </option>
            {colors.map(color => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Size Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ukuran *
          </label>
          <select
            value={variant.size_id}
            onChange={(e) => setVariant({...variant, size_id: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loading ? 'Memuat ukuran...' : 'Pilih Ukuran'}
            </option>
            {sizes.map(size => (
              <option key={size.id} value={size.id}>
                {size.name}
              </option>
            ))}
          </select>
        </div>
        
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
            <select
              value={variant.convection_id}
              onChange={(e) => setVariant({...variant, convection_id: e.target.value})}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {loading ? 'Memuat konveksi...' : 'Pilih Konveksi'}
              </option>
              {convections.map(convection => (
                <option key={convection.id} value={convection.id}>
                  {convection.name} 
                  {convection.colors && ` (${convection.colors.name})`}
                  {convection.stock !== undefined && ` - Stok: ${convection.stock}`}
                </option>
              ))}
            </select>
          )}

          {/* Custom Convection Input */}
          {convectionMode === 'custom' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4 space-y-3">
              <div className="mb-3">
                <h4 className="font-medium text-green-800 mb-2">Material Konveksi Custom</h4>
                <p className="text-sm text-green-600">
                  Isi data material konveksi baru yang akan dibuat
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <input
                  type="text"
                  placeholder="Nama Material *"
                  value={customConvection.material_name}
                  onChange={(e) => setCustomConvection({...customConvection, material_name: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                
                <input
                  type="text"
                  placeholder="Tipe Material *"
                  value={customConvection.material_type}
                  onChange={(e) => setCustomConvection({...customConvection, material_type: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                
                <input
                  type="text"
                  placeholder="Kategori Material *"
                  value={customConvection.material_category}
                  onChange={(e) => setCustomConvection({...customConvection, material_category: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                
                <input
                  type="text"
                  placeholder="Warna *"
                  value={customConvection.color}
                  onChange={(e) => setCustomConvection({...customConvection, color: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                
                <input
                  type="text"
                  placeholder="Unit *"
                  value={customConvection.unit}
                  onChange={(e) => setCustomConvection({...customConvection, unit: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                
                <input
                  type="number"
                  placeholder="Harga Beli *"
                  value={customConvection.purchase_price}
                  onChange={(e) => setCustomConvection({...customConvection, purchase_price: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  min="0"
                />
                
                <input
                  type="number"
                  placeholder="Jumlah *"
                  value={customConvection.quantity}
                  onChange={(e) => setCustomConvection({...customConvection, quantity: e.target.value})}
                  disabled={loading}
                  className="w-full p-3 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  min="0"
                />
              </div>
              
              <div className="text-xs text-green-600">
                💡 Material konveksi custom akan disimpan sebagai JSON data di field convection_json
              </div>
            </div>
          )}
        </div>

        {/* Convection Quantity */}
        {(convectionMode === 'existing' && variant.convection_id) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Konveksi
            </label>
            <input
              type="number"
              placeholder="0"
              value={variant.convection_qty}
              onChange={(e) => setVariant({...variant, convection_qty: e.target.value})}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              min="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Jumlah konveksi yang akan digunakan untuk varian ini
            </p>
          </div>
        )}
        
        {/* Price and Stock Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga Jual *
            </label>
            <input
              type="number"
              placeholder="0"
              value={variant.selling_price}
              onChange={(e) => setVariant({...variant, selling_price: e.target.value})}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stok *
            </label>
            <input
              type="number"
              placeholder="0"
              value={variant.stock}
              onChange={(e) => setVariant({...variant, stock: e.target.value})}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              min="0"
            />
          </div>
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
                Menambahkan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Tambah Varian
              </>
            )}
          </button>
          
          <button
            onClick={fetchFormData}
            disabled={loading}
            className="px-4 py-3 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 disabled:text-blue-300 disabled:border-blue-300 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVariantForm