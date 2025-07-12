// ===========================================
// INCOME STATEMENT PAGE
// Page untuk menampilkan laporan laba rugi
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Plus,
  RefreshCw,
  Download,
  Calendar,
  DollarSign,
  TrendingDown,
  BarChart3,
  FileText,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';
import IncomeStatementService from '../services/IncomeStatementService.js';
import ExpenseService from '../services/ExpenseService.js';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { IncomeStatementDetailModal, GenerateIncomeStatementModal } from '../components/IncomeStatementModals.jsx';

const IncomeStatementPage = () => {
  // State management
  const [incomeStatements, setIncomeStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStatement, setSelectedStatement] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Summary stats
  const [summaryStats, setSummaryStats] = useState(null);

  // Load data on component mount
  useEffect(() => {
    fetchIncomeStatements();
    fetchSummaryStats();
  }, []);

  // ===========================================
  // FETCH METHODS
  // ===========================================

  const fetchIncomeStatements = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await IncomeStatementService.getAll(50, 0);
      setIncomeStatements(data);
    } catch (err) {
      console.error('Error fetching income statements:', err);
      setError('Gagal memuat laporan laba rugi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSummaryStats = async () => {
    try {
      const stats = await IncomeStatementService.getSummaryStats();
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
    await fetchIncomeStatements();
    await fetchSummaryStats();
    setRefreshing(false);
  };

  const handleGenerateCurrentPeriod = async () => {
    try {
      setGenerating(true);
      const currentDate = new Date();
      const periodNote = `Laporan otomatis periode ${currentDate.toLocaleDateString('id-ID')}`;

      await IncomeStatementService.generateCurrentPeriodStatement(periodNote);
      await handleRefresh();

      alert('Laporan laba rugi berhasil di-generate!');
    } catch (err) {
      console.error('Error generating income statement:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setGenerating(false);
    }
  };

  const handleViewDetail = async (id) => {
    try {
      setLoading(true);
      const statement = await IncomeStatementService.getById(id);
      setSelectedStatement(statement);
      setShowDetailModal(true);
    } catch (err) {
      console.error('Error fetching statement detail:', err);
      alert('Gagal memuat detail laporan.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      try {
        await IncomeStatementService.delete(id);
        await handleRefresh();
        alert('Laporan berhasil dihapus.');
      } catch (err) {
        console.error('Error deleting statement:', err);
        alert('Gagal menghapus laporan.');
      }
    }
  };

  const handleExport = async (id) => {
    try {
      const exportData = await IncomeStatementService.exportIncomeStatement(id);

      // Create downloadable file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

      const exportFileDefaultName = `laporan-laba-rugi-${exportData.summary.periode}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } catch (err) {
      console.error('Error exporting statement:', err);
      alert('Gagal export laporan.');
    }
  };

  // ===========================================
  // PAGINATION
  // ===========================================

  const totalPages = Math.ceil(incomeStatements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentStatements = incomeStatements.slice(startIndex, endIndex);

  // ===========================================
  // LOADING STATE
  // ===========================================

  if (loading && incomeStatements.length === 0) {
    return <LoadingSpinner message="Memuat laporan laba rugi..." />;
  }

  // ===========================================
  // RENDER
  // ===========================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Page Header */}
        <IncomeStatementHeader
          onRefresh={handleRefresh}
          onGenerate={handleGenerateCurrentPeriod}
          onOpenGenerateModal={() => setShowGenerateModal(true)}
          refreshing={refreshing}
          generating={generating}
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

        {/* Summary Stats Cards */}
        {summaryStats && (
          <SummaryStatsCards stats={summaryStats} />
        )}

        {/* Income Statements Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-blue-600" />
              Daftar Laporan Laba Rugi
            </h2>
            <p className="text-gray-600 mt-1">
              {incomeStatements.length} laporan tersimpan
            </p>
          </div>

          {incomeStatements.length > 0 ? (
            <>
              <IncomeStatementTable
                statements={currentStatements}
                onViewDetail={handleViewDetail}
                onDelete={handleDelete}
                onExport={handleExport}
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
            <EmptyState onGenerate={handleGenerateCurrentPeriod} />
          )}
        </div>

        {/* Modals */}
        {showDetailModal && selectedStatement && (
          <IncomeStatementDetailModal
            statement={selectedStatement}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedStatement(null);
            }}
            onExport={() => handleExport(selectedStatement.id)}
          />
        )}

        {showGenerateModal && (
          <GenerateIncomeStatementModal
            onClose={() => setShowGenerateModal(false)}
            onGenerate={async (startDate, endDate, notes) => {
              try {
                setGenerating(true);
                await IncomeStatementService.generateIncomeStatement(startDate, endDate, notes);
                await handleRefresh();
                setShowGenerateModal(false);
                alert('Laporan berhasil di-generate!');
              } catch (err) {
                console.error('Error generating statement:', err);
                alert(`Error: ${err.message}`);
              } finally {
                setGenerating(false);
              }
            }}
            generating={generating}
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
const IncomeStatementHeader = ({ onRefresh, onGenerate, onOpenGenerateModal, refreshing, generating }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <TrendingUp className="mr-3 text-blue-600" />
          Laporan Laba Rugi
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola dan pantau laporan laba rugi perusahaan
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
          onClick={onOpenGenerateModal}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Generate Custom
        </button>

        <button
          onClick={onGenerate}
          disabled={generating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {generating ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Generate Periode Ini
        </button>
      </div>
    </div>
  </div>
);

// Summary Stats Component
const SummaryStatsCards = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <FileText className="h-8 w-8 text-blue-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Laporan</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_reports}</p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <DollarSign className="h-8 w-8 text-green-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Rata-rata Revenue</p>
          <p className="text-2xl font-bold text-gray-900">
            {IncomeStatementService.formatCurrency(stats.avg_revenue)}
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Rata-rata Profit</p>
          <p className={`text-2xl font-bold ${stats.avg_profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {IncomeStatementService.formatCurrency(stats.avg_profit)}
          </p>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <BarChart3 className="h-8 w-8 text-orange-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Rata-rata Margin</p>
          <p className={`text-2xl font-bold ${stats.avg_margin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {stats.avg_margin}%
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Table Component
const IncomeStatementTable = ({ statements, onViewDetail, onDelete, onExport }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Periode
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Revenue
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          HPP
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Expenses
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Net Profit
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Margin
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Dibuat
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Aksi
        </th>
      </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
      {statements.map((statement) => {
        const formatted = IncomeStatementService.formatForUI(statement);
        return (
          <tr key={statement.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {formatted.periode}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{formatted.total_revenue}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{formatted.total_cogs}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">{formatted.total_expenses}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className={`text-sm font-medium ${
                formatted.profit_status === 'profit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatted.net_profit}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className={`text-sm ${
                formatted.profit_status === 'profit' ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatted.profit_margin}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-500">
                {new Date(statement.created_at).toLocaleDateString('id-ID')}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewDetail(statement.id)}
                  className="text-blue-600 hover:text-blue-900"
                  title="Lihat Detail"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onExport(statement.id)}
                  className="text-green-600 hover:text-green-900"
                  title="Export"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(statement.id)}
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
const EmptyState = ({ onGenerate }) => (
  <div className="text-center py-12">
    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      Belum ada laporan laba rugi
    </h3>
    <p className="text-gray-500 mb-6">
      Mulai dengan membuat laporan laba rugi pertama Anda.
    </p>
    <button
      onClick={onGenerate}
      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="h-4 w-4 mr-2" />
      Generate Laporan Pertama
    </button>
  </div>
);

// Pagination Component
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
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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

export default IncomeStatementPage;