// ===========================================
// EXPENSES PAGE
// Page untuk mengelola expenses
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  RefreshCw,
  Download,
  Search,
  DollarSign,
  TrendingUp,
  Calendar,
  Edit2,
  Trash2,
  Eye,
  Filter,
  X,
  AlertCircle
} from 'lucide-react';
import ExpenseService from '../services/ExpenseService.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';

const ExpensesPage = () => {
  // State management
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Summary state
  const [summaryStats, setSummaryStats] = useState(null);

  // Load data on component mount
  useEffect(() => {
    fetchExpenses();
    fetchSummaryStats();
  }, []);

  // ===========================================
  // FETCH METHODS
  // ===========================================

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ExpenseService.getAll(100, 0); // Get more for filtering
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Gagal memuat data expenses. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaryStats = async () => {
    try {
      // Get current month stats
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const stats = await ExpenseService.calculateTotalExpenses(
        startOfMonth.toISOString().split('T')[0],
        endOfMonth.toISOString().split('T')[0]
      );
      setSummaryStats(stats);
    } catch (err) {
      console.error('Error fetching summary stats:', err);
    }
  };

  // ===========================================
  // ACTION HANDLERS
  // ===========================================

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchExpenses();
    await fetchSummaryStats();
    setRefreshing(false);
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await ExpenseService.create(expenseData);
      await fetchExpenses();
      await fetchSummaryStats();
      setShowAddModal(false);
      alert('Expense berhasil ditambahkan!');
    } catch (err) {
      console.error('Error adding expense:', err);
      throw new Error('Gagal menambahkan expense');
    }
  };

  const handleEditExpense = async (id, expenseData) => {
    try {
      await ExpenseService.update(id, expenseData);
      await fetchExpenses();
      await fetchSummaryStats();
      setShowEditModal(false);
      setSelectedExpense(null);
      alert('Expense berhasil diupdate!');
    } catch (err) {
      console.error('Error updating expense:', err);
      throw new Error('Gagal mengupdate expense');
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus expense ini?')) {
      try {
        await ExpenseService.delete(id);
        await fetchExpenses();
        await fetchSummaryStats();
        alert('Expense berhasil dihapus!');
      } catch (err) {
        console.error('Error deleting expense:', err);
        alert('Gagal menghapus expense');
      }
    }
  };

  const handleExportExpenses = async () => {
    try {
      const exportData = await ExpenseService.exportExpenses();

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `expenses-export-${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Error exporting expenses:', err);
      alert('Gagal export expenses');
    }
  };

  // ===========================================
  // FILTERING & SEARCH
  // ===========================================

  const getFilteredExpenses = () => {
    let filtered = expenses;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(expense =>
        expense.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(expense => expense.status === statusFilter);
    }

    return filtered;
  };

  // ===========================================
  // PAGINATION
  // ===========================================

  const filteredExpenses = getFilteredExpenses();
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  // ===========================================
  // LOADING STATE
  // ===========================================

  if (loading && expenses.length === 0) {
    return <LoadingSpinner message="Memuat data expenses..." />;
  }

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <ExpensesHeader
          onRefresh={handleRefresh}
          onAdd={() => setShowAddModal(true)}
          onExport={handleExportExpenses}
          refreshing={refreshing}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}

        {/* Summary Stats */}
        {summaryStats && (
          <SummaryStatsCards stats={summaryStats} />
        )}

        {/* Search & Filter */}
        <SearchAndFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
          totalResults={filteredExpenses.length}
        />

        {/* Expenses Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Receipt className="h-5 w-5 mr-2 text-blue-600" />
              Daftar Expenses
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredExpenses.length} expenses ditemukan
            </p>
          </div>

          {filteredExpenses.length > 0 ? (
            <>
              <ExpensesTable
                expenses={currentExpenses}
                onEdit={(expense) => {
                  setSelectedExpense(expense);
                  setShowEditModal(true);
                }}
                onDelete={handleDeleteExpense}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <EmptyState
              onAdd={() => setShowAddModal(true)}
              hasSearch={searchQuery || statusFilter !== 'all'}
            />
          )}
        </div>

        {/* Modals */}
        {showAddModal && (
          <ExpenseModal
            mode="add"
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddExpense}
          />
        )}

        {showEditModal && selectedExpense && (
          <ExpenseModal
            mode="edit"
            expense={selectedExpense}
            onClose={() => {
              setShowEditModal(false);
              setSelectedExpense(null);
            }}
            onSubmit={(data) => handleEditExpense(selectedExpense.id, data)}
          />
        )}
      </div>
    </div>
  );
};

// ===========================================
// SUB COMPONENTS
// ===========================================

// Header Component
const ExpensesHeader = ({ onRefresh, onAdd, onExport, refreshing }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Receipt className="mr-3 text-blue-600" />
          Kelola Expenses
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola dan pantau semua pengeluaran operasional
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>

        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>

        <button
          onClick={onAdd}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Tambah Expense
        </button>
      </div>
    </div>
  </div>
);

// Summary Stats Component
const SummaryStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <DollarSign className="h-8 w-8 text-red-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Bulan Ini</p>
          <p className="text-2xl font-bold text-gray-900">
            {ExpenseService.formatCurrency(stats.total_amount)}
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <Receipt className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Jumlah Expenses</p>
          <p className="text-2xl font-bold text-gray-900">{stats.expense_count}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Rata-rata</p>
          <p className="text-2xl font-bold text-gray-900">
            {ExpenseService.formatCurrency(stats.average_amount)}
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Search and Filter Component
const SearchAndFilter = ({
                           searchQuery,
                           onSearchChange,
                           statusFilter,
                           onStatusFilterChange,
                           showFilters,
                           onToggleFilters,
                           totalResults
                         }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search Input */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari nama expense..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Toggle */}
      <button
        onClick={onToggleFilters}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filter
      </button>
    </div>

    {/* Filter Options */}
    {showFilters && (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>
    )}

    {/* Results Count */}
    <div className="mt-4 text-sm text-gray-600">
      Menampilkan {totalResults} hasil
    </div>
  </div>
);

// Table Component
const ExpensesTable = ({ expenses, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Nama Expense
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Biaya
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Status
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Tanggal
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Aksi
        </th>
      </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
      {expenses.map((expense) => {
        const formatted = ExpenseService.formatForUI(expense);
        return (
          <tr key={expense.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {expense.name}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-semibold text-gray-900">
                {formatted.cost}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  expense.status === 'active' ? 'bg-green-100 text-green-800' :
                    expense.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                }`}>
                  {formatted.status_label}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                {formatted.created_date}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Edit"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  </div>
);

// Empty State Component
const EmptyState = ({ onAdd, hasSearch }) => (
  <div className="text-center py-12">
    <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {hasSearch ? 'Tidak ada hasil ditemukan' : 'Belum ada expenses'}
    </h3>
    <p className="text-gray-500 mb-6">
      {hasSearch
        ? 'Coba ubah kata kunci pencarian atau filter.'
        : 'Mulai dengan menambahkan expense pertama Anda.'
      }
    </p>
    {!hasSearch && (
      <button
        onClick={onAdd}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Tambah Expense Pertama
      </button>
    )}
  </div>
);

// Pagination Component (reuse from previous)
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
    <div className="flex-1 flex justify-between sm:hidden">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-gray-700">
          Halaman <span className="font-medium">{currentPage}</span> dari{' '}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                page === currentPage
                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </nav>
      </div>
    </div>
  </div>
);

// Expense Modal Component
const ExpenseModal = ({ mode, expense, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: expense?.name || '',
    cost: expense?.cost || '',
    status: expense?.status || 'active'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama expense harus diisi';
    }

    if (!formData.cost || formData.cost <= 0) {
      newErrors.cost = 'Biaya harus lebih besar dari 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({
        name: formData.name.trim(),
        cost: parseFloat(formData.cost),
        status: formData.status
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">

        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {mode === 'add' ? 'Tambah Expense' : 'Edit Expense'}
          </h3>
          <button
            onClick={onClose}
            disabled={submitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Expense <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={submitting}
              placeholder="Masukkan nama expense"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Cost Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biaya <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.cost}
              onChange={(e) => handleInputChange('cost', e.target.value)}
              disabled={submitting}
              placeholder="0"
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                errors.cost ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cost && (
              <p className="mt-1 text-xs text-red-600">{errors.cost}</p>
            )}
          </div>

          {/* Status Select */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              disabled={submitting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <option value="active">Aktif</option>
              <option value="inactive">Tidak Aktif</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !formData.name.trim() || !formData.cost}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === 'add' ? 'Menambahkan...' : 'Mengupdate...'}
                </>
              ) : (
                <>
                  {mode === 'add' ? (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Tambah
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Update
                    </>
                  )}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpensesPage;