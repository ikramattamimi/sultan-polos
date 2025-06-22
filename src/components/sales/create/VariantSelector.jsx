// ===========================================
// VARIANT SELECTOR COMPONENT
// ===========================================

import React, { useState, useEffect } from 'react';
import { Palette, Ruler, Package, Printer, Plus, ShoppingCart, Minus } from 'lucide-react';
import utilityService from '../../../services/utilityServices.js';

const VariantSelector = ({ 
  product, 
  variants, 
  printTypes, 
  onAddToCart, 
  submitting 
}) => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPrinted, setIsPrinted] = useState(false);
  const [selectedPrintType, setSelectedPrintType] = useState(null);
  const [actualPrice, setActualPrice] = useState(0)

  // Reset state ketika produk berubah
  useEffect(() => {
    setSelectedVariant(null);
    setQuantity(1);
    setIsPrinted(false);
    setSelectedPrintType(null);
  }, [product]);

  // Grup varian berdasarkan warna untuk tampilan yang lebih baik
  const groupedVariants = variants.reduce((acc, variant) => {
    const colorName = variant.colors?.name || 'Tanpa Warna';
    if (!acc[colorName]) {
      acc[colorName] = [];
    }
    acc[colorName].push(variant);
    return acc;
  }, {});

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Silakan pilih varian terlebih dahulu');
      return;
    }

    if (quantity <= 0) {
      alert('Kuantitas harus lebih dari 0');
      return;
    }

    if (quantity > selectedVariant.stock) {
      alert('Kuantitas melebihi stok yang tersedia');
      return;
    }

    if (isPrinted && !selectedPrintType) {
      alert('Silakan pilih jenis print');
      return;
    }

    onAddToCart(selectedVariant, quantity, isPrinted, selectedPrintType, actualPrice);
  };

  const calculateTotalPrice = () => {
    if (!selectedVariant) return 0;
    
    const unitPrice = selectedVariant.selling_price || 0;
    const printPrice = isPrinted && selectedPrintType ? selectedPrintType.price : 0;
    return (unitPrice + printPrice) * quantity;
  };

  const calculateActualPrice = () => {
    if (!selectedVariant) return 0;
    
    const price = actualPrice || 0;
    return price * quantity;
  };

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <ProductInfo product={product} />

      {/* Variant Selection */}
      <VariantSelection 
        groupedVariants={groupedVariants}
        selectedVariant={selectedVariant}
        onSelectVariant={setSelectedVariant}
      />

      {/* Selected Variant Details */}
      {selectedVariant && (
        <SelectedVariantDetails variant={selectedVariant} />
      )}

      {/* Print Options */}
      <PrintOptions
        isPrinted={isPrinted}
        onPrintedChange={setIsPrinted}
        printTypes={printTypes}
        selectedPrintType={selectedPrintType}
        onPrintTypeChange={setSelectedPrintType}
      />

      <div className="grid grid-cols-2 gap-4">
        {/* Quantity Selection */}
        {selectedVariant && (
          <QuantitySelection
            quantity={quantity}
            maxQuantity={selectedVariant.stock}
            onQuantityChange={setQuantity}
          />
        )}

        <div>
          <h6 className="font-semibold text-gray-900 mb-3">Harga Satuan Aktual <span className="text-red-500">*</span></h6>
          <div className="flex gap-3">
            <label className="py-2">Rp</label>
            <input
              type="number"
              // value={actualPrice ?? variant.selling_price}
              onChange={(event) => {
                
                const input = event.target;
                const position = input.selectionStart;
                const originalLength = input.value.length;
                
                const numericValue = input.value.replace(/[^\d]/g, "");
                setActualPrice(numericValue);

                const formatted = new Intl.NumberFormat("id-ID").format(numericValue);

                input.value = formatted;

                const newLength = formatted.length;
                input.setSelectionRange(
                  position + (newLength - originalLength),
                  position + (newLength - originalLength)
                );
              }}
              className="w-25 ring-1 ring-gray-300 rounded-md focus:outline-none p-2"
            />

          </div>
        </div>
      </div>

      {/* Price Summary */}
      {selectedVariant && (

        <div className="grid grid-cols-2 gap-2">
          <PriceSummary
            variant={selectedVariant}
            quantity={quantity}
            isPrinted={isPrinted}
            printType={selectedPrintType}
            totalPrice={calculateTotalPrice()}
          />
          
          <ActualPriceSummary
            variant={selectedVariant}
            quantity={quantity}
            isPrinted={isPrinted}
            printType={selectedPrintType}
            totalActualPrice={calculateActualPrice()}
            actualPrice={actualPrice}
            setActualPrice={setActualPrice}
          />
        </div>

      )}

      {/* Add to Cart Button */}
      <AddToCartButton
        onClick={handleAddToCart}
        disabled={!selectedVariant || submitting || !actualPrice}
        submitting={submitting}
      />
    </div>
  );
};

