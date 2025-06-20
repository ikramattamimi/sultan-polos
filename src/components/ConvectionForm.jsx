import React from "react";
import Input from "./Input.jsx";

const ConvectionForm = ({ 
  inventory, 
  onInventoryChange, 
  onSubmit, 
  onCancel, 
  onDelete,
  isLoading = false,
  isDeleting = false,
  mode = "edit" // "edit", "create"
}) => {
  
  const handleInputChange = (field, value) => {
    onInventoryChange({ ...inventory, [field]: value });
  };

  return (
    <div className="mt-10 pe-10 w-full">
      <div className="space-y-4">
        <Input
          required
          placeholder="Nama Bahan"
          value={inventory.name || ""}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />

        <Input
          required
          placeholder="Kategori Bahan"
          value={inventory.category || ""}
          onChange={(e) => handleInputChange("category", e.target.value)}
        />

        <Input
          required
          placeholder="Tipe Bahan"
          value={inventory.type || ""}
          onChange={(e) => handleInputChange("type", e.target.value)}
        />

        <Input
          required
          placeholder="Harga"
          value={inventory.purchase_price || ""}
          onChange={(e) => handleInputChange("purchase_price", e.target.value)}
          type="number"
        />

        <Input
          required
          placeholder="Stock"
          value={inventory.stock || ""}
          onChange={(e) => handleInputChange("stock", e.target.value)}
          type="number"
        />

        <Input
          required
          placeholder="Buffer Stock"
          value={inventory.buffer_stock || ""}
          onChange={(e) => handleInputChange("buffer_stock", e.target.value)}
          type="number"
        />

        <Input
          required
          placeholder="Unit"
          value={inventory.unit || ""}
          onChange={(e) => handleInputChange("unit", e.target.value)}
        />

        <Input
          required
          placeholder="Warna"
          value={inventory.color || ""}
          onChange={(e) => handleInputChange("color", e.target.value)}
        />
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