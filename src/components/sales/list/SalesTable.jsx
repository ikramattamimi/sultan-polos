// SalesTable Component
import { useState } from "react";
import { SalesPagination, SalesTableRow } from "./index.js";
import {ShoppingBag} from "lucide-react";


const SalesTable = ({
  sales,
  onViewDetail,
  onDeleteSale,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  onBulkDelete, // opsional, bisa ditambahkan di parent
}) => {
  const [selectedSales, setSelectedSales] = useState([]);

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

  // Calculate the number of columns dynamically
  const columns = [
    "checkbox",
    "No Order",
    "Tanggal",
    "Customer",
    "Total",
    "Status",
    "Aksi"
  ];
  const colSpanCount = columns.length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Data Penjualan ({totalItems} item)
        </h3>
        {selectedSales.length > 0 && (
          <div className="flex gap-2">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
              onClick={handleBulkDelete}
            >
              Hapus Terpilih ({selectedSales.length})
            </button>
            {/* Tambahkan aksi lain di sini jika perlu */}
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={colSpanCount} className="px-6 py-8 text-center text-gray-500">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <SalesPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default SalesTable;