// ===========================================
// SUB-COMPONENTS
// ===========================================

// ProductInfo Component
const ProductInfo = ({ product }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="text-lg font-semibold text-gray-900">{product.name}</h4>
    <div className="flex items-center text-sm text-gray-600 mt-1">
      <span>{product.categories?.name}</span>
      <span className="mx-2">•</span>
      <span>{product.types?.name}</span>
    </div>
    <p className="text-lg font-bold text-green-600 mt-2">
      Harga Dasar: {utilityService.formatCurrency(product.base_price || 0)}
    </p>
    {product.description && (
      <p className="text-sm text-gray-600 mt-2">{product.description}</p>
    )}
  </div>
);

// VariantSelection Component
const VariantSelection = ({ groupedVariants, selectedVariant, onSelectVariant }) => (
  <div>
    <h5 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
      <Palette className="mr-2 h-4 w-4" />
      Pilih Varian
    </h5>
    
    <div className="space-y-4">
      {Object.entries(groupedVariants).map(([colorName, colorVariants]) => (
        <ColorVariantGroup
          key={colorName}
          colorName={colorName}
          variants={colorVariants}
          selectedVariant={selectedVariant}
          onSelectVariant={onSelectVariant}
        />
      ))}
    </div>
  </div>
);

// ColorVariantGroup Component
const ColorVariantGroup = ({ colorName, variants, selectedVariant, onSelectVariant }) => (
  <div className="border border-gray-200 rounded-lg p-3">
    <div className="flex items-center mb-2">
      <div 
        className="w-4 h-4 rounded-full border border-gray-300 mr-2"
        style={{ backgroundColor: variants[0]?.colors?.hex_code || '#ccc' }}
      ></div>
      <span className="font-medium text-gray-800">{colorName}</span>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {variants.map(variant => (
        <VariantCard
          key={variant.id}
          variant={variant}
          isSelected={selectedVariant?.id === variant.id}
          onSelect={() => onSelectVariant(variant)}
        />
      ))}
    </div>
  </div>
);

// VariantCard Component
const VariantCard = ({ variant, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`p-3 rounded-lg border text-left transition-colors ${
      isSelected
        ? 'border-blue-500 bg-blue-50 text-blue-900'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    disabled={variant.stock === 0}
  >
    <div className="flex items-center justify-between mb-1">
      <span className="text-sm font-medium flex items-center">
        <Ruler className="h-3 w-3 mr-1" />
        {variant.sizes?.name || 'N/A'}
      </span>
      <span className={`text-xs px-2 py-1 rounded ${
        variant.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {variant.stock > 0 ? `Stok: ${variant.stock}` : 'Habis'}
      </span>
    </div>
    <div className="text-sm font-semibold text-green-600">
      {utilityService.formatCurrency(variant.selling_price || 0)}
    </div>
  </button>
);

// SelectedVariantDetails Component
const SelectedVariantDetails = ({ variant }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h6 className="font-semibold text-blue-900 mb-2 flex items-center">
      <Package className="h-4 w-4 mr-2" />
      Varian Terpilih
    </h6>
    <div className="grid grid-cols-2 gap-4 text-sm">
      <div>
        <span className="text-blue-700 font-medium">Ukuran:</span>
        <span className="ml-2 text-blue-900">{variant.sizes?.name || 'N/A'}</span>
      </div>
      <div>
        <span className="text-blue-700 font-medium">Warna:</span>
        <span className="ml-2 text-blue-900">{variant.colors?.name || 'N/A'}</span>
      </div>
      <div>
        <span className="text-blue-700 font-medium">Stok:</span>
        <span className="ml-2 text-blue-900">{variant.stock} unit</span>
      </div>
      <div>
        <span className="text-blue-700 font-medium">Harga:</span>
        <span className="ml-2 text-blue-900 font-semibold">
          {utilityService.formatCurrency(variant.selling_price || 0)}
        </span>
      </div>
      {variant.convections && (
        <div className="col-span-2">
          <span className="text-blue-700 font-medium">Konveksi:</span>
          <span className="ml-2 text-blue-900">{variant.convections.name}</span>
        </div>
      )}
    </div>
  </div>
);

// QuantitySelection Component
const QuantitySelection = ({ quantity, maxQuantity, onQuantityChange }) => (
  <div>
    <h6 className="font-semibold text-gray-900 mb-3">Kuantitas</h6>
    <div className="flex items-center space-x-4">
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="p-2 hover:bg-gray-100 rounded-l-lg"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="number"
          min="1"
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 1;
            onQuantityChange(Math.min(maxQuantity, Math.max(1, value)));
          }}
          className="w-20 text-center py-2 border-0 focus:outline-none"
        />
        <button
          onClick={() => onQuantityChange(Math.min(maxQuantity, quantity + 1))}
          disabled={quantity >= maxQuantity}
          className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <span className="text-sm text-gray-600">
        Maksimal: {maxQuantity} unit
      </span>
    </div>
  </div>
);

// PrintOptions Component
const PrintOptions = ({ 
  isPrinted, 
  onPrintedChange, 
  printTypes, 
  selectedPrintType, 
  onPrintTypeChange 
}) => (
  <div>
    <div>
      <label className="flex items-center">
        <input
          type="checkbox"
          checked={isPrinted}
          onChange={(e) => {
            onPrintedChange(e.target.checked);
            if (!e.target.checked) {
              onPrintTypeChange(null);
            }
          }}
          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <h6 className="font-semibold text-gray-900 flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          Opsi Sablon
        </h6>
      </label>
    </div>
    
    <div>

      {isPrinted && (
        <div className=" space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Pilih Jenis Print:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {printTypes.map(printType => (
              <PrintTypeOption
                key={printType.id}
                printType={printType}
                isSelected={selectedPrintType?.id === printType.id}
                onSelect={() => onPrintTypeChange(printType)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);

// PrintTypeOption Component
const PrintTypeOption = ({ printType, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`p-3 rounded-lg border text-left transition-colors ${
      isSelected
        ? 'border-purple-500 bg-purple-50 text-purple-900'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className="flex justify-between items-center">
      <div>
        <span className="font-medium">{printType.name}</span>
        {printType.description && (
          <p className="text-sm text-gray-600 mt-1">{printType.description}</p>
        )}
      <span className="font-semibold text-purple-600">
        +{utilityService.formatCurrency(printType.price)}
      </span>
      </div>
    </div>
  </button>
);

// PriceSummary Component
const PriceSummary = ({ variant, quantity, isPrinted, printType, totalPrice }) => {
  const unitPrice = variant.selling_price || 0;
  const printPrice = isPrinted && printType ? printType.price : 0;
  const subtotal = unitPrice * quantity;
  const printTotal = printPrice * quantity;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h6 className="font-semibold text-gray-900 mb-3">Ringkasan Harga</h6>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Harga satuan:</span>
          <span>{utilityService.formatCurrency(unitPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Kuantitas:</span>
          <span>{quantity} unit</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal produk:</span>
          <span>{utilityService.formatCurrency(subtotal)}</span>
        </div>
        
        {isPrinted && printType && (
          <>
            <div className="flex justify-between text-purple-600">
              <span>Print ({printType.name}):</span>
              <span>+{utilityService.formatCurrency(printPrice)} x {quantity}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Total print:</span>
              <span>{utilityService.formatCurrency(printTotal)}</span>
            </div>
          </>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">
              {utilityService.formatCurrency(totalPrice)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

// Actual Price
const ActualPriceSummary = ({ variant, quantity, isPrinted, printType, totalActualPrice, actualPrice }) => {
  const unitPrice = variant.selling_price || 0;
  const printPrice = isPrinted && printType ? printType.price : 0;
  const subtotal = unitPrice * quantity;
  const printTotal = printPrice * quantity;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      
      <h6 className="font-semibold text-gray-900 mb-3">Harga Aktual</h6>
      
      
      <div className="space-y-2 text-sm">

        <div className="flex justify-between">
          <span>Harga satuan (termasuk sablon):</span>
          <span>{utilityService.formatCurrency(actualPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Kuantitas:</span>
          <span>{quantity} unit</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal produk:</span>
          <span>{utilityService.formatCurrency(subtotal)}</span>
        </div>
        
        {isPrinted && printType && (
          <>
            <div className="flex justify-between text-purple-600">
              <span>Print ({printType.name}):</span>
              <span>+{utilityService.formatCurrency(printPrice)} x {quantity}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Total print:</span>
              <span>{utilityService.formatCurrency(printTotal)}</span>
            </div>
          </>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total Aktual:</span>
            <span className="text-green-600">
              {utilityService.formatCurrency(totalActualPrice)}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

// AddToCartButton Component
const AddToCartButton = ({ onClick, disabled, submitting }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
  >
    {submitting ? (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Menambahkan...
      </>
    ) : (
      <>
        <ShoppingCart className="h-4 w-4 mr-2" />
        Tambah ke Keranjang
      </>
    )}
  </button>
);

export default VariantSelector;