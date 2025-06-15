import React, { useState } from "react";
import InventoryForm from "../components/InventoryForm.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";

const InventoryCreate = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);

  // Initial empty inventory state
  const [inventory, setInventory] = useState({
    name: "",
    type: "",
    purchase_price: "",
    stock: "",
    buffer_stock: "",
    unit: "",
    color: "",
    category: "",
  });

  const createInventory = async () => {
    // Validate required fields
    const requiredFields = ['name', 'category', 'type', 'purchase_price', 'stock', 'buffer_stock', 'unit', 'color'];
    const emptyFields = requiredFields.filter(field => !inventory[field] || inventory[field].toString().trim() === '');
    
    if (emptyFields.length > 0) {
      alert(`Mohon lengkapi field berikut: ${emptyFields.join(', ')}`);
      return;
    }

    setIsLoading(true);
    try {
      // Convert numeric fields to numbers
      const inventoryData = {
        ...inventory,
        purchase_price: parseFloat(inventory.purchase_price),
        stock: parseInt(inventory.stock),
        buffer_stock: parseInt(inventory.buffer_stock),
      };

      const { error } = await supabase
        .from("inventories")
        .insert([inventoryData])
        .select();

      if (error) {
        throw error;
      }

      alert("Inventory berhasil dibuat");
      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat inventory: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Ask for confirmation if form has data
    const hasData = Object.values(inventory).some(value => value && value.toString().trim() !== '');
    
    if (hasData) {
      if (window.confirm("Data yang sudah diisi akan hilang. Apakah anda yakin ingin kembali?")) {
        navigate('/inventory');
      }
    } else {
      navigate('/inventory');
    }
  };

  const resetForm = () => {
    if (window.confirm("Apakah anda yakin ingin mereset form?")) {
      setInventory({
        name: "",
        type: "",
        purchase_price: "",
        stock: "",
        buffer_stock: "",
        unit: "",
        color: "",
        category: "",
      });
    }
  };

  return (
    <main className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-gray-500 transition-colors mr-4"
            onClick={handleCancel}
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-2xl font-bold">Tambah Inventory Baru</h1>
        </div>
        
        {/* <button
          className="text-sm bg-red-500 rounded-sm text-white cursor-pointer"
          onClick={resetForm}
        >
          Reset Form
        </button> */}
      </div>

      <InventoryForm
        inventory={inventory}
        onInventoryChange={setInventory}
        onSubmit={createInventory}
        onCancel={handleCancel}
        isLoading={isLoading}
        mode="create"
      />
    </main>
  );
};

export default InventoryCreate;