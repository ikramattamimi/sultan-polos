import React, { useState, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import CardConvection from "../components/convections/CardConvection.jsx";
import CreateConvectionModal from "../components/convections/CreateConvectionModal.jsx";
import EditConvectionModal from "../components/convections/EditConvectionModal.jsx";
import { Plus, Package, Search, RefreshCw } from "lucide-react";
import { ConvectionService } from "../services/ConvectionService.js";
import { ConfirmationModal } from "../components/common/index.js";

const ConvectionPage = () => {
  const { convections: initialConvections } = useLoaderData();

  // State management
  const [convections, setConvections] = useState(initialConvections || []);
  const [filteredConvections, setFilteredConvections] = useState(initialConvections || []);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedConvection, setSelectedConvection] = useState(null);
  const [convectionToDelete, setConvectionToDelete] = useState(null);

  // Apply search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConvections(convections);
    } else {
      const filtered = convections.filter(convection =>
        convection.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convection.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        convection.unit?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConvections(filtered);
    }
  }, [convections, searchQuery]);

  // Load convections data
  const loadConvections = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await ConvectionService.getAll();
      setConvections(data || []);
    } catch (error) {
      console.error("Error loading convections:", error);
      alert("Gagal memuat data convection. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadConvections(true);
  };

  // Handle create convection
  const handleCreateConvection = async (convectionData) => {
    try {
      await ConvectionService.create(convectionData);
      alert("Convection berhasil dibuat");
      await loadConvections();
    } catch (error) {
      console.error("Error creating convection:", error);
      throw error;
    }
  };

  // Handle edit convection
  const handleEditConvection = (convection) => {
    setSelectedConvection(convection);
    setShowEditModal(true);
  };

  // Handle update convection
  const handleUpdateConvection = async (id, convectionData) => {
    try {
      await ConvectionService.update(id, convectionData);
      alert("Convection berhasil diupdate");
      await loadConvections();
    } catch (error) {
      console.error("Error updating convection:", error);
      throw error;
    }
  };

  // Handle delete convection
  const handleDeleteConvection = (convection) => {
    setConvectionToDelete(convection);
    setShowDeleteModal(true);
  };

  // Confirm delete convection
  const confirmDeleteConvection = async () => {
    try {
      await ConvectionService.delete(convectionToDelete.id);
      alert("Convection berhasil dihapus");
      await loadConvections();
      setShowDeleteModal(false);
      setConvectionToDelete(null);
    } catch (error) {
      console.error("Error deleting convection:", error);
      alert("Gagal menghapus convection. Silakan coba lagi.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Package className="mr-3 text-blue-600" />
                Convection
              </h1>
              <p className="text-gray-600 mt-1">
                Kelola dan pantau semua data convection
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>

              <button
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Convection
              </button>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cari convection berdasarkan nama, kategori, atau unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredConvections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredConvections.map((item) => (
              <CardConvection 
                key={item.id} 
                convection={item}
                onEdit={() => handleEditConvection(item)}
                onDelete={() => handleDeleteConvection(item)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada convection"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? `Tidak ditemukan convection yang sesuai dengan "${searchQuery}"`
                : "Mulai dengan menambahkan convection pertama Anda"
              }
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Convection
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <CreateConvectionModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateConvection}
      />

      <EditConvectionModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedConvection(null);
        }}
        onUpdate={handleUpdateConvection}
        convectionData={selectedConvection}
      />

      {showDeleteModal && (
        <ConfirmationModal
          title="Hapus Convection"
          message={`Apakah Anda yakin ingin menghapus convection "${convectionToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={confirmDeleteConvection}
          onCancel={() => {
            setShowDeleteModal(false);
            setConvectionToDelete(null);
          }}
          confirmText="Hapus"
          cancelText="Batal"
          type="danger"
        />
      )}
    </div>
  );
};

export default ConvectionPage;