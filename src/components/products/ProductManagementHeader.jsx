import {Package, Plus, RefreshCw} from 'lucide-react';

const ProductManagementHeader = ({onClickRefresh, disabledRefresh, onClickAdd, disabledAdd}) => {
  return (<>
    {/* Header */}
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600"/>
            Manajemen Produk
          </h1>
          <p className="text-gray-600 mt-2">Kelola produk dan varian dengan mudah</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClickRefresh}
            disabled={disabledRefresh}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${disabledRefresh ? "animate-spin" : ""}`}/>
            Refresh
          </button>
          <button
            onClick={onClickAdd}
            disabled={disabledAdd}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5"/>
            Tambah Produk
          </button>
        </div>
      </div>
    </div>
  </>);
}

export default ProductManagementHeader;