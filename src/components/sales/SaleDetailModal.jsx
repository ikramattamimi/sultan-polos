// ===========================================
// KOMPONEN MODAL UNTUK SALES
// ===========================================

import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Package, 
  DollarSign, 
  Download,
  FileText,
  Printer,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import UtilityService from '../../services/UtilityServices.js';

// ===========================================
// SALE DETAIL MODAL
// ===========================================

const SaleDetailModal = ({ sale, onClose }) => {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">
              Detail Penjualan #{sale.order_number}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Sale Info */}
          <SaleInfo sale={sale} />

          {/* Sale Items */}
          <SaleItems items={sale.sale_items || []} />

          {/* Sale Summary */}
          <SaleSummary sale={sale} />
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// SaleInfo Component
const SaleInfo = ({ sale }) => (
  <div className="bg-gray-50 rounded-lg p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Penjualan</h3>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="flex items-center">
        <FileText className="h-5 w-5 text-blue-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Nomor Order</p>
          <p className="text-lg font-semibold text-gray-900">{sale.order_number}</p>
        </div>
      </div>

      <div className="flex items-center">
        <Calendar className="h-5 w-5 text-green-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Tanggal Penjualan</p>
          <p className="text-lg font-semibold text-gray-900">
            {UtilityService.formatDate(sale.sale_date)}
          </p>
          <p className="text-sm text-gray-500">
            {UtilityService.formatTime(sale.sale_date)}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <User className="h-5 w-5 text-purple-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Pelanggan</p>
          <p className="text-lg font-semibold text-gray-900">
            {sale.customer || 'Customer Umum'}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <DollarSign className="h-5 w-5 text-green-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Pembayaran</p>
          <p className="text-xl font-bold text-green-600">
            {UtilityService.formatCurrency(sale.total_price)}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Status</p>
          <span className="inline-flex px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <Package className="h-5 w-5 text-orange-600 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Item</p>
          <p className="text-lg font-semibold text-gray-900">
            {sale.sale_items?.length || 0} produk
          </p>
        </div>
      </div>
    </div>
  </div>
);

// SaleItems Component
const SaleItems = ({ items }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Penjualan</h3>
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Produk
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Varian
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mitra
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Harga Satuan
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Print
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((item, index) => (
            <SaleItemRow key={index} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// SaleItemRow Component
const SaleItemRow = ({ item }) => (
  <tr>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="font-medium text-gray-900">
        {item.product_variants?.products?.name || 'Produk'}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {item.product_variants?.sizes?.name || 'N/A'} - {item.product_variants?.colors?.name || 'N/A'}
      </div>
      {/* <div className="text-xs text-gray-500">
        SKU: {item.product_variants?.id || 'N/A'}
      </div> */}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {item.product_variants?.partner || '-'}
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <span className="text-sm text-gray-900">
        {UtilityService.formatCurrency(item.unit_price)}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-center">
      {item.is_printed ? (
        <div>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Ya
          </span>
          {item.print_types && (
            <div className="text-xs text-gray-500 mt-1">
              {item.print_types.name}
            </div>
          )}
        </div>
      ) : (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          Tidak
        </span>
      )}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right">
      <span className="text-sm font-semibold text-green-600">
        {UtilityService.formatCurrency(item.actual_price)}
      </span>
    </td>
  </tr>
);

// SaleSummary Component
const SaleSummary = ({ sale }) => {
  const subtotal = sale.sale_items?.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0) || 0;
  const printTotal = sale.sale_items?.reduce((sum, item) => {
    if (item.is_printed && item.print_types) {
      return sum + (item.print_types.price * item.quantity);
    }
    return sum;
  }, 0) || 0;

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Pembayaran</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal Produk:</span>
          <span className="text-gray-900">{UtilityService.formatCurrency(subtotal)}</span>
        </div>
        
        {printTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Print:</span>
            <span className="text-gray-900">{UtilityService.formatCurrency(printTotal)}</span>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-gray-900">Total Pembayaran:</span>
            <span className="text-green-600">{UtilityService.formatCurrency(sale.total_price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};


// Export components
export default SaleDetailModal;