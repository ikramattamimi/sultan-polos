import React, { useState } from "react";
import Input from "../components/Input.jsx";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";

const InventoryCreate = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const [inventory, setInventory] = useState({
    name: "",
    type: "",
    purchase_price: "",
    stock: "",
    color: "",
  });

  const createInventory = async () => {
    // Validasi form
    if (!inventory.name || !inventory.type || !inventory.purchase_price || !inventory.stock) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("inventories")
        .insert([inventory])
        .select();

      if (error) {
        throw error;
      }

      alert("Inventory berhasil dibuat");
      navigate("/inventory");
    } catch (error) {
      console.error(error);
      alert("Gagal membuat inventory");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setInventory({
      name: "",
      type: "",
      purchase_price: "",
      stock: "",
      color: "",
    });
  };

  return (
    <main className="w-full">
      <h1 className="">Buat Inventory Baru</h1>

      <div className="mt-10 pe-10 w-full">
        <Input
          required
          label="Nama Bahan"
          placeholder="Nama Bahan"
          value={inventory.name}
          onChange={(e) => setInventory({ ...inventory, name: e.target.value })}
        />

        <Input
          required
          label="Tipe Bahan"
          placeholder="Tipe Bahan"
          value={inventory.type}
          onChange={(e) => setInventory({ ...inventory, type: e.target.value })}
        />

        <Input
          required
          label="Harga"
          placeholder="Harga"
          value={inventory.purchase_price}
          onChange={(e) =>
            setInventory({
              ...inventory,
              purchase_price: e.target.value,
            })
          }
          type="number"
        />

        <Input
          required
          label="Stock"
          placeholder="Stock"
          value={inventory.stock}
          onChange={(e) =>
            setInventory({ ...inventory, stock: e.target.value })
          }
          type="number"
        />

        <Input
          required
          label="Warna"
          placeholder="Warna"
          value={inventory.color}
          onChange={(e) =>
            setInventory({ ...inventory, color: e.target.value })
          }
        />

        <div className="flex gap-3 justify-between">
          <button
            className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-md p-2 cursor-pointer"
            onClick={() => navigate('/inventory')}
          >
            <div className="flex items-center">
              <FaArrowLeft className="mr-2"/><span>Back</span>
            </div>
          </button>

          <div className="flex gap-3 justify-end">
            <button
              className="dark:bg-white text-white bg-green-500 rounded-lg shadow-md p-2 cursor-pointer"
              onClick={resetForm}
              disabled={isLoading}
            >
              Reset
            </button>
            <button
              className="dark:bg-white text-white bg-blue-400 rounded-lg shadow-md p-2 cursor-pointer"
              onClick={createInventory}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InventoryCreate;