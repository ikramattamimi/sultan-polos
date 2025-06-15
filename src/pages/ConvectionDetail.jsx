import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";
import ConvectionForm from "../components/ConvectionForm.jsx";

const ConvectionDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loaderData = useLoaderData();
  
  const [convection, setConvection] = useState({
    id: loaderData.id,
    name: loaderData.name || "",
    type: loaderData.type || "",
    selling_price: loaderData.selling_price || "",
    stock: loaderData.stock || "",
    color: loaderData.color || "",
    category: loaderData.category || "",
    inventory_id: loaderData.inventory_id || null,
    inventory_alt: Array.isArray(loaderData.inventory_alt) 
      ? loaderData.inventory_alt 
      : (loaderData.inventory_alt ? [loaderData.inventory_alt] : [])
  });

  const updateConvection = async () => {
    setIsLoading(true);
    try {
      // Prepare data for update
      const updateData = {
        name: convection.name,
        type: convection.type,
        selling_price: parseFloat(convection.selling_price) || 0,
        stock: parseInt(convection.stock) || 0,
        color: convection.color,
        category: convection.category,
        inventory_id: convection.inventory_id,
        inventory_alt: convection.inventory_alt && convection.inventory_alt.length > 0 
          ? convection.inventory_alt 
          : null
      };

      const { error } = await supabase
        .from("convections")
        .update(updateData)
        .eq("id", convection.id);

      if (error) {
        throw error;
      }

      alert("Convection berhasil diupdate");
    } catch (error) {
      console.error("Error updating convection:", error);
      alert("Gagal mengupdate convection: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConvection = async () => {
    if (!window.confirm("Apakah anda yakin ingin menghapus data ini?")) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("convections")
        .delete()
        .eq("id", convection.id);

      if (error) {
        throw error;
      }
      
      alert("Convection berhasil dihapus");
      navigate("/convection");
    } catch (error) {
      console.error("Error deleting convection:", error);
      alert("Gagal menghapus convection: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="w-full p-6">
      <div className="flex items-center mb-6">
        <h1>Detail Konveksi</h1>
      </div>

      <ConvectionForm 
        convection={convection}
        setConvection={setConvection}
      />

      <div className="flex gap-3 justify-between mt-8 pt-6 border-t border-t-gray-300">
        <button
          className="flex items-center gap-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors"
          onClick={() => navigate('/convection')}
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        <div className="flex gap-3">
          <button
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors disabled:opacity-50"
            onClick={deleteConvection}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
          
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors disabled:opacity-50"
            onClick={updateConvection}
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </main>
  );
};

export default ConvectionDetail;