
import React, { useState, useEffect } from "react";

import { SaleService } from "../services/SaleService.js";

import { LoadingSpinner, ErrorAlert, ConfirmationModal } from "../components/common";
import { SalesDetailModal, ExportModal, SalesPageHeader, SalesStatsCards } from "../components/sales";
import { SalesTable, SalesFilter} from "../components/sales/list";

const SalesPage = () => {
  // State data
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [salesStats, setSalesStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
  });

  // State loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // State filters
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [partnerFilter, setPartnerFilter] = useState("");
  const [partners, setPartners] = useState([]);

  // Handler untuk custom filter agar timeFilter otomatis ke 'all'
  const handleSetDateRange = (updater) => {
    setTimeFilter('all');
    setDateRange(updater);
  };
  const handleSetStatusFilter = (val) => {
    // setTimeFilter('all');
    setStatusFilter(val);
  };

  // Set custom date range otomatis saat timeFilter berubah
  useEffect(() => {
    if (timeFilter === 'all') {
      // Jangan ubah dateRange
      return;
    }
    const now = new Date();
    let start = '', end = '';
    if (timeFilter === 'today') {
      const s = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const e = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      start = s.toISOString().slice(0, 10);
      end = e.toISOString().slice(0, 10);
    } else if (timeFilter === 'this_week') {
      const day = now.getDay() || 7;
      const s = new Date(now);
      s.setDate(now.getDate() - day + 1);
      s.setHours(0, 0, 0, 0);
      const e = new Date(s);
      e.setDate(s.getDate() + 6);
      start = s.toISOString().slice(0, 10);
      end = e.toISOString().slice(0, 10);
    } else if (timeFilter === 'this_month') {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      start = s.toISOString().slice(0, 10);
      end = e.toISOString().slice(0, 10);
    } else if (timeFilter === 'last_3_months') {
      const s = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const e = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      start = s.toISOString().slice(0, 10);
      end = e.toISOString().slice(0, 10);
    }
    setDateRange({ startDate: start, endDate: end });
  }, [timeFilter]);

  // State modals
  const [selectedSale, setSelectedSale] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState(null);

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Load data saat komponen mount
  useEffect(() => {
    loadSales();
  }, []);

  // Apply filters saat ada perubahan
  useEffect(() => {
    applyFilters();
  }, [sales, searchQuery, dateRange, statusFilter, timeFilter, partnerFilter]);

  // Load data penjualan
  const loadSales = async (showRefreshLoader = false) => {
    try {
      if (showRefreshLoader) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const salesData = await SaleService.getAll();
      setSales(salesData || []);
      const partnersData = Array.from(
        new Set(
          salesData.flatMap(sale =>
            (sale.sale_items || []).map(
              item => item.product_variants?.partner || 'Tanpa Mitra'
            )
          )
        )
      );
      setPartners(partnersData || []);
      calculateStats(salesData || []);
    } catch (err) {
      console.error("Error loading sales:", err);
      setError("Gagal memuat data penjualan. Silakan coba lagi.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Hitung statistik
  const calculateStats = (salesData) => {
    const totalOrders = salesData.length;
    const totalRevenue = salesData.reduce(
      (sum, sale) => sum + (sale.total_price || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
      // count total customer with unique customer name
    const customers = new Set(
      salesData
        .map((sale) => sale.customer)
        .filter((customer) => customer !== null && customer !== "")
    );

    setSalesStats({
      totalSales: totalOrders,
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers: customers.size
    });
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...sales];

    // Filter berdasarkan timeFilter
    if (timeFilter !== 'all') {
      const now = new Date();
      let start, end;
      if (timeFilter === 'today') {
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
      } else if (timeFilter === 'this_week') {
        const day = now.getDay() || 7;
        start = new Date(now);
        start.setDate(now.getDate() - day + 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now);
        end.setDate(start.getDate() + 6);
        end.setHours(23, 59, 59, 999);
      } else if (timeFilter === 'this_month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      } else if (timeFilter === 'last_3_months') {
        start = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      }
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.sale_date);
        return saleDate >= start && saleDate <= end;
      });
    }

    // Filter berdasarkan pencarian
    if (searchQuery) {
      filtered = filtered.filter(
        (sale) =>
          sale.order_number
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          sale.customer?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter berdasarkan tanggal manual
    if (dateRange.startDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.sale_date);
        const startDate = new Date(dateRange.startDate);
        return saleDate >= startDate;
      });
    }

    if (dateRange.endDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = new Date(sale.sale_date);
        const endDate = new Date(dateRange.endDate);
        endDate.setHours(23, 59, 59, 999); // Set ke akhir hari
        return saleDate <= endDate;
      });
    }

    // Filter berdasarkan status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((sale) => sale.status === statusFilter);
    }

    // Filter berdasarkan partner
    if (partnerFilter) {
      filtered = filtered.filter(sale =>
        (sale.sale_items || []).some(
          item => (item.product_variants?.partner || 'Tanpa Mitra') === partnerFilter
        )
      );
    }

    // Sort berdasarkan tanggal terbaru
    filtered.sort((a, b) => new Date(b.sale_date) - new Date(a.sale_date));

    setFilteredSales(filtered);
    setCurrentPage(1); // Reset ke halaman pertama
  };

  // Handle view detail
  const handleViewDetail = async (sale) => {
    try {
      const detailData = await SaleService.getById(sale.id);
      setSelectedSale(detailData);
      setShowDetailModal(true);
    } catch (err) {
      console.error("Error loading sale detail:", err);
      setError("Gagal memuat detail penjualan.");
    }
  };

  // Handle delete sale
  const handleDeleteSale = (sale) => {
    setSaleToDelete(sale);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await SaleService.delete(saleToDelete.id);
      setSales(sales.filter((sale) => sale.id !== saleToDelete.id));
      setShowDeleteModal(false);
      setSaleToDelete(null);
      alert("Penjualan berhasil dihapus");
    } catch (err) {
      console.error("Error deleting sale:", err);
      setError("Gagal menghapus penjualan.");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    loadSales(true);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setDateRange({ startDate: "", endDate: "" });
    setStatusFilter("all");
    setTimeFilter("all");
    setPartnerFilter("");
  };

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const currentItems = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <LoadingSpinner message="Memuat data penjualan..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Header */}
        <SalesPageHeader
          onRefresh={handleRefresh}
          onExport={() => setShowExportModal(true)}
          refreshing={refreshing}
        />

        {/* Stats Cards */}
        <SalesStatsCards stats={salesStats} />

        {/* Filters */}
        <SalesFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          dateRange={dateRange}
          setDateRange={handleSetDateRange}
          statusFilter={statusFilter}
          setStatusFilter={handleSetStatusFilter}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          partnerFilter={partnerFilter}
          partners={partners}
          setPartnerFilter={setPartnerFilter}
          onReset={resetFilters}
        />

        {/* Sales Table */}
        <SalesTable
          sales={currentItems}
          onViewDetail={handleViewDetail}
          onDeleteSale={handleDeleteSale}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredSales.length}
        />
      </div>

      {/* Modals */}
      {showDetailModal && selectedSale && (
        <SalesDetailModal
          sale={selectedSale}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedSale(null);
          }}
        />
      )}

      {showDeleteModal && (
        <ConfirmationModal
          title="Hapus Penjualan"
          message={`Apakah Anda yakin ingin menghapus penjualan ${saleToDelete?.order_number}? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setSaleToDelete(null);
          }}
          confirmText="Hapus"
          cancelText="Batal"
          type="danger"
        />
      )}

      {showExportModal && (
        <ExportModal
          sales={filteredSales}
          onClose={() => setShowExportModal(false)}
        />
      )}
    </div>
  );
};

export default SalesPage;

