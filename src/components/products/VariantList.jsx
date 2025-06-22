import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Package } from "lucide-react";
import AddVariantModal from "./AddVariantModal.jsx";
import VariantDetailModal from "./VariantDetailModal.jsx";

// Component untuk List Varian
const VariantList = ({ productId, variants, onDelete, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // if (variants.length === 0) {
  //   return (
  //     <div className="text-center text-gray-500 py-8">
  //       Belum ada varian untuk produk ini
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className=" grid grid-cols-3 gap-2">
        {variants.length > 0 &&
          variants.map((variant) => (
            <div
              key={variant.id}
              onClick={() => {
                setSelectedVariant(variant);
                setIsDetailModalOpen(true);
              }}
              className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center"
            >
              <div className="flex-1 grid grid-cols-1 gap-4">
                <div>
                  <span className="font-medium text-gray-900">
                    {variant.colors.name} - {variant.sizes.name}
                  </span>
                </div>
                {/* <div>
                <span className="text-gray-600">SKU: {variant.sku}</span>
              </div> */}
                <div>
                  <span className="text-green-600 font-medium">
                    Rp {variant.selling_price.toLocaleString("id-ID")}
                  </span>
                </div>
                <div>
                  <span className="text-blue-600">Stok: {variant.stock}</span>
                </div>
              </div>
              <button
                onClick={() => onDelete(variant.id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded transition-colors ml-4"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        {/* <button onClick={() => setIsModalOpen(true)}> */}
        <div
          onClick={() => setIsModalOpen(true)}
          className="bg-green-300 p-4 rounded-lg border border-gray-200 flex justify-center items-center cursor-pointer h-full"
        >
          <Plus className="w-5 h-5" />
        </div>
        {/* </button> */}
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

export default VariantList;
