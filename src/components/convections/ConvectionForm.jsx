import React, {useEffect, useState} from "react";
import Input from "../Input.jsx";
import MasterDataService from "../../services/MasterDataService.js";

const ConvectionForm = ({ 
  convection, 
  onConvectionChange, 
  onSubmit, 
  onCancel, 
  onDelete,
  isLoading = false,
  isDeleting = false,
  mode = "edit" // "edit", "create"
}) => {

  console.log(convection);
  
  const handleInputChange = (field, value) => {
    onConvectionChange({ ...convection, [field]: value });
  };

  const [colors, setColors] = useState([])

  const getColors = async () => {
    const data = await MasterDataService.colors.getAll();
    setColors(data || []);
  }

  useEffect(() => {
    getColors();
  }, [])

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          required
          placeholder="Nama Bahan"
          value={convection.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        <Input
          required
          placeholder="Harga"
          value={convection.purchase_price || ""}
          onChange={(e) => handleInputChange("purchase_price", e.target.value)}
          type="number"
        />

        <Input
          required
          placeholder="Stock"
          value={convection.stock || ""}
          onChange={(e) => handleInputChange("stock", e.target.value)}
          type="number"
        />

        <Input
          required
          placeholder="Buffer Stock"
          value={convection.buffer_stock || ""}
          onChange={(e) => handleInputChange("buffer_stock", e.target.value)}
          type="number"
        />

        <Input
          required
          placeholder="Unit"
          value={convection.unit || ""}
          onChange={(e) => handleInputChange("unit", e.target.value)}
        />

        <div className="flex flex-col">
          <label className='text-sm font-medium text-gray-700 mb-2'>Warna</label>
          <select
            value={convection.color_id}
            onChange={(e) => handleInputChange("color_id", e.target.value)}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            <option value="">
              Pilih Warna
            </option>
            {colors.map(color => (
              <option key={color.id} value={color.id}>
                {color.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between mt-8 pt-6 border-t border-gray-200">
        <button
          className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          onClick={onCancel}
          type="button"
        >
          Batal
        </button>

        <div className="flex gap-3">
          {mode === "edit" && onDelete && (
            <button
              className="flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              onClick={onDelete}
              disabled={isDeleting}
              type="button"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </button>
          )}
          
          <button
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            onClick={onSubmit}
            disabled={isLoading}
            type="button"
          >
            {isLoading 
              ? (mode === "edit" ? "Mengupdate..." : "Membuat...") 
              : (mode === "edit" ? "Update" : "Buat")
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvectionForm;