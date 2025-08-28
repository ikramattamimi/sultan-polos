// SalesTable Component - Fully Responsive for mobile, tablet, and desktop
import { useState } from "react";
import { SalesPagination, SalesTableRow } from "./index.js";
import { ShoppingBag, MoreVertical, Eye, Trash2 } from "lucide-react";
import UtilityService from "../../../services/UtilityServices.js";

const SalesTable = ({
  sales,
  onViewDetail,
  onDeleteSale,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  onBulkDelete,
}) => {
  const [selectedSales, setSelectedSales] = useState([]);
  const [showActionsFor, setShowActionsFor] = useState(null);

  const isAllSelected = sales.length > 0 && selectedSales.length === sales.length;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedSales(sales.map((s) => s.id));
    } else {
      setSelectedSales([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelectedSales((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) onBulkDelete(selectedSales);
    setSelectedSales([]);
  };

  const toggleActions = (saleId) => {
    setShowActionsFor(showActionsFor === saleId ? null : saleId);
  };

  // Handle card click to show detail (avoid clicking on interactive elements)
  const handleCardClick = (e, sale) => {
    // Don't trigger if clicking on interactive elements
    if (e.target.type === 'checkbox' || 
        e.target.closest('button') || 
        e.target.closest('input')) {
      return;
    }
    onViewDetail(sale);
  };

  // Mobile Card Component (for phones)
  const MobileSalesCard = ({ sale, isSelected, onSelectRow }) => (
    <div 
      className={`border rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 transition-all cursor-pointer hover:shadow-md ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={(e) => handleCardClick(e, sale)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelectRow}
            className="rounded border-gray-300 flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
              {sale.order_number || 'N/A'}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">
              {UtilityService.formatDate(sale.sale_date)}
            </p>
          </div>
        </div>
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleActions(sale.id);
            }}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
          
          {/* Action Menu */}
          {showActionsFor === sale.id && (
            <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetail(sale);
                  setShowActionsFor(null);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center transition-colors"
              >
                <Eye className="h-4 w-4 mr-2" />
                Detail
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSale(sale);
                  setShowActionsFor(null);
                }}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 text-red-600 flex items-center transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {/* Mitra - Only show if exists */}
        {sale.mitra && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Mitra:</span>
            <span className="font-medium text-right truncate max-w-[60%]">{sale.mitra}</span>
          </div>
        )}
        
        {/* Customer */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Customer:</span>
          <span className="font-medium text-right truncate max-w-[60%]">
            {sale.customer || 'Customer Umum'}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Total:</span>
          <span className="font-semibold text-green-600">
            {UtilityService.formatCurrency(sale.total_price)}
          </span>
        </div>

        {/* Status */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Status:</span>
          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Selesai
          </span>
        </div>
      </div>

      {/* Click indicator */}
      <div className="mt-3 pt-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">Klik untuk melihat detail</p>
      </div>
    </div>
  );

  // Tablet Grid Component (for tablets)
  const TabletGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
      {sales.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-base font-medium">Tidak ada data penjualan</p>
          <p className="text-sm">Buat penjualan pertama Anda</p>
        </div>
      ) : (
        sales.map((sale) => (
          <div 
            key={sale.id}
            className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
              selectedSales.includes(sale.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={(e) => handleCardClick(e, sale)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <input
                  type="checkbox"
                  checked={selectedSales.includes(sale.id)}
                  onChange={() => handleSelectRow(sale.id)}
                  className="rounded border-gray-300 flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-base truncate">
                    {sale.order_number || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {UtilityService.formatDate(sale.sale_date)}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetail(sale);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Detail"
                >
                  <Eye className="h-4 w-4 text-gray-500" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSale(sale);
                  }}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {sale.mitra && (
                <div>
                  <span className="text-gray-500">Mitra:</span>
                  <p className="font-medium truncate">{sale.mitra}</p>
                </div>
              )}
              <div>
                <span className="text-gray-500">Customer:</span>
                <p className="font-medium truncate">{sale.customer || 'Customer Umum'}</p>
              </div>
              <div>
                <span className="text-gray-500">Total:</span>
                <p className="font-semibold text-green-600">
                  {UtilityService.formatCurrency(sale.total_price)}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 mt-1">
                  Selesai
                </span>
              </div>
            </div>

            {/* Click indicator */}
            <div className="mt-3 pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">Klik untuk melihat detail</p>
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Desktop Table Component
  const DesktopTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-3 text-center w-12">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={handleSelectAll}
                aria-label="Select all"
                className="rounded border-gray-300"
              />
            </th>
            <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No Order
            </th>
            <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tanggal
            </th>
            <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Mitra
            </th>
            <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 xl:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
              Status
            </th>
            <th className="px-4 xl:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Tidak ada data penjualan</p>
                <p className="text-sm">Buat penjualan pertama Anda</p>
              </td>
            </tr>
          ) : (
            sales.map((sale) => (
              <SalesTableRow
                key={sale.id}
                sale={sale}
                onViewDetail={onViewDetail}
                onDeleteSale={onDeleteSale}
                isSelected={selectedSales.includes(sale.id)}
                onSelectRow={() => handleSelectRow(sale.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            Data Penjualan ({totalItems} item)
          </h3>
          
          {selectedSales.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors duration-200"
                onClick={handleBulkDelete}
              >
                Hapus Terpilih ({selectedSales.length})
              </button>
            </div>
          )}
        </div>

        {/* Mobile: Show selected count */}
        <div className="block sm:hidden">
          {selectedSales.length > 0 && (
            <div className="mt-3 p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">
                {selectedSales.length} item dipilih
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Content - Responsive rendering */}
      {/* Mobile (< 640px) */}
      <div className="block sm:hidden">
        <div className="p-3">
          {sales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-base font-medium">Tidak ada data penjualan</p>
              <p className="text-sm">Buat penjualan pertama Anda</p>
            </div>
          ) : (
            sales.map((sale) => (
              <MobileSalesCard
                key={sale.id}
                sale={sale}
                isSelected={selectedSales.includes(sale.id)}
                onSelectRow={() => handleSelectRow(sale.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Tablet (640px - 1023px) */}
      <div className="hidden sm:block lg:hidden">
        <TabletGrid />
      </div>

      {/* Desktop (>= 1024px) */}
      <div className="hidden lg:block">
        <DesktopTable />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200">
          <SalesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}

      {/* Click outside to close action menu */}
      {showActionsFor && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowActionsFor(null)}
        />
      )}
    </div>
  );
};

export default SalesTable;