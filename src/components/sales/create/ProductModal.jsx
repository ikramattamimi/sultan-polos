import { X } from "lucide-react";
import UtilityService from "../../../services/UtilityServices.js";
import VariantSelector from "./VariantSelector.jsx";

// ProductModal Component
const ProductModal = ({ 
  selectedProduct, 
  products, 
  printTypes, 
  onSelectProduct, 
  onAddToCart, 
  onClose, 
  submitting 
}) => {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes('')
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">
              {selectedProduct ? `Tambah ${selectedProduct.name}` : 'Pilih Produk'}
            </h3>
            <button
              onClick={onClose}
              disabled={submitting}
              className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {!selectedProduct ? (
            <div className="space-y-3">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer"
                  onClick={() => onSelectProduct(product)}
                >
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-600">{product.categories?.name}</p>
                  <p className="text-lg font-semibold text-green-600">
                    {UtilityService.formatCurrency(product.base_price || 0)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <VariantSelector
              product={selectedProduct}
              variants={selectedProduct.product_variants || []}
              printTypes={printTypes}
              onAddToCart={onAddToCart}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;