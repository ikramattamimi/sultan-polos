// ===========================================
// INCOME STATEMENT MODALS
// Modal components untuk Income Statement
// ===========================================

import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  Receipt,
  Plus,
  ShoppingCart,
  Package,
  Loader2
} from 'lucide-react';
import IncomeStatementService from '../services/IncomeStatementService.js';

// ===========================================
// DETAIL MODAL
// ===========================================

export const IncomeStatementDetailModal = ({ statement, onClose, onExport }) => {
  const [calculationDetails, setCalculationDetails] = useState(null);
  const [activeTab, setActiveTab] = useState('summary');
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (statement && activeTab !== 'summary') {
      fetchCalculationDetails();
    }
  }, [statement, activeTab]);

  const fetchCalculationDetails = async () => {
    if (calculationDetails || loadingDetails) return; // Already loaded or loading

    try {
      setLoadingDetails(true);
      const details = await IncomeStatementService.getCalculationDetails(statement.id);
      setCalculationDetails(details);
    } catch (error) {
      console.error('Error fetching calculation details:', error);
      alert('Gagal memuat detail perhitungan');
    } finally {
      setLoadingDetails(false);
    }
  };

  if (!statement) return null;

  const formatted = IncomeStatementService.formatForUI(statement);

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'revenue', label: 'Revenue Details', icon: DollarSign },
    { id: 'HPP', label: 'HPP Details', icon: Package },
    { id: 'expenses', label: 'Expenses Details', icon: Receipt }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">

        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Detail Laporan Laba Rugi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 px-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <SummaryTabContent statement={statement} formatted={formatted} />
          )}

          {/* Revenue Details Tab */}
          {activeTab === 'revenue' && (
            <RevenueDetailsTab
              calculationDetails={calculationDetails}
              loadingDetails={loadingDetails}
            />
          )}

          {/* HPP Details Tab */}
          {activeTab === 'HPP' && (
            <HPPDetailsTab
              calculationDetails={calculationDetails}
              loadingDetails={loadingDetails}
            />
          )}

          {/* Expenses Details Tab */}
          {activeTab === 'expenses' && (
            <ExpensesDetailsTab statement={statement} />
          )}

        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-3 flex justify-end gap-3">
          <button
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

// ===========================================
// TAB CONTENT COMPONENTS
// ===========================================

