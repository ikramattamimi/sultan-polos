import React, { useState } from "react";
import CardInventory from "../components/CardInventory.jsx";
import Input from "../components/Input.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import { formatPrice } from "../common.js";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft, FaBackward } from "react-icons/fa6";
import { FaBackspace } from "react-icons/fa";

const InventoryDetail = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { name, type, purchase_price, stock, color, id } = useLoaderData();

  const [inventory, setInventory] = useState({
    id,
    name,
    type,
    purchase_price,
    stock,
    color,
  });

  const updateInventory = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from("inventories")
        .update(inventory)
        .eq("id", inventory.id);
    } catch (error) {
      console.error(error);
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
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="w-full">
      <h1 className="">Detail Inventory</h1>

      <div className="mt-10 pe-10 w-full">
        {/* <form action=""> */}
        <Input
          required
          placeholder="Nama Bahan"
          value={inventory.name}
          onChange={(e) => setInventory({ ...inventory, name: e.target.value })}
        />

        <Input
          required
          placeholder="Tipe Bahan"
          value={inventory.type}
          onChange={(e) => setInventory({ ...inventory, type: e.target.value })}
        />

        <Input
          required
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
          placeholder="Stock"
          value={inventory.stock}
          onChange={(e) =>
            setInventory({ ...inventory, stock: e.target.value })
          }
        />

        <Input
          required
          placeholder="Warna"
          value={inventory.color}
          onChange={(e) =>
            setInventory({ ...inventory, color: e.target.value })
          }
        />

        <div className="flex gap-3 justify-between">
          <button
            className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-xl p-2 cursor-pointer"
            onClick={() => navigate('/inventory')}
          >
            <div className="flex items-center">
              <FaArrowLeft className="mr-2"/><span>Back</span>
            </div>
          </button>

          <div className="flex gap-3 justify-end">
            <button
              className="dark:bg-white text-white bg-red-400 rounded-lg shadow-xl p-2 cursor-pointer"
              onClick={deleteInventory}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              className="dark:bg-white text-white bg-blue-400 rounded-lg shadow-xl p-2 cursor-pointer"
              onClick={updateInventory}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>

          </div>
        </div>

        {/* </form> */}
      </div>
    </main>
  );
};

export default InventoryDetail;
