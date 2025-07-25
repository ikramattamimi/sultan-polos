
// SalesFilters Component
import {Filter, Search} from "lucide-react";

const timeFilterOptions = [
  { value: 'all', label: 'Semua Waktu' },
  { value: 'today', label: 'Hari Ini' },
  { value: 'this_week', label: 'Minggu Ini' },
  { value: 'this_month', label: 'Bulan Ini' },
  { value: 'last_3_months', label: '3 Bulan Terakhir' },
];

const SalesFilter = ({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  timeFilter = 'all',
  setTimeFilter = () => {},
  onReset,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    {/* Header utama */}
    <div className="mb-4 flex items-center">
      <Filter className="h-5 w-5 mr-2" />
      <h3 className="text-lg font-semibold text-gray-900">Filter</h3>
    </div>
    {/* Bagian 1: Filter waktu */}
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 items-center">
        {timeFilterOptions.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTimeFilter(opt.value)}
            className={`px-3 py-1 rounded border text-sm font-medium transition-colors duration-150 ${timeFilter === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
          >
            {opt.label}
          </button>
        ))}
        <button
          onClick={onReset}
          className="ml-auto text-sm text-blue-600 hover:text-blue-800"
        >
          Reset Filter
        </button>
      </div>
    </div>

    {/* Bagian 2: Filter custom */}
    <div>
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
  </div>
);

export default SalesFilter;