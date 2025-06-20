import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";
import InventoryForm from "../components/InventoryForm.jsx";

const InventoryDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loaderData = useLoaderData();

  const [inventory, setInventory] = useState({
    id: loaderData.id,
    name: loaderData.name || "",
    type: loaderData.type || "",
    selling_price: loaderData.selling_price || "",
    stock: loaderData.stock || "",
    color: loaderData.color || "",
    category: loaderData.category || "",
    inventory_id: loaderData.inventory_id || null,
    inventory_count: loaderData.inventory_count || 0,
    inventory_alt: Array.isArray(loaderData.inventory_alt)
      ? loaderData.inventory_alt
      : loaderData.inventory_alt
      ? [loaderData.inventory_alt]
      : [],
  });

  const updateInventory = async () => {
    setIsLoading(true);
    try {
      // Prepare data for update
      const updateData = {
        name: inventory.name,
        type: inventory.type,
        selling_price: parseFloat(inventory.selling_price) || 0,
        stock: parseInt(inventory.stock) || 0,
        color: inventory.color,
        category: inventory.category,
        inventory_id: inventory.inventory_id,
        inventory_count: inventory.inventory_count || 0,
        inventory_alt:
          inventory.inventory_alt && inventory.inventory_alt.length > 0
            ? inventory.inventory_alt
            : null,
      };

      console.log("updateData", updateData);

      const { error } = await supabase
        .from("inventorys")
        .update(updateData)
        .eq("id", inventory.id);

      if (error) {
        throw error;
      }

      alert("Inventory berhasil diupdate");
    } catch (error) {
      console.error("Error updating inventory:", error);
      alert("Gagal mengupdate inventory: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInventory = async () => {
    if (!window.confirm("Apakah anda yakin ingin menghapus data ini?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("inventorys")
        .delete()
        .eq("id", inventory.id);

      if (error) {
        throw error;
      }

      alert("Inventory berhasil dihapus");
      navigate("/inventory");
    } catch (error) {
      console.error("Error deleting inventory:", error);
      alert("Gagal menghapus inventory: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-gray-500 transition-colors mr-4"
            onClick={() => navigate("/inventory")}
          >
            <FaArrowLeft />
          </button>
          <h1>Detail Inventory</h1>
        </div>
      </div>

      <InventoryForm inventory={inventory} setInventory={setInventory} />

      <div className="pe-10">
        <div className="flex gap-3 justify-end mt-8 pt-6 border-t border-t-gray-300">
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors disabled:opacity-50"
            onClick={deleteInventory}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors disabled:opacity-50"
            onClick={updateInventory}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default InventoryDetail;
