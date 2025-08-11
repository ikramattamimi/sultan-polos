// ===========================================
// VARIANT SELECTOR COMPONENT
// ===========================================

import React, { useState, useEffect } from 'react';
import { Palette, Ruler, Package, Printer, Plus, ShoppingCart, Minus } from 'lucide-react';
import UtilityService from '../../../services/UtilityServices.js';
import { Input, PriceInput } from '../../ui/forms/index.js';

const VariantSelector = ({ 
  product, 
  variants, 
  printTypes, 
  onAddToCart, 
  submitting 
}) => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isPrinted, setIsPrinted] = useState(false);
  const [selectedPrintType, setSelectedPrintType] = useState(null);
  const [actualPrice, setActualPrice] = useState(0);
  const [autoActualPrice, setAutoActualPrice] = useState(false);

  // Reset state ketika produk berubah
  useEffect(() => {
    setSelectedColor(null);
    setSelectedVariant(null);
    setQuantity(1);
    setIsPrinted(false);
    setSelectedPrintType(null);
  }, [product]);

  // Sinkronkan harga aktual dengan referensi saat checkbox aktif atau referensi berubah
  useEffect(() => {
    if (autoActualPrice) {
      setActualPrice(product.reference_price || 0);
    }
  }, [autoActualPrice, product?.reference_price]);

  // Group variants by color
  const colorGroups = variants.reduce((acc, variant) => {
    const colorName = variant.colors?.name || 'Tanpa Warna';
    if (!acc[colorName]) acc[colorName] = [];
    acc[colorName].push(variant);
    return acc;
  }, {});

  // Get available colors
  const colorOptions = Object.entries(colorGroups).map(([colorName, colorVariants]) => ({
    colorName,
    colorHex: colorVariants[0]?.colors?.hex_code || '#ccc',
    variants: colorVariants,
  }));

  // Get size options for selected color
  const sizeOptions = selectedColor
    ? colorGroups[selectedColor]?.map(variant => ({
        id: variant.id,
        sizeName: variant.sizes?.name || 'N/A',
        stock: variant.stock,
        selling_price: variant.selling_price,
        variant,
      })) || []
    : [];

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert('Silakan pilih varian terlebih dahulu');
      return;
    }

    if (quantity <= 0) {
      alert('Kuantitas harus lebih dari 0');
      return;
    }

    // if (quantity > selectedVariant.stock) {
    //   alert('Kuantitas melebihi stok yang tersedia');
    //   return;
    // }

    if (isPrinted && !selectedPrintType) {
      alert('Silakan pilih jenis print');
      return;
    }

    onAddToCart(selectedVariant, quantity, isPrinted, selectedPrintType, actualPrice);
  };

  const calculateTotalPrice = () => {
    if (!selectedVariant) return 0;
    
    const unitPrice = parseInt(product.reference_price) || 0;
    const printPrice = isPrinted && selectedPrintType ? parseInt(selectedPrintType.price) : 0;
    return (unitPrice + printPrice) * quantity;
  };

  const calculateActualPrice = () => {
    if (!selectedVariant) return 0;
    
    const price = parseInt(actualPrice) || 0;
    const printPrice = isPrinted && selectedPrintType ? parseInt(selectedPrintType.price) : 0;
    return (price + printPrice) * quantity;
  };

  return (
    <div className="space-y-6">
      {/* Product Info */}
      <ProductInfo product={product} />

      {/* Print Options */}
      <PrintOptions
        isPrinted={isPrinted}
        onPrintedChange={setIsPrinted}
        printTypes={printTypes}
        selectedPrintType={selectedPrintType}
        onPrintTypeChange={setSelectedPrintType}
      />

      {/* Color Selection */}
      <ColorSelection
        colorOptions={colorOptions}
        selectedColor={selectedColor}
        onSelectColor={(color) => {
          setSelectedColor(color);
          setSelectedVariant(null);
        }}
      />

      {/* Size Selection */}
      {selectedColor && (
        <SizeSelection
          sizeOptions={sizeOptions}
          selectedVariant={selectedVariant}
          onSelectVariant={(variant) => setSelectedVariant(variant)}
        />
      )}

      {/* Quantity Selection */}
      <QuantitySelection
        quantity={quantity}
        maxQuantity={selectedVariant?.stock}
        onQuantityChange={setQuantity}
        disabled={!selectedVariant}
      />
      

      <div className="grid grid-cols-2 gap-8">

        <div className="w-50">
          <PriceInput 
            label="Referensi Harga Satuan"
            value={product.reference_price || 0}
            leftIcon="Rp"
            disabled
          />
        </div>
        <div className="w-50">
          <PriceInput
            label="Harga Satuan Aktual"
            value={actualPrice}
            onChange={setActualPrice}
            leftIcon="Rp"
            required
            disabled={autoActualPrice}
          />
          
          <label className="flex items-center text-sm mt-2">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 border text-blue-600 focus:ring-blue-500 border-gray-100 rounded"
              checked={autoActualPrice}
              onChange={(e) => {
                const checked = e.target.checked;
                setAutoActualPrice(checked);
                if (checked) {
                  setActualPrice(product.reference_price || 0);
                }
              }}
            />
            Samakan dengan referensi
          </label>
        </div>
      </div>

      {/* Price Summary */}
      {selectedVariant && (
        <div className="grid grid-cols-2 gap-8">
          <PriceSummary
            price={product.reference_price || 0}
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
      Harga Dasar: {UtilityService.formatCurrency(product.reference_price || 0)}
    </p>
    {product.description && (
      <p className="text-sm text-gray-600 mt-2">{product.description}</p>
    )}
  </div>
);

// QuantitySelection Component
export const QuantitySelection = ({ quantity, maxQuantity, onQuantityChange, disabled, showLabel = true }) => (
  <div>
    {showLabel && <h6 className="font-semibold text-gray-900 mb-3">Kuantitas</h6>}
    <div className="flex items-center space-x-4">
      <div className="w-36">
        <Input
          type="number"
          // min={1}
          max={maxQuantity}
          value={quantity}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            onQuantityChange(value);
          }}
          disabled={disabled}
          className="text-center py-1 px-2 border-1 border-gray-300 shadow-none"
          leftIcon={<Minus className="h-4 w-4" />}
          rightIcon={<Plus className="h-4 w-4" />}
          onLeftIconClick={() => onQuantityChange(quantity - 1)}
          onRightIconClick={() => onQuantityChange(quantity + 1)}
        />
      </div>
      <span className="text-sm text-gray-600">
        Stok: {maxQuantity}
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
        +{UtilityService.formatCurrency(printType.price)}
      </span>
      </div>
    </div>
  </button>
);

// PriceSummary Component
const PriceSummary = ({ price, quantity, isPrinted, printType, totalPrice }) => {
  const unitPrice = price || 0;
  const printPrice = isPrinted && printType ? printType.price : 0;
  const subtotal = unitPrice * quantity;
  const printTotal = printPrice * quantity;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h6 className="font-semibold text-gray-900 mb-3">Ringkasan Harga</h6>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Harga satuan:</span>
          <span>{UtilityService.formatCurrency(unitPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Kuantitas:</span>
          <span>{quantity} unit</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal produk:</span>
          <span>{UtilityService.formatCurrency(subtotal)}</span>
        </div>
        
        {isPrinted && printType && (
          <>
            <div className="flex justify-between text-purple-600">
              <span>Print ({printType.name}):</span>
              <span>+{UtilityService.formatCurrency(printPrice)} x {quantity}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Total print:</span>
              <span>{UtilityService.formatCurrency(printTotal)}</span>
            </div>
          </>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span className="text-green-600">
              {UtilityService.formatCurrency(totalPrice)}
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
          <span>{UtilityService.formatCurrency(actualPrice)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Kuantitas:</span>
          <span>{quantity} unit</span>
        </div>
        
        <div className="flex justify-between">
          <span>Subtotal produk:</span>
          <span>{UtilityService.formatCurrency(subtotal)}</span>
        </div>
        
        {isPrinted && printType && (
          <>
            <div className="flex justify-between text-purple-600">
              <span>Print ({printType.name}):</span>
              <span>+{UtilityService.formatCurrency(printPrice)} x {quantity}</span>
            </div>
            <div className="flex justify-between text-purple-600">
              <span>Total print:</span>
              <span>{UtilityService.formatCurrency(printTotal)}</span>
            </div>
          </>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total Aktual:</span>
            <span className="text-green-600">
              {UtilityService.formatCurrency(totalActualPrice)}
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

// ColorSelection Component
const ColorSelection = ({ colorOptions, selectedColor, onSelectColor }) => (
  <div>
    <h5 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
      <Palette className="mr-2 h-4 w-4" />
      Pilih Warna
    </h5>
    <div className="flex flex-wrap gap-3">
      {colorOptions.map(({ colorName, colorHex }) => (
        <button
          key={colorName}
          type="button"
          onClick={() => onSelectColor(colorName)}
          className={`flex items-center px-3 py-2 rounded-lg border transition-colors ${
            selectedColor === colorName
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <span
            className="w-4 h-4 rounded-full border border-gray-300 mr-2"
            style={{ backgroundColor: colorHex }}
          ></span>
          <span>{colorName}</span>
        </button>
      ))}
    </div>
  </div>
);

// SizeSelection Component
const SizeSelection = ({ sizeOptions, selectedVariant, onSelectVariant }) => (
  <div>
    <h5 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
      <Ruler className="mr-2 h-4 w-4" />
      Pilih Ukuran
    </h5>
    <div className="flex flex-wrap gap-3">
      {sizeOptions.map(({ id, sizeName, variant }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelectVariant(variant)}
          className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
            selectedVariant?.id === id
              ? 'border-blue-500 bg-blue-50 text-blue-900'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          {sizeName}
        </button>
      ))}
    </div>
  </div>
);

export default VariantSelector;