import React from 'react';
import {Filter, Search, X} from 'lucide-react';
import {Input} from '../ui/forms';

const ProductSearch = ({
                         searchQuery,
                         onSearchChange,
                         onClearSearch,
                         totalResults,
                         showFilter = false,
                         onToggleFilter,
                         className = ''
                       }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      <div className="flex items-center gap-4">
        {/* Search Input dengan Input component */}
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Cari produk berdasarkan nama, deskripsi, kategori, atau tipe..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="shadow-none border-1 border-gray-200 rounded-lg py-3"
            size="md"
            leftIcon={<Search />}
            rightIcon={searchQuery ? <X /> : null}
            onRightIconClick={searchQuery ? onClearSearch : undefined}
            rightIconClassName={searchQuery ? "text-gray-400 hover:text-gray-600 cursor-pointer" : ""}
          />
        </div>

        {/* Filter Button */}
        {showFilter && (
          <button
            onClick={onToggleFilter}
            className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-gray-600">Filter</span>
          </button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Menampilkan {totalResults} hasil untuk "{searchQuery}"
          </span>
          {totalResults > 0 && (
            <button
              onClick={onClearSearch}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Bersihkan pencarian
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSearch;