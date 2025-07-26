import React, { useState, useEffect } from 'react';
import { Plus, Save, X } from 'lucide-react';
import MasterDataService from '../../services/MasterDataService.js';

const CreateConvectionModal = ({ show, onClose, onCreate }) => {
  const [convection, setConvection] = useState({
    name: '',
    purchase_price: '',
    stock: '',
    buffer_stock: '',
    unit: '',
    color_id: '',
  });

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load colors when modal opens
  useEffect(() => {
    if (show) {
      fetchColors();
      // Reset form
      setConvection({
        name: '',
        purchase_price: '',
        stock: '',
        buffer_stock: '',
        unit: '',
        color_id: '',
      });
      setError(null);
    }
  }, [show]);

  const fetchColors = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const colorsData = await MasterDataService.colors.getAll();
      setColors(colorsData || []);
    } catch (err) {
      console.error('Error fetching colors:', err);
      setError('Gagal memuat data warna. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (convection.name && convection.purchase_price && convection.stock && convection.buffer_stock && convection.unit) {
      try {
        setLoading(true);
        await onCreate({
          ...convection,
          purchase_price: parseFloat(convection.purchase_price),
          stock: parseInt(convection.stock),
          buffer_stock: parseInt(convection.buffer_stock),
          color_id: convection.color_id ? parseInt(convection.color_id) : null,
        });
        onClose();
      } catch (err) {
        console.error('Error creating convection:', err);
        setError('Gagal membuat convection. Silakan coba lagi.');
      } finally {
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tambah Convection Baru
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
            placeholder="Nama Bahan"
            value={convection.name}
            onChange={(e) => setConvection({...convection, name: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <input
            type="number"
            placeholder="Harga"
            value={convection.purchase_price}
            onChange={(e) => setConvection({...convection, purchase_price: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <input
            type="number"
            placeholder="Stock"
            value={convection.stock}
            onChange={(e) => setConvection({...convection, stock: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <input
            type="number"
            placeholder="Buffer Stock"
            value={convection.buffer_stock}
            onChange={(e) => setConvection({...convection, buffer_stock: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <input
            type="text"
            placeholder="Unit"
            value={convection.unit}
            onChange={(e) => setConvection({...convection, unit: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          
          <select
            value={convection.color_id}
            onChange={(e) => setConvection({...convection, color_id: e.target.value})}
            disabled={loading}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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
          
          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={loading || !convection.name || !convection.purchase_price || !convection.stock || !convection.buffer_stock || !convection.unit}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Buat
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

export default CreateConvectionModal;
