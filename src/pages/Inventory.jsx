import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { useLoaderData, useNavigate } from 'react-router-dom';
import CardInventory from '../components/CardInventory';

const Inventory = () => {

  const inventoryData = useLoaderData();
  const navigate = useNavigate();


  return (
    <main>
      <h1 className="mb-6">Inventory</h1>

      <button
        className="bg-blue-500 hover:bg-blue-600 mb-4 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors"
        onClick={() => navigate('/convection/create')}
      >
        <div className="flex items-center">
          <FaPlus className="mr-2"/><span>Tambah Data</span>
        </div>
      </button>

      <div className="me-10 flex gap-5 flex-wrap">

        {inventoryData.map((item) => (
          <CardInventory key={item.id} inventory={item} />
        ))}

      </div>
    </main>
  );
};

export default Inventory;