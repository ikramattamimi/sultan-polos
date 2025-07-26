import { ShoppingCart, AlertCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SaleService } from '../../../services/SaleService.js';



const CreateSalesHeader = ({ orderNumber, setOrderNumber, customer, setCustomer, submitting }) => {
  const [customers, setCustomers] = useState([]);
  const [showCustomCustomer, setShowCustomCustomer] = useState(false);
  const [customCustomerValue, setCustomCustomerValue] = useState('');

  useEffect(() => {
    SaleService.getCustomerNames()
      .then(data => {
        setCustomers([...(data || []), 'Lainnya']);
      })
      .catch(() => {
        // fallback dummy data jika error
        setCustomers([
          'Lainnya'
        ]);
      });
  }, []);

  // Sync prop customer to custom input if not in list
  useEffect(() => {
    if (customer && !customers.includes(customer)) {
      setShowCustomCustomer(true);
      setCustomCustomerValue(customer);
    }
  }, [customer, customers]);

  const handleCustomerChange = (e) => {
    const value = e.target.value;
    if (value === 'Lainnya') {
      setShowCustomCustomer(true);
      setCustomer('');
    } else {
      setShowCustomCustomer(false);
      setCustomCustomerValue('');
      setCustomer(value);
    }
  };

  const handleCustomCustomerChange = (e) => {
    setCustomCustomerValue(e.target.value);
    setCustomer(e.target.value);
  };

  return (
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
            <select
              value={showCustomCustomer ? 'Lainnya' : (customer || '')}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={submitting}
            >
              <option value="">Pilih Customer</option>
              {customers.map((cust, idx) => (
                <option key={idx} value={cust}>{cust}</option>
              ))}
            </select>
            {showCustomCustomer && (
              <input
                type="text"
                value={customCustomerValue}
                onChange={handleCustomCustomerChange}
                className="w-full mt-2 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan nama customer baru"
                disabled={submitting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSalesHeader