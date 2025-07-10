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
    <div className="mt-10 pe-10 w-full">
      <div className="space-y-4">
        <Input
          required
          placeholder="Nama Bahan"
          value={convection.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        {/*<Input*/}
        {/*  required*/}
        {/*  placeholder="Kategori Bahan"*/}
        {/*  value={convection.category || ""}*/}
        {/*  onChange={(e) => handleInputChange("category", e.target.value)}*/}
        {/*/>*/}

        {/*<Input*/}
        {/*  required*/}
        {/*  placeholder="Tipe Bahan"*/}
        {/*  value={convection.type || ""}*/}
        {/*  onChange={(e) => handleInputChange("type", e.target.value)}*/}
        {/*/>*/}

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

        <div className="my-4 flex flex-wrap items-center">

          <label className='text-sm font-medium mb-2 inline-block w-full md:w-1/3 xl:w-1/6'>Warna</label>

          <select
            value={convection.color_id}
            onChange={(e) => handleInputChange("color_id", e.target.value)}
            // disabled={loading}
            className="w-full md:w-2/3 xl:w-5/6 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
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

      <div className="flex gap-3 justify-between mt-6">
        <button
          className="dark:bg-white text-white bg-gray-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-gray-500 transition-colors"
          onClick={onCancel}
          type="button"
        >
          <div className="flex items-center">
            <span>Cancel</span>
          </div>
        </button>

        <div className="flex gap-3 justify-end">
          {mode === "edit" && onDelete && (
            <button
              className="dark:bg-white text-white bg-red-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-red-500 transition-colors disabled:opacity-50"
              onClick={onDelete}
              disabled={isDeleting}
              type="button"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          )}
          
          <button
            className="dark:bg-white text-white bg-blue-400 rounded-lg shadow-xl p-2 cursor-pointer hover:bg-blue-500 transition-colors disabled:opacity-50"
            onClick={onSubmit}
            disabled={isLoading}
            type="button"
          >
            {isLoading 
              ? (mode === "edit" ? "Updating..." : "Creating...") 
              : (mode === "edit" ? "Update" : "Create")
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConvectionForm;