import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Edit2, Trash2 } from "lucide-react";
import { ConvectionService } from "../services/ConvectionService.js";
import EditConvectionModal from "../components/convections/EditConvectionModal.jsx";
import { ConfirmationModal } from "../components/common/index.js";
import { formatPrice } from "../common.js";

const ConvectionDetailPage = () => {
  const navigate = useNavigate();
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const convectionData = useLoaderData();
  const [convection, setConvection] = useState(convectionData);

  console.log("convection", convection);

  const updateConvection = async (id, updatedData) => {
    try {
      const updatedConvection = await ConvectionService.update(id, updatedData);
      setConvection(updatedConvection);
      alert("Convection berhasil diupdate");
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate convection");
      throw error;
    }
  };

  const deleteConvection = async () => {
    setIsDeleting(true);
    try {
      await ConvectionService.delete(convection.id);
      
      alert("Convection berhasil dihapus");
      navigate("/convection");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus convection");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/convection');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors mr-4"
                onClick={handleCancel}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Package className="mr-3 text-blue-600" />
                  Detail Convection
                </h1>
                <p className="text-gray-600 mt-1">
                  Informasi lengkap convection
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                {isDeleting ? "Menghapus..." : "Hapus"}
              </button>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Bahan
              </label>
              <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                {convection.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Harga Beli
              </label>
              <p className="text-lg font-semibold text-green-600 bg-gray-50 p-3 rounded-lg">
                {formatPrice(convection.purchase_price)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock
              </label>
              <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                {convection.stock}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buffer Stock
              </label>
              <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                {convection.buffer_stock}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                {convection.unit}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warna
              </label>
              <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                {convection.colors?.name || "Belum ditentukan"}
              </p>
            </div>

            {convection.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <p className="text-lg font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg">
                  {convection.category}
                </p>
              </div>
            )}
          </div>

          {/* Stock Status */}
          <div className="mt-6 p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  Status Stock
                </p>
                <p className="text-sm text-blue-700">
                  {convection.stock > convection.buffer_stock ? (
                    `Stock mencukupi (${convection.stock} tersedia)`
                  ) : convection.stock === convection.buffer_stock ? (
                    `Stock berada di batas buffer (${convection.stock} tersedia)`
                  ) : (
                    `Stock rendah! Perlu restok segera (${convection.stock} tersedia, buffer: ${convection.buffer_stock})`
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <EditConvectionModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={updateConvection}
        convectionData={convection}
      />

      {showDeleteModal && (
        <ConfirmationModal
          title="Hapus Convection"
          message={`Apakah Anda yakin ingin menghapus convection "${convection.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={deleteConvection}
          onCancel={() => setShowDeleteModal(false)}
          confirmText="Hapus"
          cancelText="Batal"
          type="danger"
        />
      )}
    </div>
  );
};

export default ConvectionDetailPage;