import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { FaArrowLeft } from "react-icons/fa6";
import InventoryForm from "../components/InventoryForm.jsx";

const InventoryCreate = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [convection, setConvection] = useState({
    name: "",
    type: "",
    selling_price: "",
    stock: "",
    color: "",
    category: "",
    inventory_id: null,
    inventory_alt: []
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!convection.name.trim()) {
      newErrors.name = "Nama wajib diisi";
    }

    if (!convection.category.trim()) {
      newErrors.category = "Kategori wajib diisi";
    }

    if (!convection.type.trim()) {
      newErrors.type = "Tipe wajib diisi";
    }

    if (!convection.selling_price || parseFloat(convection.selling_price) <= 0) {
      newErrors.selling_price = "Harga jual harus lebih dari 0";
    }

    // if (!convection.stock || parseInt(convection.stock) < 0) {
    //   newErrors.stock = "Stock tidak boleh negatif";
    // }

    if (!convection.color.trim()) {
      newErrors.color = "Warna wajib diisi";
    }

    // Validate inventory selection
    if (!convection.inventory_id && (!convection.inventory_alt || convection.inventory_alt.length === 0)) {
      newErrors.inventory = "Pilih inventory yang ada atau buat inventory custom";
    }

    // Validate inventory_alt items only if using alternative mode
    if (!convection.inventory_id && convection.inventory_alt && convection.inventory_alt.length > 0) {
      convection.inventory_alt.forEach((item, index) => {
        if (!item.material_name || !item.material_name.trim()) {
          newErrors[`inventory_alt_${index}_material_name`] = `Material ${index + 1}: Nama material wajib diisi`;
        }
        if (!item.material_type || !item.material_type.trim()) {
          newErrors[`inventory_alt_${index}_material_type`] = `Material ${index + 1}: Tipe material wajib diisi`;
        }
        if (!item.material_category || !item.material_category.trim()) {
          newErrors[`inventory_alt_${index}_material_category`] = `Material ${index + 1}: Kategori material wajib diisi`;
        }
        if (!item.purchase_price || item.purchase_price <= 0) {
          newErrors[`inventory_alt_${index}_purchase_price`] = `Material ${index + 1}: Harga beli harus lebih dari 0`;
        }
        if (item.stock_quantity < 0) {
          newErrors[`inventory_alt_${index}_stock_quantity`] = `Material ${index + 1}: Stock tidak boleh negatif`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createConvection = async () => {
    if (!validateForm()) {
      alert("Mohon periksa kembali form Anda. Ada beberapa field yang belum diisi dengan benar.");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare data for insert
      const insertData = {
        name: convection.name.trim(),
        type: convection.type.trim(),
        selling_price: parseFloat(convection.selling_price),
        stock: parseInt(convection.stock),
        color: convection.color.trim(),
        category: convection.category.trim(),
        inventory_id: convection.inventory_id,
        inventory_count: convection.inventory_count || 0,
        inventory_alt: convection.inventory_alt && convection.inventory_alt.length > 0 
          ? convection.inventory_alt 
          : null
      };

      const { error } = await supabase
        .from("convections")
        .insert([insertData])
        .select();

      if (error) {
        throw error;
      }

      alert("Inventory berhasil dibuat");
      navigate("/convection");
    } catch (error) {
      console.error("Error creating convection:", error);
      alert("Gagal membuat convection: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (window.confirm("Apakah Anda yakin ingin mereset form? Semua data yang sudah diisi akan hilang.")) {
      setConvection({
        name: "",
        type: "",
        selling_price: "",
        stock: "",
        color: "",
        category: "",
        inventory_id: null,
        inventory_count: 0,
        inventory_alt: []
      });
      setErrors({});
    }
  };

  return (
    <main className="w-full p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-gray-500 transition-colors mr-4"
            onClick={() => navigate('/convection')}
          >
            <FaArrowLeft />
          </button>
          <h1>Tambah Inventory Baru</h1>
        </div>
      </div>
      

      {/* Display validation errors */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Terdapat kesalahan pada form:</h3>
          <ul className="list-disc list-inside text-red-700 text-sm">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <InventoryForm 
        convection={convection}
        setConvection={setConvection}
      />

      <div className="flex justify-end mt-15 me-10 gap-3 border-t border-gray-200 pt-5">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors disabled:opacity-50"
          onClick={resetForm}
          disabled={isLoading}
        >
          Reset Form
        </button>
        
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-xl px-4 py-2 cursor-pointer transition-colors disabled:opacity-50"
          onClick={createConvection}
          disabled={isLoading}
        >
          {isLoading ? "Menyimpan..." : "Simpan Inventory"}
        </button>
      </div>
    </main>
  );
};

export default InventoryCreate;