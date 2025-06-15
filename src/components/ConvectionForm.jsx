import React, { useState, useEffect } from "react";
import Input from "./Input.jsx";
import { supabase } from "../supabaseClient.js";

const ConvectionForm = ({ convection, setConvection }) => {
  const [inventories, setInventories] = useState([]);
  const [loadingInventories, setLoadingInventories] = useState(false);
  const [inventoryMode, setInventoryMode] = useState(
    convection.inventory_id ? 'existing' : 'alternative'
  );
  const [backupInventoryAlt, setBackupInventoryAlt] = useState([]);
  const [selectedInventory, setSelectedInventory] = useState(null);

  useEffect(() => {
    fetchInventories();
    // Backup existing inventory_alt data when component mounts
    if (convection.inventory_alt && convection.inventory_alt.length > 0) {
      setBackupInventoryAlt([...convection.inventory_alt]);
    }
  }, []);

  // Update backup when inventory_alt changes in alternative mode
  useEffect(() => {
    if (inventoryMode === 'alternative' && convection.inventory_alt && convection.inventory_alt.length > 0) {
      setBackupInventoryAlt([...convection.inventory_alt]);
    }
  }, [convection.inventory_alt, inventoryMode]);

  // Find selected inventory details when inventory_id changes
  useEffect(() => {
    if (convection.inventory_id && inventories.length > 0) {
      const inventory = inventories.find(inv => parseInt(inv.id) === parseInt(convection.inventory_id));
      setSelectedInventory(inventory);
    } else {
      setSelectedInventory(null);
    }
  }, [convection.inventory_id, inventories]);

  const fetchInventories = async () => {
    setLoadingInventories(true);
    try {
      const { data, error } = await supabase
        .from('inventories')
        .select('id, name, category, type, stock')
        .order('name');
      
      if (error) throw error;
      setInventories(data || []);
    } catch (error) {
      console.error('Error fetching inventories:', error);
    } finally {
      setLoadingInventories(false);
    }
  };

  const handleInventoryModeChange = (mode) => {
    setInventoryMode(mode);
    if (mode === 'existing') {
      // Backup current inventory_alt before clearing
      if (convection.inventory_alt && convection.inventory_alt.length > 0) {
        setBackupInventoryAlt([...convection.inventory_alt]);
      }
      // Clear inventory_alt when switching to existing inventory
      setConvection({ 
        ...convection, 
        inventory_alt: [],
        inventory_id: convection.inventory_id || '',
        inventory_count: convection.inventory_count || 0
      });
    } else {
      // Restore inventory_alt from backup when switching back to alternative
      const restoredInventoryAlt = backupInventoryAlt.length > 0 ? [...backupInventoryAlt] : [];
      setConvection({ 
        ...convection, 
        inventory_id: null,
        inventory_count: 0,
        inventory_alt: restoredInventoryAlt
      });
    }
  };

  const handleInventorySelect = (inventoryId) => {
    setConvection({ 
      ...convection, 
      inventory_id: inventoryId || null,
      inventory_count: inventoryId ? (convection.inventory_count || 0) : 0
    });
    setSelectedInventory(inventories.find(inv => inv.id === inventoryId));
  };

  const handleInventoryCountChange = (count) => {
    const numericCount = parseInt(count) || 0;
    setConvection({ 
      ...convection, 
      inventory_count: numericCount
    });
  };
  
  const handleInventoryAltChange = (index, field, value) => {
    const updatedInventoryAlt = [...convection.inventory_alt];
    updatedInventoryAlt[index] = {
      ...updatedInventoryAlt[index],
      [field]: value
    };
    setConvection({ ...convection, inventory_alt: updatedInventoryAlt });
  };

  const addInventoryAltItem = () => {
    const newItem = {
      unit: "",
      color: "",
      buffer_stock: 0,
      material_name: "",
      material_type: "",
      purchase_price: 0,
      stock_quantity: 0,
      material_category: ""
    };
    const updatedInventoryAlt = [...(convection.inventory_alt || []), newItem];
    setConvection({ 
      ...convection, 
      inventory_alt: updatedInventoryAlt
    });
  };

  const removeInventoryAltItem = (index) => {
    const updatedInventoryAlt = convection.inventory_alt.filter((_, i) => i !== index);
    setConvection({ ...convection, inventory_alt: updatedInventoryAlt });
  };

  return (
    <div className="mt-10 pe-10 w-full">
      <Input
        required
        placeholder="Nama"
        value={convection.name || ""}
        onChange={(e) => setConvection({ ...convection, name: e.target.value })}
      />

      <Input
        required
        placeholder="Kategori"
        value={convection.category || ""}
        onChange={(e) => setConvection({ ...convection, category: e.target.value })}
      />

      <Input
        required
        placeholder="Tipe"
        value={convection.type || ""}
        onChange={(e) => setConvection({ ...convection, type: e.target.value })}
      />

      <Input
        required
        placeholder="Harga Jual"
        value={convection.selling_price || ""}
        onChange={(e) => setConvection({ ...convection, selling_price: e.target.value })}
        type="number"
      />

      <Input
        required
        placeholder="Stock"
        value={convection.stock || ""}
        onChange={(e) => setConvection({ ...convection, stock: e.target.value })}
        type="number"
      />

      <Input
        required
        placeholder="Warna"
        value={convection.color || ""}
        onChange={(e) => setConvection({ ...convection, color: e.target.value })}
      />

      {/* Inventory Selection Mode */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Pilih Sumber Inventory</h2>
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inventoryMode"
              value="existing"
              checked={inventoryMode === 'existing'}
              onChange={(e) => handleInventoryModeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span>Pilih dari Inventory yang Ada</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="inventoryMode"
              value="alternative"
              checked={inventoryMode === 'alternative'}
              onChange={(e) => handleInventoryModeChange(e.target.value)}
              className="w-4 h-4"
            />
            <span>Buat Inventory Custom</span>
          </label>
        </div>

        {/* Existing Inventory Selection */}
        {inventoryMode === 'existing' && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Pilih Inventory:</label>
            {loadingInventories ? (
              <div className="text-gray-500">Loading inventories...</div>
            ) : (
              <div className="space-y-4">
                <select
                  value={convection.inventory_id || ""}
                  onChange={(e) => handleInventorySelect(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">-- Pilih Inventory --</option>
                  {inventories.map((inventory) => (
                    <option key={inventory.id} value={inventory.id}>
                      {inventory.name} - {inventory.category} ({inventory.type}) - Stock: {inventory.stock}
                    </option>
                  ))}
                </select>

                {/* Inventory Count Input */}
                {convection.inventory_id && selectedInventory && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="mb-3">
                      <h4 className="font-medium text-blue-800">Inventory Terpilih:</h4>
                      <p className="text-sm text-blue-600">
                        {selectedInventory.name} - Stock Tersedia: {selectedInventory.stock}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-blue-800">
                          Jumlah yang Diambil:
                        </label>
                        <Input
                          required
                          placeholder="Masukkan jumlah"
                          value={convection.inventory_count || ""}
                          onChange={(e) => handleInventoryCountChange(e.target.value)}
                          type="number"
                          min="1"
                          max={selectedInventory.stock}
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <p>Sisa stock setelah diambil: {selectedInventory.stock - (convection.inventory_count || 0)}</p>
                        {(convection.inventory_count || 0) > selectedInventory.stock && (
                          <p className="text-red-600 font-medium">
                            ⚠️ Jumlah melebihi stock yang tersedia!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Alternative Inventory Section */}
        {inventoryMode === 'alternative' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Inventory Custom</h3>
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                onClick={addInventoryAltItem}
              >
                Tambah Material
              </button>
            </div>

            {convection.inventory_alt && convection.inventory_alt.length > 0 ? (
              convection.inventory_alt.map((item, index) => (
                <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Material {index + 1}</h4>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors text-sm"
                      onClick={() => removeInventoryAltItem(index)}
                    >
                      Hapus
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nama Material"
                      value={item.material_name || ""}
                      onChange={(e) => handleInventoryAltChange(index, "material_name", e.target.value)}
                    />
                    
                    <Input
                      placeholder="Tipe Material"
                      value={item.material_type || ""}
                      onChange={(e) => handleInventoryAltChange(index, "material_type", e.target.value)}
                    />
                    
                    <Input
                      placeholder="Kategori Material"
                      value={item.material_category || ""}
                      onChange={(e) => handleInventoryAltChange(index, "material_category", e.target.value)}
                    />
                    
                    <Input
                      placeholder="Warna"
                      value={item.color || ""}
                      onChange={(e) => handleInventoryAltChange(index, "color", e.target.value)}
                    />
                    
                    <Input
                      placeholder="Unit"
                      value={item.unit || ""}
                      onChange={(e) => handleInventoryAltChange(index, "unit", e.target.value)}
                    />
                    
                    <Input
                      placeholder="Harga Beli"
                      value={item.purchase_price || ""}
                      onChange={(e) => handleInventoryAltChange(index, "purchase_price", parseFloat(e.target.value) || 0)}
                      type="number"
                    />
                    
                    <Input
                      placeholder="Jumlah Stock"
                      value={item.stock_quantity || ""}
                      onChange={(e) => handleInventoryAltChange(index, "stock_quantity", parseInt(e.target.value) || 0)}
                      type="number"
                    />
                    
                    <Input
                      placeholder="Buffer Stock"
                      value={item.buffer_stock || ""}
                      onChange={(e) => handleInventoryAltChange(index, "buffer_stock", parseInt(e.target.value) || 0)}
                      type="number"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                Belum ada material custom. Klik "Tambah Material" untuk menambahkan.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConvectionForm;