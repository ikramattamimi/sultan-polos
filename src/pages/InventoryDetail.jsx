import React, { useState } from "react";
import InventoryForm from "../components/InventoryForm.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";

const InventoryDetail = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { name, type, purchase_price, stock, buffer_stock, unit, color, id, category } = useLoaderData();

  const [inventory, setInventory] = useState({
    id,
    name,
    type,
    purchase_price,
    stock,
    color,
    buffer_stock,
    unit,
    category,
  });

  const updateInventory = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from("inventories")
        .update(inventory)
        .eq("id", inventory.id);
      
      alert("Inventory berhasil diupdate");
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInventory = async () => {
    if (!window.confirm("Apakah anda yakin ingin menghapus inventory ini?")) return;

    setIsDeleting(true);
    try {
      await supabase
        .from("inventories")
        .delete()
        .eq("id", inventory.id);
      
      alert("Inventory berhasil dihapus");
      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus inventory");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory');
  };

  return (
    <main className="w-full">
      <div className="flex items-center mb-6">
        <button
          className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-gray-500 transition-colors mr-4"
          onClick={handleCancel}
        >
          <FaArrowLeft />
        </button>
        <h1 className="text-2xl font-bold">Detail Inventory</h1>
      </div>

      <InventoryForm
        inventory={inventory}
        onInventoryChange={setInventory}
        onSubmit={updateInventory}
        onCancel={handleCancel}
        onDelete={deleteInventory}
        isLoading={isLoading}
        isDeleting={isDeleting}
        mode="edit"
      />
    </main>
  );
};

export default InventoryDetail;