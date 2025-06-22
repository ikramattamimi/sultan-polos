
// SalesFilters Component
import {Filter, Search} from "lucide-react";

const SalesFilter = ({
                        searchQuery,
                        setSearchQuery,
                        dateRange,
                        setDateRange,
                        statusFilter,
                        setStatusFilter,
                        onReset,
                      }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
        <Filter className="h-5 w-5 mr-2" />
        Filter Penjualan
      </h3>
      <button
        onClick={onReset}
        className="text-sm text-blue-600 hover:text-blue-800"
      >
        Reset Filter
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Start Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Mulai
        </label>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* End Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tanggal Akhir
        </label>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Semua Status</option>
          <option value="completed">Selesai</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

    </div>
    {/* Search */}
    <div className="relative mt-5">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Cari nomor order atau pelanggan..."
      />
    </div>
  </div>
);

export default SalesFilter;