// Summary Tab Component
const SummaryTabContent = ({ statement, formatted }) => (
  <div className="p-6">
    {/* Summary Info */}
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm font-medium text-gray-600">Periode</p>
          <p className="text-lg font-semibold text-gray-900">{formatted.periode}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Tanggal Dibuat</p>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(statement.created_at).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">Total Expenses</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatted.expense_count} item
          </p>
        </div>
      </div>

      {statement.notes && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">Catatan</p>
          <p className="text-gray-900">{statement.notes}</p>
        </div>
      )}
    </div>

    {/* Financial Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-xl font-bold text-blue-600">{formatted.total_revenue}</p>
          </div>
          <DollarSign className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">HPP</p>
            <p className="text-xl font-bold text-orange-600">{formatted.total_cogs}</p>
          </div>
          <Receipt className="h-8 w-8 text-orange-600" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Gross Profit</p>
            <p className={`text-xl font-bold ${
              statement.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatted.gross_profit}
            </p>
          </div>
          {statement.gross_profit >= 0 ? (
            <TrendingUp className="h-8 w-8 text-green-600" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-600" />
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Operating Expenses</p>
            <p className="text-xl font-bold text-red-600">{formatted.total_expenses}</p>
          </div>
          <FileText className="h-8 w-8 text-red-600" />
        </div>
      </div>
    </div>

    {/* Net Profit Card */}
    <div className={`border-2 rounded-lg p-6 mb-6 ${
      statement.net_profit >= 0
        ? 'border-green-200 bg-green-50'
        : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-medium text-gray-700">Net Profit</p>
          <p className={`text-3xl font-bold ${
            statement.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatted.net_profit}
          </p>
          <p className={`text-sm ${
            statement.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            Margin: {formatted.profit_margin}
          </p>
        </div>
        {statement.net_profit >= 0 ? (
          <TrendingUp className="h-12 w-12 text-green-600" />
        ) : (
          <TrendingDown className="h-12 w-12 text-red-600" />
        )}
      </div>
    </div>

    {/* Calculation Breakdown */}
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Perhitungan</h4>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Total Revenue:</span>
          <span className="font-medium">{formatted.total_revenue}</span>
        </div>
        <div className="flex justify-between">
          <span>- Cost of Goods Sold (HPP):</span>
          <span className="font-medium">({formatted.total_cogs})</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="font-medium">= Gross Profit:</span>
          <span className={`font-bold ${
            statement.gross_profit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatted.gross_profit}
          </span>
        </div>
        <div className="flex justify-between">
          <span>- Operating Expenses:</span>
          <span className="font-medium">({formatted.total_expenses})</span>
        </div>
        <div className="flex justify-between border-t pt-2 border-gray-400">
          <span className="font-bold text-lg">= Net Profit:</span>
          <span className={`font-bold text-lg ${
            statement.net_profit >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {formatted.net_profit}
          </span>
        </div>
      </div>
    </div>
  </div>
);

// Revenue Details Tab Component
const RevenueDetailsTab = ({ calculationDetails, loadingDetails }) => {
  if (loadingDetails) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Memuat detail revenue...</p>
        </div>
      </div>
    );
  }

  if (!calculationDetails?.revenue_details) {
    return (
      <div className="p-6 text-center text-gray-500">
        Tidak ada data revenue detail
      </div>
    );
  }

  const { revenue_details } = calculationDetails;

  return (
    <div className="p-6">
      {/* Revenue Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total Penjualan</p>
              <p className="text-2xl font-bold text-blue-700">{revenue_details.total_sales_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-green-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-700">
                {IncomeStatementService.formatCurrency(revenue_details.total_revenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Rata-rata per Sale</p>
              <p className="text-2xl font-bold text-purple-700">
                {IncomeStatementService.formatCurrency(
                  revenue_details.total_sales_count > 0
                    ? revenue_details.total_revenue / revenue_details.total_sales_count
                    : 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Detail Penjualan</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Harga
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {revenue_details.sales.map((sale, index) => (
              <tr key={sale.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {sale.order_number}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.customer}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {new Date(sale.sale_date).toLocaleDateString('id-ID')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{sale.items_count} item</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {IncomeStatementService.formatCurrency(sale.total_price)}
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
            <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="4" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                Total:
              </td>
              <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                {IncomeStatementService.formatCurrency(revenue_details.total_revenue)}
              </td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

// HPP Details Tab Component
const HPPDetailsTab = ({ calculationDetails, loadingDetails }) => {
  if (loadingDetails) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-600 mx-auto mb-2" />
          <p className="text-gray-600">Memuat detail HPP...</p>
        </div>
      </div>
    );
  }

  if (!calculationDetails?.HPP_details) {
    return (
      <div className="p-6 text-center text-gray-500">
        Tidak ada data HPP detail
      </div>
    );
  }

  const { HPP_details } = calculationDetails;

  return (
    <div className="p-6">
      {/* HPP Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-600">Total Item Terjual</p>
              <p className="text-2xl font-bold text-orange-700">{HPP_details.total_items_sold}</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-600">Total HPP</p>
              <p className="text-2xl font-bold text-red-700">
                {IncomeStatementService.formatCurrency(HPP_details.total_cogs)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Rata-rata HPP per Item</p>
              <p className="text-2xl font-bold text-purple-700">
                {IncomeStatementService.formatCurrency(
                  HPP_details.total_items_sold > 0
                    ? HPP_details.total_cogs / HPP_details.total_items_sold
                    : 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HPP Items Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Detail Item HPP</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Varian
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                HPP/Unit
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga Jual
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total HPP
              </th>
            </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {HPP_details.items.map((item, index) => (
              <tr key={item.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {item.order_number}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.sale_date).toLocaleDateString('id-ID')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.product_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {item.size} - {item.color}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">
                    {IncomeStatementService.formatCurrency(item.hpp)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">
                    {IncomeStatementService.formatCurrency(item.selling_price)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {IncomeStatementService.formatCurrency(item.total_cogs)}
                  </div>
                </td>
              </tr>
            ))}
            </tbody>
            <tfoot className="bg-gray-50">
            <tr>
              <td colSpan="3" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                Total:
              </td>
              <td className="px-6 py-3 text-center text-sm font-bold text-gray-900">
                {HPP_details.total_items_sold}
              </td>
              <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                Total HPP:
              </td>
              <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                {IncomeStatementService.formatCurrency(HPP_details.total_cogs)}
              </td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

// Expenses Details Tab Component
const ExpensesDetailsTab = ({ statement }) => {
  const expenseDetails = statement.income_statement_expense_details || [];
  const totalExpenses = expenseDetails.reduce((sum, exp) => sum + (exp.expense_cost || 0), 0);

  return (
    <div className="p-6">
      {/* Expenses Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center">
            <Receipt className="h-8 w-8 text-red-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-red-600">Total Expense Items</p>
              <p className="text-2xl font-bold text-red-700">{expenseDetails.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-orange-600">Total Expenses</p>
              <p className="text-2xl font-bold text-orange-700">
                {IncomeStatementService.formatCurrency(totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-purple-600">Rata-rata per Expense</p>
              <p className="text-2xl font-bold text-purple-700">
                {IncomeStatementService.formatCurrency(
                  expenseDetails.length > 0 ? totalExpenses / expenseDetails.length : 0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      {expenseDetails.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900">Detail Expenses</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama Expense
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Biaya
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % dari Total Expenses
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {expenseDetails.map((detail, index) => (
                <tr key={detail.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {index + 1}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {detail.expense_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {IncomeStatementService.formatCurrency(detail.expense_cost)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm text-gray-500">
                      {totalExpenses > 0 ? ((detail.expense_cost / totalExpenses) * 100).toFixed(1) : 0}%
                    </div>
                  </td>
                </tr>
              ))}
              </tbody>
              <tfoot className="bg-gray-50">
              <tr>
                <td colSpan="2" className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                  Total:
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                  {IncomeStatementService.formatCurrency(totalExpenses)}
                </td>
                <td className="px-6 py-3 text-right text-sm font-bold text-gray-900">
                  100%
                </td>
              </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Receipt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Tidak ada expenses
          </h3>
          <p className="text-gray-500">
            Tidak ada expenses yang tercatat untuk periode ini.
          </p>
        </div>
      )}
    </div>
  );
};

// ===========================================
// GENERATE MODAL
// ===========================================

export const GenerateIncomeStatementModal = ({ onClose, onGenerate, generating }) => {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  // Set default dates (current month 26 to 25 pattern)
  useEffect(() => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // Default: 26 bulan lalu sampai 25 bulan ini
    const startDate = new Date(currentYear, currentMonth - 1, 26);
    const endDate = new Date(currentYear, currentMonth, 25);

    setFormData({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      notes: `Laporan periode ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`
    });
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.startDate) {
      newErrors.startDate = 'Tanggal mulai harus diisi';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Tanggal akhir harus diisi';
    }

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'Tanggal akhir harus setelah tanggal mulai';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onGenerate(formData.startDate, formData.endDate, formData.notes || null);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const setPresetPeriod = (type) => {
    const currentDate = new Date();
    let startDate, endDate;

    switch (type) {
      case 'current-month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case 'last-month':
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        break;
      case 'current-quarter':
        const currentQuarter = Math.floor(currentDate.getMonth() / 3);
        startDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
        endDate = new Date(currentDate.getFullYear(), (currentQuarter + 1) * 3, 0);
        break;
      case 'custom-period':
      default:
        // 26 bulan lalu - 25 bulan ini (default)
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 26);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 25);
        break;
    }

    setFormData(prev => ({
      ...prev,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      notes: `Laporan periode ${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">

        {/* Modal Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Generate Laporan Laba Rugi
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={generating}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* Quick Preset Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Periode Cepat
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPresetPeriod('current-month')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={generating}
              >
                Bulan Ini
              </button>
              <button
                type="button"
                onClick={() => setPresetPeriod('last-month')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={generating}
              >
                Bulan Lalu
              </button>
              <button
                type="button"
                onClick={() => setPresetPeriod('current-quarter')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={generating}
              >
                Quarter Ini
              </button>
              <button
                type="button"
                onClick={() => setPresetPeriod('custom-period')}
                className="px-3 py-2 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                disabled={generating}
              >
                26-25 (Default)
              </button>
            </div>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                disabled={generating}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.startDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Akhir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                disabled={generating}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                  errors.endDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan (Opsional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={generating}
              rows={3}
              placeholder="Tambahkan catatan untuk laporan ini..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={generating || !formData.startDate || !formData.endDate}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Laporan
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={generating}
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

export default { IncomeStatementDetailModal, GenerateIncomeStatementModal };