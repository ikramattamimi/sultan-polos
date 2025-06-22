import React, { useState } from "react";
import ConvectionForm from "../components/convections/ConvectionForm.jsx";
import { useLoaderData, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";
import convectionService from "../services/convectionService.js";

const ConvectionDetailPage = () => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { name, type, purchase_price, stock, buffer_stock, unit, color_id, id, category } = useLoaderData();

  const [convection, setConvection] = useState({
    id,
    name,
    type,
    purchase_price,
    stock,
    color_id,
    buffer_stock,
    unit,
    category,
  });

  console.log("convection", convection);

  const updateConvection = async () => {
    setIsLoading(true);
    try {
      await convectionService.update(convection.id, convection);
      
      alert("Convection berhasil diupdate");
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate convection");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConvection = async () => {
    if (!window.confirm("Apakah anda yakin ingin menghapus convection ini?")) return;

    setIsDeleting(true);
    try {
      await supabase
        .from("inventories")
        .delete()
        .eq("id", convection.id);
      
      alert("Convection berhasil dihapus");
      navigate("/convection");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus convection");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    navigate('/convection');
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
        <h1 className="text-2xl font-bold">Detail Convection</h1>
      </div>

      <ConvectionForm
        convection={convection}
        onConvectionChange={setConvection}
        onSubmit={updateConvection}
        onCancel={handleCancel}
        onDelete={deleteConvection}
        isLoading={isLoading}
        isDeleting={isDeleting}
        mode="edit"
      />
    </main>
  );
};

export default ConvectionDetailPage;