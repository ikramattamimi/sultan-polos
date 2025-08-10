import React, { useState, useEffect } from "react";
import Input from "../../ui/forms/Input.jsx";
import PriceInput from "../../ui/forms/PriceInput.jsx";

const OrderConfirmationModal = ({
  open,
  orderNumber,
  setOrderNumber,
  customer,
  setCustomer,
  customers,
  submitting,
  onConfirm,
  onCancel,
  totalPrice = 0,
}) => {
  const [orderDate, setOrderDate] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Helper untuk membatasi nilai pembayaran 0..totalPrice
  const clampAmount = (val) => {
    const n = Number(val);
    if (Number.isNaN(n)) return "";
    const max = Number(totalPrice) || 0;
    return Math.min(Math.max(0, n), max);
  };

  // Set tanggal order otomatis ke hari ini saat modal dibuka
  useEffect(() => {
    if (open) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      setOrderDate(`${yyyy}-${mm}-${dd}`);
      setIsPaid(false);
      setPaymentAmount("");
    }
  }, [open]);

  // Jika checkbox lunas diaktifkan, isi otomatis dengan totalPrice
  useEffect(() => {
    if (isPaid) {
      setPaymentAmount(totalPrice);
    }
  }, [isPaid, totalPrice]);

  // Jika checkbox lunas dimatikan, kosongkan input pembayaran
  useEffect(() => {
    if (!isPaid) {
      setPaymentAmount("");
    }
  }, [isPaid]);

  // Clamp paymentAmount ketika totalPrice berubah
  useEffect(() => {
    if (paymentAmount === "" || isPaid) return;
    const clamped = clampAmount(paymentAmount);
    if (clamped !== paymentAmount) setPaymentAmount(clamped);
  }, [totalPrice]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Konfirmasi Order</h2>
        <div className="mb-4">
          <Input
            label="Nomor Order"
            value={orderNumber}
            onChange={e => setOrderNumber(e.target.value)}
            disabled={submitting}
            placeholder="Nomor order"
          />
        </div>
        <div className="mb-4">
          <Input
            label="Nama Customer"
            value={customer}
            onChange={e => setCustomer(e.target.value)}
            disabled={submitting}
            placeholder="Masukkan nama customer"
            list="customer-list"
          />
          <datalist id="customer-list">
            {customers.map((c, idx) => (
              <option key={idx} value={c} />
            ))}
          </datalist>
        </div>
        <div className="mb-4">
          <Input
            label="Tanggal Order"
            type="date"
            value={orderDate}
            onChange={e => setOrderDate(e.target.value)}
            disabled={submitting}
            required
          />
        </div>
        <div className="mb-4">
          <PriceInput
            label="Total Pembayaran"
            value={paymentAmount}
            onChange={(v) => setPaymentAmount(clampAmount(v))}
            disabled={isPaid}
          />
          <div className="flex items-center mt-2">
            <input
              id="isPaid"
              type="checkbox"
              checked={isPaid}
              onChange={e => setIsPaid(e.target.checked)}
              disabled={submitting}
              className="mr-2"
            />
            <label htmlFor="isPaid" className="text-sm text-gray-700">
              Sudah Lunas
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded bg-gray-200">Batal</button>
          <button
            onClick={() => onConfirm({ orderDate, isPaid, paymentAmount })}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={submitting}
          >
            {submitting ? "Memproses..." : "Konfirmasi & Buat Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationModal;