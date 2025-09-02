import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Package, Palette, Ruler } from "lucide-react";
import AddVariantModal from "./AddVariantModal.jsx";
import VariantDetailModal from "./VariantDetailModal.jsx";

// Component untuk List Varian
// Catatan: Semua label 'Partner' diubah menjadi 'Mitra' sesuai permintaan bisnis
const VariantList = ({ productId, variants, onDelete, onAdd, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Group variants by color (hapus grouping by mitra)
  const colorGroups = variants.reduce((acc, variant) => {
    const colorName = variant.colors?.name || 'Tanpa Warna';
    if (!acc[colorName]) acc[colorName] = [];
    acc[colorName].push(variant);
    return acc;
  }, {});

  return (
    <div>
      <div className="space-y-4 sm:space-y-6 lg:space-y-8">
        {/* Grid responsif untuk color groups */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {Object.entries(colorGroups).map(([colorName, colorVariants]) => (
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
        </div>

        {/* Add New Variant Button - responsive */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-green-100 hover:bg-green-200 p-3 sm:p-4 rounded-lg border-2 border-dashed border-green-300 flex justify-center items-center cursor-pointer h-16 sm:h-20 lg:h-24 transition-colors"
        >
          <div className="text-center">
            <Plus className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-green-700">Tambah Varian</span>
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
        onUpdate={onUpdate}
        variant={selectedVariant}
        colors={[]}
        sizes={[]}
        convections={[]}
      />
    </div>
  );
};

// ColorVariantGroup Component - responsive
const ColorVariantGroup = ({ colorName, variants, onSelectVariant, onDeleteVariant }) => (
  <div className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white shadow-sm">
    <div className="flex items-center mb-2 sm:mb-3">
      <div
        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-gray-300 mr-2 sm:mr-3 shrink-0"
        style={{ backgroundColor: variants[0]?.colors?.hex_code || '#ccc' }}
      ></div>
      <span className="font-semibold text-gray-800 text-base sm:text-lg flex items-center min-w-0">
        <Palette className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
        <span className="truncate">{colorName}</span>
      </span>
      <span className="ml-auto text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded shrink-0">
        {variants.length} varian
      </span>
    </div>

    {/* Grid responsif untuk variant cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
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

// VariantCard Component - responsive with mobile horizontal layout
const VariantCard = ({ variant, onSelect, onDelete }) => (
  <div className="relative bg-gray-50 hover:bg-gray-100 p-2 sm:p-3 rounded-lg border border-gray-200 transition-colors group shadow-sm">
    <div
      type="button"
      onClick={onSelect}
      className="w-full text-left cursor-pointer"
    >
      {/* Mobile: horizontal layout */}
      <div className="flex items-center justify-between sm:block">
        {/* Size info */}
        <div className="flex items-center flex-1 min-w-0">
          <Ruler className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1 sm:mr-2 shrink-0 text-gray-500" />
          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
            {variant.sizes?.name || 'N/A'}
          </span>
        </div>

        {/* Mobile: Stock and Delete in same row */}
        <div className="flex items-center gap-2 sm:hidden shrink-0">
          <span
            className={`text-xs px-1.5 py-0.5 rounded inline-flex items-center ${
              variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
            title={`Stok: ${variant.stock ?? 0}`}
          >
            <Package className="w-3 h-3 mr-1 shrink-0" />
            {variant.stock ?? 0}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="bg-red-100 hover:bg-red-200 text-red-700 p-1 rounded transition-opacity"
            title="Hapus varian"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Desktop: Stock info in separate row */}
      <div className="hidden sm:flex items-center mt-2">
        <span
          className={`text-xs px-2 py-0.5 rounded inline-flex items-center ${
            variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          title={`Stok: ${variant.stock ?? 0}`}
        >
          <Package className="w-3 h-3 mr-1 shrink-0" />
          <span>Stok: </span>
          {variant.stock ?? 0}
        </span>
      </div>
    </div>

    {/* Desktop: Delete Button - hidden on mobile since it's inline */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        onDelete();
      }}
      className="hidden sm:block absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
      title="Hapus varian"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

export default VariantList;