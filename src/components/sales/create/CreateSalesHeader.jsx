import { ShoppingCart } from 'lucide-react';
import React from 'react';

const CreateSalesHeader = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
        <ShoppingCart className="mr-3 text-blue-600" />
        Buat Order Penjualan
      </h1>
    </div>
  );
};

export default CreateSalesHeader; 