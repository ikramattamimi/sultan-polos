// ===========================================
// KOMPONEN UTAMA - CreateSalesPage
// ===========================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../services/ProductService.js";
import { SaleService } from "../services/SaleService.js";
import MasterDataService from "../services/MasterDataService.js";

// Import komponen modular
import ErrorAlert from "../components/common/ErrorAlert.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import CreateSalesHeader from "../components/sales/create/CreateSalesHeader.jsx";
import ProductSelector from "../components/sales/create/ProductSelector.jsx";
import ShoppingCartComponent from "../components/sales/create/ShoppingCart.jsx";
import ProductModal from "../components/sales/create/ProductModal.jsx";
import OrderConfirmationModal from "../components/sales/create/OrderConfirmationModal.jsx";
const SalesCreatePage = () => {
  const navigate = useNavigate();

  // State data
  const [products, setProducts] = useState([]);
  const [printTypes, setPrintTypes] = useState([]);
  const [customers, setCustomers] = useState([]);

  // State loading
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // State form
  const [orderNumber, setOrderNumber] = useState("");
  const [customer, setCustomer] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Load data awal
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, printTypesData] = await Promise.all([
        ProductService.getAll(true),
        MasterDataService.printTypes.getAll(),
      ]);

      setProducts(productsData || []);
      setPrintTypes(printTypesData || []);

      generateOrderNumber();
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Gagal memuat data. Silakan refresh halaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Ambil daftar customer
  useEffect(() => {
    SaleService.getCustomerNames()
      .then((data) => setCustomers(data || []))
      .catch(() => setCustomers([]));
  }, []);

  // Generate nomor order unik
  const generateOrderNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    setOrderNumber(`ORD-${dateStr}-${randomStr}`);
  };

  // Tambah item ke keranjang
  const addToCart = (variant, quantity, isPrinted, printType, actualPrice) => {
    const product = products.find((p) => p.id === variant.product_id);
    const unitPrice = product.reference_price;
    const printPrice = isPrinted && printType ? printType.price : 0;

    const cartItem = {
      id: Date.now(),
      variant_id: variant.id,
      product_name: product.name,
      variant_color: variant.colors?.name || "N/A",
      variant_color_hex: variant.colors?.hex_code || "N/A",
      variant_size: variant.sizes?.name || "N/A",
      variant,
      quantity,
      unit_price: unitPrice,
      print_price: printPrice,
      actual_price: actualPrice,
      is_printed: isPrinted,
      print_type: printType,
      total_actual: actualPrice * quantity,
      print_type_id: printType?.id || null,
    };

    setCartItems([...cartItems, cartItem]);
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  // Hapus item dari keranjang
  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Update kuantitas item keranjang
  const updateCartQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      cartItems.map((item) => {
        if (item.id === itemId) {
          const totalActual = item.actual_price * newQuantity;
          return { ...item, quantity: newQuantity, total_actual: totalActual };
        }
        return item;
      })
    );
  };

  // Hitung total harga
  const getTotalActualPrice = () => {
    return cartItems.reduce((total, item) => total + item.total_actual, 0);
  };

  // Handler untuk tombol "Buat Order Penjualan"
  const handleRequestOrder = () => {
    setShowOrderModal(true);
  };

  // Handler submit order dari modal
  const handleConfirmOrder = async () => {
    // if (!customer || customer.trim() === "") {
    //   alert("Silakan isi nama customer terlebih dahulu.");
    //   return;
    // }
    setShowOrderModal(false);
    await handleSubmitOrder();
  };

  // Handle submit order
  const handleSubmitOrder = async () => {
    // if (!customer || customer.trim() === "") {
    //   alert('Silakan pilih atau isi nama customer terlebih dahulu.');
    //   return;
    // }
    if (cartItems.length === 0) {
      alert("Silakan tambahkan item ke keranjang sebelum submit.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      // Siapkan data penjualan
      const saleData = {
        order_number: orderNumber,
        customer: customer,
        total_price: getTotalActualPrice(),
        sale_date: new Date().toISOString(),
      };

      // Siapkan item penjualan
      const saleItems = cartItems.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        actual_price: item.actual_price,
        is_printed: item.is_printed,
        print_type_id: item.print_type_id,
      }));

      // Buat penjualan
      await SaleService.createSaleAndItems(saleData, saleItems);

      loadData();
      alert("Order berhasil dibuat!");

      // Reset form
      setCartItems([]);
      generateOrderNumber();

      // Route to sales list
      navigate("/sales"); // Uncomment if using react-router for navigation
    } catch (err) {
      console.error("Error creating order:", err);
      setError("Gagal membuat order. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Memuat produk..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Error Message */}
        {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

        {/* Header */}
        <CreateSalesHeader
          orderNumber={orderNumber}
          setOrderNumber={setOrderNumber}
          customer={customer}
          setCustomer={setCustomer}
          submitting={submitting}
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Product Selection */}
          <div className="lg:col-span-3">
            <ProductSelector
              products={products}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onProductSelect={(product) => {
                setSelectedProduct(product);
                setShowProductModal(true);
              }}
              onAddProductClick={() => setShowProductModal(true)}
              submitting={submitting}
            />
          </div>

          {/* Shopping Cart */}
          <div className="lg:col-span-2">
            <ShoppingCartComponent
              cartItems={cartItems}
              onRemoveItem={removeFromCart}
              onUpdateQuantity={updateCartQuantity}
              onRequestOrder={handleRequestOrder} // Ganti dari onSubmitOrder
              totalPrice={getTotalActualPrice()}
              submitting={submitting}
            />
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          selectedProduct={selectedProduct}
          products={products}
          printTypes={printTypes}
          onSelectProduct={setSelectedProduct}
          onAddToCart={addToCart}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          submitting={submitting}
        />
      )}

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        open={showOrderModal}
        orderNumber={orderNumber}
        setOrderNumber={setOrderNumber}
        customer={customer}
        setCustomer={setCustomer}
        customers={customers}
        submitting={submitting}
        onConfirm={handleConfirmOrder}
        onCancel={() => setShowOrderModal(false)}
        totalPrice={getTotalActualPrice()}
      />
    </div>
  );
};

export default SalesCreatePage;
