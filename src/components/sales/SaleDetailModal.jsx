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
import SaleService from '../../services/SaleService.js';
import PriceInput from '../ui/forms/PriceInput.jsx';

// ===========================================
// SALE DETAIL MODAL
// ===========================================

const SaleDetailModal = ({ sale, onClose }) => {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start md:items-center justify-center p-2 md:p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[98vh] md:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900 truncate mr-2">
              Detail Penjualan #{sale.order_number}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 flex-shrink-0 p-1"
            >
              <X className="h-5 w-5 md:h-6 md:w-6" />
            </button>
          </div>
        </div>

        <div className="p-3 md:p-6">
          {/* Sale Info */}
          <SaleInfo sale={sale} />

          {/* Sale Items */}
          <SaleItems items={sale.sale_items || []} />

          {/* Sale Summary */}
          <SaleSummary sale={sale} />
          
          {/* Payment Section */}
          <PaymentSection sale={sale} />
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 md:px-6 py-3 md:py-4">
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors w-full sm:w-auto order-2 sm:order-1"
            >
              Tutup
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center w-full sm:w-auto order-1 sm:order-2"
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
  <div className="bg-gray-50 rounded-lg p-3 md:p-6 mb-4 md:mb-6">
    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Informasi Penjualan</h3>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
      <div className="flex items-center">
        <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600 mr-2 md:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Nomor Order</p>
          <p className="text-sm md:text-lg font-semibold text-gray-900 truncate">{sale.order_number}</p>
        </div>
      </div>

      <div className="flex items-center">
        <Calendar className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2 md:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Tanggal Penjualan</p>
          <p className="text-sm md:text-lg font-semibold text-gray-900">
            {UtilityService.formatDate(sale.sale_date)}
          </p>
          <p className="text-xs md:text-sm text-gray-500">
            {UtilityService.formatTime(sale.sale_date)}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600 mr-2 md:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Pelanggan</p>
          <p className="text-sm md:text-lg font-semibold text-gray-900 truncate">
            {sale.customer || 'Customer Umum'}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2 md:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Total Pembayaran</p>
          <p className="text-lg md:text-xl font-bold text-green-600">
            {UtilityService.formatCurrency(sale.total_price)}
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-600 mr-2 md:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Status</p>
          <span className="inline-flex px-2 py-1 text-xs md:text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        </div>
      </div>

      <div className="flex items-center">
        <Package className="h-4 w-4 md:h-5 md:w-5 text-orange-600 mr-2 md:mr-3 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm font-medium text-gray-600">Total Item</p>
          <p className="text-sm md:text-lg font-semibold text-gray-900">
            {sale.sale_items?.length || 0} produk
          </p>
        </div>
      </div>
    </div>
  </div>
);

// SaleItems Component
const SaleItems = ({ items }) => (
  <div className="mb-4 md:mb-6">
    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Item Penjualan</h3>
    
    {/* Mobile Card View */}
    <div className="md:hidden space-y-3">
      {items.map((item, index) => (
        <SaleItemCard key={index} item={item} />
      ))}
    </div>

    {/* Tablet Card View - 2 columns */}
    <div className="hidden md:block lg:hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <SaleItemCardTablet key={index} item={item} />
        ))}
      </div>
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto">
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

