// SalesPageHeader Component
import React from "react";
import { Download, Plus, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const SalesPageHeader = ({ onRefresh, onExport, refreshing }) => (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
    <div className="flex flex-col gap-4">
      {/* Header Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start">
          <ShoppingBag className="mr-2 sm:mr-3 text-blue-600 h-6 w-6 sm:h-8 sm:w-8" />
          <span className="text-xl sm:text-3xl">Daftar Penjualan</span>
        </h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Kelola dan pantau semua transaksi penjualan
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Primary Action - Full width on mobile */}
        <Link
          to="create"
          className="flex items-center justify-center px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors order-1 sm:order-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          <span className="font-medium">Buat Penjualan</span>
        </Link>

        {/* Secondary Actions - Grouped on mobile */}
        <div className="flex gap-2 order-2 sm:order-1">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-3 sm:py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 sm:mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline ml-2">Refresh</span>
          </button>

          <button
            onClick={onExport}
            className="flex-1 sm:flex-none flex items-center justify-center px-3 sm:px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline ml-2">Export</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SalesPageHeader;