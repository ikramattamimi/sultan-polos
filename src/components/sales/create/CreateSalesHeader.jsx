import { ShoppingCart, AlertCircle } from 'lucide-react';

// OrderHeader Component
const CreateSalesHeader = ({ orderNumber, setOrderNumber, customer, setCustomer, submitting }) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-6">
    <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
      <ShoppingCart className="mr-3 text-blue-600" />
      Buat Order Penjualan
    </h1>
    
    <div className="grid grid-cols-1 gap-4">
      <div className='grid grid-cols-2 gap-4'>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nomor Order
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nomor order"
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Customer
          </label>
          <input
            type="text"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nama Customer"
            disabled={submitting}
          />
        </div>
      </div>
    </div>
  </div>
);

export default CreateSalesHeader