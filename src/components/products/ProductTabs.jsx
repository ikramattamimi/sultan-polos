import React from 'react';
import { X } from 'lucide-react';

const ProductTabs = ({
  activeTab,
  onTabChange,
  groupedProducts,
  totalSearchResults,
  filteredCount,
  searchQuery,
  onClearSearch,
}) => {
  return (
    <>
      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-1">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => onTabChange('all')}
            className={`flex-shrink-0 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 relative ${
              activeTab === 'all'
                ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="flex items-center gap-3">
              Semua Produk
              <span
                className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold shadow-md border-2 ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-600 border-blue-200 shadow-blue-200/50'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-500/30'
                }`}
              >
                {totalSearchResults}
              </span>
            </span>
          </button>

          {Object.entries(groupedProducts || {}).map(([typeName, typeProducts]) => (
            <button
              key={typeName}
              onClick={() => onTabChange(typeName)}
              className={`flex-shrink-0 px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 relative ${
                activeTab === typeName
                  ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-3">
                {typeName}
                <span
                  className={`inline-flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full text-xs font-bold shadow-md border-2 ${
                    activeTab === typeName
                      ? 'bg-white text-blue-600 border-blue-200 shadow-blue-200/50'
                      : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-400 shadow-blue-500/30'
                  }`}
                >
                  {typeProducts.length}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Header untuk tab aktif dengan search info */}
      {(activeTab !== 'all' || searchQuery) && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                {activeTab === 'all'
                  ? `Hasil Pencarian "${searchQuery}"`
                  : `Produk Tipe ${activeTab}${searchQuery ? ` - "${searchQuery}"` : ''}`}
              </h2>
              <p className="text-gray-600 mt-1">
                Menampilkan {filteredCount} produk
                {activeTab !== 'all' ? ` dari tipe ${activeTab}` : ''}
                {searchQuery ? ` yang cocok dengan pencarian` : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 border-blue-400">
                {filteredCount} produk
              </div>
              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  Bersihkan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTabs;