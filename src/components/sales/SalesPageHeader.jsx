// SalesPageHeader Component
import React from "react";
import { Download, Plus, RefreshCw, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const SalesPageHeader = ({ onRefresh, onExport, refreshing }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <ShoppingBag className="mr-3 text-blue-600" />
          Daftar Penjualan
        </h1>
        <p className="text-gray-600 mt-1">
          Kelola dan pantau semua transaksi penjualan
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onRefresh}
          disabled={refreshing}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>

        <button
          onClick={onExport}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>

        <Link
          to="create"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Buat Penjualan
        </Link>
      </div>
    </div>
  </div>
);

export default SalesPageHeader;