// Mobile Sale Item Card Component
const SaleItemCard = ({ item }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-medium text-gray-900 text-sm leading-tight">
        {item.product_variants?.products?.name || 'Produk'}
      </h4>
      <span className="text-sm font-semibold text-green-600 ml-2 flex-shrink-0">
        {UtilityService.formatCurrency(item.actual_price)}
      </span>
    </div>
    
    <div className="space-y-1.5 text-xs text-gray-600">
      <div className="flex justify-between">
        <span>Varian:</span>
        <span className="text-right">{item.product_variants?.sizes?.name || 'N/A'} - {item.product_variants?.colors?.name || 'N/A'}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Mitra:</span>
        <span className="text-right">{item.product_variants?.products?.partner || '-'}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Qty:</span>
        <span className="font-medium">{item.quantity}</span>
      </div>
      
      <div className="flex justify-between">
        <span>Harga Satuan:</span>
        <span>{UtilityService.formatCurrency(item.unit_price)}</span>
      </div>
      
      <div className="flex justify-between items-center">
        <span>Print:</span>
        <div className="text-right">
          {item.is_printed ? (
            <div>
              <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Ya
              </span>
              {item.print_types && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.print_types.name}
                </div>
              )}
            </div>
          ) : (
            <span className="inline-flex px-1.5 py-0.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              Tidak
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// Tablet Sale Item Card Component
const SaleItemCardTablet = ({ item }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-medium text-gray-900 text-base leading-tight">
        {item.product_variants?.products?.name || 'Produk'}
      </h4>
      <span className="text-lg font-semibold text-green-600 ml-3 flex-shrink-0">
        {UtilityService.formatCurrency(item.actual_price)}
      </span>
    </div>
    
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div>
        <span className="text-gray-600">Varian:</span>
        <div className="font-medium text-gray-900">
          {item.product_variants?.sizes?.name || 'N/A'} - {item.product_variants?.colors?.name || 'N/A'}
        </div>
      </div>
      
      <div>
        <span className="text-gray-600">Mitra:</span>
        <div className="font-medium text-gray-900">
          {item.product_variants?.products?.partner || '-'}
        </div>
      </div>
      
      <div>
        <span className="text-gray-600">Qty:</span>
        <div className="font-medium text-gray-900">{item.quantity}</div>
      </div>
      
      <div>
        <span className="text-gray-600">Harga Satuan:</span>
        <div className="font-medium text-gray-900">
          {UtilityService.formatCurrency(item.unit_price)}
        </div>
      </div>
      
      <div className="col-span-2">
        <span className="text-gray-600">Print:</span>
        <div className="mt-1">
          {item.is_printed ? (
            <div className="flex items-center space-x-2">
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                Ya
              </span>
              {item.print_types && (
                <span className="text-sm text-gray-600">
                  {item.print_types.name}
                </span>
              )}
            </div>
          ) : (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
              Tidak
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

// SaleItemRow Component (unchanged for desktop)
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
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="text-sm text-gray-900">
        {item.product_variants?.products?.partner || '-'}
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
    <div className="bg-gray-50 rounded-lg p-3 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Ringkasan Pembayaran</h3>
      
      <div className="space-y-2 md:space-y-3">
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600">Subtotal Produk:</span>
          <span className="text-gray-900 font-medium">{UtilityService.formatCurrency(subtotal)}</span>
        </div>
        
        {printTotal > 0 && (
          <div className="flex justify-between text-sm md:text-base">
            <span className="text-gray-600">Total Print:</span>
            <span className="text-gray-900 font-medium">{UtilityService.formatCurrency(printTotal)}</span>
          </div>
        )}
        
        <div className="border-t pt-2 md:pt-3">
          <div className="flex justify-between text-base md:text-lg font-bold">
            <span className="text-gray-900">Total Pembayaran:</span>
            <span className="text-green-600">{UtilityService.formatCurrency(sale.total_price)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Section
const PaymentSection = ({ sale }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [updating, setUpdating] = useState(false);
  const [localSale, setLocalSale] = useState(sale);

  const total = Number(localSale.total_price) || 0;
  const paid = Number(localSale.payment_amount) || 0;
  const remain = Math.max(0, total - paid);
  const status = localSale.status || (paid >= total ? 'completed' : 'pending');

  const statusBadge = (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
      status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
    }`}>
      {status === 'completed' ? 'Selesai' : 'Pending'}
    </span>
  );

  const handleAddPayment = async () => {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      alert('Masukkan jumlah pembayaran yang valid');
      return;
    }
    if (amt > remain) {
      if (!window.confirm('Jumlah melebihi sisa. Lanjutkan untuk melunasi?')) return;
    }

    try {
      setUpdating(true);
      const updated = await SaleService.addPayment(localSale.id, amt, date);
      const refreshed = await SaleService.getById(localSale.id);
      setLocalSale(refreshed);
      setAmount('');
      alert('Pembayaran berhasil ditambahkan');
    } catch (e) {
      console.error('Error add payment:', e);
      alert('Gagal menambahkan pembayaran');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mt-4 md:mt-6 bg-gray-50 rounded-lg p-3 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Pembayaran</h3>
      
      {/* Payment Summary - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
        <div>
          <p className="text-xs md:text-sm text-gray-600">Total</p>
          <p className="text-sm md:text-lg font-bold text-gray-900">{UtilityService.formatCurrency(total)}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-600">Sudah Dibayar</p>
          <p className="text-sm md:text-lg font-bold text-green-600">{UtilityService.formatCurrency(paid)}</p>
        </div>
        <div>
          <p className="text-xs md:text-sm text-gray-600">Sisa</p>
          <p className="text-sm md:text-lg font-bold text-orange-600">{UtilityService.formatCurrency(remain)}</p>
        </div>
        <div className="flex items-center justify-start md:justify-end col-span-2 md:col-span-1">{statusBadge}</div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2">Riwayat Pembayaran</p>
        <div className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-40 md:max-h-48 overflow-y-auto">
          {(localSale.payment_histories || []).length === 0 ? (
            <div className="p-3 text-sm text-gray-500 text-center">Belum ada pembayaran</div>
          ) : (
            (localSale.payment_histories || [])
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map(ph => (
                <div key={ph.id} className="flex items-center justify-between p-3">
                  <span className="text-xs md:text-sm text-gray-600">{UtilityService.formatDate(ph.date)}</span>
                  <span className="font-medium text-xs md:text-sm text-gray-900">{UtilityService.formatCurrency(ph.payment)}</span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Payment Form - Responsive Layout */}
      <div className="space-y-3 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
        <div>
          <label className="block text-xs md:text-sm text-gray-700 mb-1 font-medium">Tanggal Pembayaran</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={updating}
          />
        </div>
        <div>
          <label className="block text-xs md:text-sm text-gray-700 mb-1 font-medium">Jumlah Pembayaran</label>
          <PriceInput
            value={amount}
            onChange={setAmount}
            placeholder="0"
            disabled={updating}
            className="text-sm"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleAddPayment}
            disabled={updating || remain <= 0}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {updating ? 'Menyimpan...' : 'Tambah Pembayaran'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Export components
export default SaleDetailModal;