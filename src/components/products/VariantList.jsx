
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Package, Palette, Ruler } from "lucide-react";
import AddVariantModal from "./AddVariantModal.jsx";
import VariantDetailModal from "./VariantDetailModal.jsx";

// Component untuk List Varian
const VariantList = ({ productId, variants, onDelete, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Grup varian berdasarkan warna untuk tampilan yang lebih baik
  const groupedVariants = variants.reduce((acc, variant) => {
    const colorName = variant.colors?.name || 'Tanpa Warna';
    if (!acc[colorName]) {
      acc[colorName] = [];
    }
    acc[colorName].push(variant);
    return acc;
  }, {});

  return (
    <div>
      <div className="space-y-4">
        {Object.keys(groupedVariants).length > 0 &&
          Object.entries(groupedVariants).map(([colorName, colorVariants]) => (
            <ColorVariantGroup
              key={colorName}
              colorName={colorName}
              variants={colorVariants}
              onSelectVariant={(variant) => {
                setSelectedVariant(variant);
                setIsDetailModalOpen(true);
              }}
              onDeleteVariant={onDelete}
            />
          ))}

        {/* Add New Variant Button */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-green-100 hover:bg-green-200 p-4 rounded-lg border-2 border-dashed border-green-300 flex justify-center items-center cursor-pointer h-24 transition-colors"
        >
          <div className="text-center">
            <Plus className="w-6 h-6 mx-auto mb-1 text-green-600" />
            <span className="text-sm font-medium text-green-700">Tambah Varian</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddVariantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        onVariantAdded={onAdd}
      />

      <VariantDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        variant={selectedVariant}
        colors={[]}
        sizes={[]}
        convections={[]}
      />
    </div>
  );
};

// ColorVariantGroup Component
const ColorVariantGroup = ({ colorName, variants, onSelectVariant, onDeleteVariant }) => (
  <div className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
    <div className="flex items-center mb-3">
      <div
        className="w-5 h-5 rounded-full border border-gray-300 mr-3"
        style={{ backgroundColor: variants[0]?.colors?.hex_code || '#ccc' }}
      ></div>
      <span className="font-semibold text-gray-800 text-lg flex items-center">
        <Palette className="mr-2 h-4 w-4" />
        {colorName}
      </span>
      <span className="ml-auto text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
        {variants.length} varian
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
      {variants.map(variant => (
        <VariantCard
          key={variant.id}
          variant={variant}
          onSelect={() => onSelectVariant(variant)}
          onDelete={() => onDeleteVariant(variant.id)}
        />
      ))}
    </div>
  </div>
);

// VariantCard Component
const VariantCard = ({ variant, onSelect, onDelete }) => (
  <div className="relative bg-gray-50 hover:bg-gray-100 p-3 rounded-lg border border-gray-200 transition-colors group">
    <div
      onClick={onSelect}
      className="cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium flex items-center text-gray-900">
          <Ruler className="h-3 w-3 mr-1" />
          {variant.sizes?.name || 'N/A'}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${
          variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {variant.stock > 0 ? `Stok: ${variant.stock}` : 'Habis'}
        </span>
      </div>

      <div className="text-sm font-semibold text-green-600 mb-1">
        Rp {variant.selling_price?.toLocaleString("id-ID") || '0'}
      </div>

      {variant.convections && (
        <div className="text-xs text-gray-600">
          <Package className="h-3 w-3 inline mr-1" />
          {variant.convections.name}
        </div>
      )}
    </div>

    {/* Delete Button */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      title="Hapus varian"
    >
      <Trash2 className="w-3 h-3" />
    </button>
  </div>
);

export default VariantList;