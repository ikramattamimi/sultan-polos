import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import UtilityService from "../../../services/UtilityServices.js";
import ColorCircle, { ColorBadge } from "../../common/ColorCircle.jsx";
import SizeBadge from "../../common/SizeBadge.jsx";
import { QuantitySelection } from "./VariantSelector.jsx";

// ShoppingCartComponent
const ShoppingCartComponent = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onSubmitOrder,
  totalPrice,
  submitting,
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">
      Keranjang Belanja
    </h2>

    {cartItems.length === 0 ? (
      <EmptyCart />
    ) : (
      <div className="space-y-4">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onRemove={() => onRemoveItem(item.id)}
            onUpdateQuantity={(quantity) => onUpdateQuantity(item.id, quantity)}
            submitting={submitting}
          />
        ))}

        <CartSummary
          totalPrice={totalPrice}
          onSubmitOrder={onSubmitOrder}
          submitting={submitting}
          hasItems={cartItems.length > 0}
        />
      </div>
    )}
  </div>
);

// EmptyCart Component
const EmptyCart = () => (
  <div className="text-center py-8 text-gray-500">
    <ShoppingCart className="mx-auto h-12 w-12 mb-4 text-gray-300" />
    <p>Keranjang Anda kosong</p>
    <p className="text-sm">Tambahkan produk untuk memulai</p>
  </div>
);

// CartItem Component
const CartItem = ({ item, onRemove, onUpdateQuantity, submitting }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-2">
      <div className="flex flex-col gap-2">
        <h4 className="font-medium text-gray-900">{item.product_name}</h4>
        <div className="flex gap-2 items-center text-xs">
          <div>
            <span className="text-gray-400 me-3">Ukuran:</span>
            <SizeBadge size={item.variant_size} />
          </div>
          <div>
            <span className="text-gray-400 me-3">Warna:</span>
            <ColorBadge
              color={item.variant_color_hex}
              title={item.variant_color}
            />
          </div>
          {item.print_type && (
            <div>
              <span className="text-gray-400 me-3">Sablon:</span>
              <SizeBadge size={item.print_type.name} />
            </div>
          )}
        </div>
        {/* <p className="text-xs text-gray-500">
          <span>Stok: {item.variant.stock}</span>

          {item.is_printed && (
            <span>
              {" "}
              | Print ({item.print_type.name}):{" "}
              {UtilityService.formatCurrency(item.print_price)}
            </span>
          )}
        </p> */}

        <p className="text-sm text-gray-500 line-through">
          Base:
          {UtilityService.formatCurrency(item.unit_price + item.print_price)}
        </p>
        <p className="text-md text-gray-500">Aktual: {UtilityService.formatCurrency(item.actual_price)}</p>

        
      </div>
      <button
        onClick={onRemove}
        disabled={submitting}
        className="text-red-500 hover:text-red-700 disabled:opacity-50"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
    <div className="flex justify-between items-center">
          <QuantitySelection
            quantity={item.quantity}
            maxQuantity={item.variant.stock}
            onQuantityChange={onUpdateQuantity}
            disabled={submitting}
            showLabel={false}
          />

          <p className="text-lg my-3 text-green-600">
            {UtilityService.formatCurrency(item.total_actual)}
          </p>

        </div>
  </div>
);

// QuantitySelector Component
const QuantitySelector = ({
  quantity,
  maxStock,
  onDecrease,
  onIncrease,
  disabled,
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onDecrease}
      disabled={disabled}
      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
    >
      <Minus className="h-4 w-4" />
    </button>
    <span className="font-medium px-3">{quantity}</span>
    <button
      onClick={onIncrease}
      disabled={disabled || quantity >= maxStock}
      className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300 disabled:opacity-50"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
);

// CartSummary Component
const CartSummary = ({ totalPrice, onSubmitOrder, submitting, hasItems }) => (
  <>
    <div className="border-t pt-4">
      <div className="flex justify-between items-center text-xl font-bold">
        <span>Total:</span>
        <span className="text-green-600">
          {UtilityService.formatCurrency(totalPrice)}
        </span>
      </div>
    </div>

    <button
      onClick={onSubmitOrder}
      disabled={submitting || !hasItems}
      className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
    >
      {submitting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Membuat Order...
        </>
      ) : (
        "Buat Order Penjualan"
      )}
    </button>
  </>
);

export default ShoppingCartComponent;
