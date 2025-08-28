import React, { useState, useEffect } from 'react';
import { X, Package, Palette, Ruler, Factory, DollarSign, Package2, Info, Tag, Edit2 } from 'lucide-react';
import VariantForm from './VariantForm.jsx';
import MasterDataService from '../../services/MasterDataService.js';

// Modal Component untuk Detail Variant
const VariantDetailModal = ({ isOpen, onClose, variant, onUpdate }) => {
  const [variantData, setVariantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [convections, setConvections] = useState([]);

  useEffect(() => {
    if (isOpen && variant) {
      processVariantData();
      fetchMasterData();
    }
  }, [isOpen, variant]);

  const fetchMasterData = async () => {
    try {
      const [colorsData, sizesData, convectionsData] = await Promise.all([
        MasterDataService.colors.getAll(),
        MasterDataService.sizes.getAll(),
        MasterDataService.convections.getAll()
      ]);

      setColors(colorsData || []);
      setSizes(sizesData || []);
      setConvections(convectionsData || []);
    } catch (err) {
      console.error('Error fetching master data:', err);
    }
  };

  const processVariantData = () => {
    if (!variant) return;

    setLoading(true);

    // Find related data
    const colorData = variant.colors;
    const sizeData = variant.sizes;
    const convectionData = variant.convection_id ? variant.convections : null;

    setVariantData({
      ...variant,
      color: colorData,
      size: sizeData,
      convection: convectionData,
      hasCustomConvection: !!variant.convection_json
    });

    setLoading(false);
  };

  const handleUpdate = async (variantId, updatedData) => {
    try {
      await onUpdate(variantId, updatedData);
      setIsEditing(false);
      // Refresh variant data
      const updatedVariant = { ...variant, ...updatedData };
      setVariantData(prev => ({ ...prev, ...updatedData }));
    } catch (error) {
      console.error('Error updating variant:', error);
      throw error;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto
        ${isEditing ? 'max-w-md' : 'max-w-4xl'}
      `}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <Package className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Variant Produk' : 'Detail Variant Produk'}
              </h3>
              <p className="text-sm text-gray-500">
                {variantData?.colors?.name} - {variantData?.sizes?.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-colors"
                title="Edit Variant"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-gray-600">Memuat data...</span>
            </div>
          ) : isEditing ? (
            // Edit Form
            <div>
              <VariantForm
                variant={variantData}
                onUpdate={handleUpdate}
                mode="edit"
              />
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : variantData ? (
            <div className="space-y-6">

              {/* Basic Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Informasi Dasar
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500">Warna</p>
                      <p className="font-medium">{variantData.colors?.name || 'Tidak ada data'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Ruler className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500">Ukuran</p>
                      <p className="font-medium">{variantData.sizes?.name || 'Tidak ada data'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Harga Jual</p>
                      <p className="font-medium text-green-600">
                        {formatCurrency(variantData.selling_price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Package2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Stok</p>
                      <p className="font-medium">
                        {variantData.stock} unit
                        {variantData.stock < 10 && (
                          <span className="ml-2 text-red-500 text-xs">⚠️ Stok rendah</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Convection Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-4 flex items-center gap-2">
                  <Factory className="w-4 h-4" />
                  Informasi Konveksi
                </h4>

                {variantData.hasCustomConvection ? (
                  // Custom Convection Display
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                        Material Custom
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-600">Nama Material</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_json?.material_name || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Tipe Material</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_json?.material_type || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Kategori</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_json?.material_category || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Warna Material</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_json?.color || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Unit</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_json?.unit || '-'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Harga Beli</p>
                        <p className="font-medium text-blue-900">
                          {formatCurrency(variantData.convection_json?.purchase_price)}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Jumlah</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_json?.quantity || 0} {variantData.convection_json?.unit || 'unit'}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">Dibuat Pada</p>
                        <p className="font-medium text-blue-900">
                          {formatDate(variantData.convection_json?.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : variantData.convections ? (
                  // Existing Convection Display
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded">
                        Konveksi Existing
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-blue-600">Nama Konveksi</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convections.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-blue-600">ID Konveksi</p>
                        <p className="font-medium text-blue-900">
                          #{variantData.convection_id}
                        </p>
                      </div>

                      {variantData.convections.colors && (
                        <div>
                          <p className="text-sm text-blue-600">Warna Konveksi</p>
                          <p className="font-medium text-blue-900">
                            {variantData.convections.colors.name}
                          </p>
                        </div>
                      )}

                      {variantData.convections.stock !== undefined && (
                        <div>
                          <p className="text-sm text-blue-600">Stok Konveksi</p>
                          <p className="font-medium text-blue-900">
                            {variantData.convection.stock} unit
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Factory className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Tidak ada data konveksi</p>
                  </div>
                )}

                {/* Convection Quantity */}
                {variantData.convection_quantity > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200">
                    <div className="flex items-center gap-2">
                      <Package2 className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-blue-600">Jumlah Konveksi Digunakan</p>
                        <p className="font-medium text-blue-900">
                          {variantData.convection_quantity} unit
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {(variantData.created_at || variantData.updated_at) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Informasi Tambahan</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {variantData.created_at && (
                      <div>
                        <p className="text-gray-500">Dibuat pada</p>
                        <p className="font-medium">{formatDate(variantData.created_at)}</p>
                      </div>
                    )}

                    {variantData.updated_at && (
                      <div>
                        <p className="text-gray-500">Terakhir diupdate</p>
                        <p className="font-medium">{formatDate(variantData.updated_at)}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Status Indicators */}
              <div className="flex flex-wrap gap-2">
                {variantData.stock > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✅ Tersedia
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    ❌ Stok Habis
                  </span>
                )}

                {variantData.hasCustomConvection ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    🎨 Custom Material
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    🏭 Standard Convection
                  </span>
                )}

                {variantData.stock < 10 && variantData.stock > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ⚠️ Stok Rendah
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Data variant tidak ditemukan</p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!isEditing && (
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex gap-2 items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Edit Variant"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariantDetailModal;