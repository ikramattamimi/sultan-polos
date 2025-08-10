import React, { useRef } from 'react';
import Input from './Input';

// ...existing Input component...

/**
 * InputHarga
 * Komponen input harga dengan format ribuan otomatis (IDR).
 * Props: label, value, onChange, disabled, required, className, leftIcon, rightIcon, dll.
 */
export const PriceInput = ({
  label,
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  leftIcon = "Rp",
  ...props
}) => {
  const inputRef = useRef();

  // Hanya angka, format ribuan, tetap bisa edit caret
  const handleChange = (event) => {
    const input = event.target;
    const rawValue = input.value.replace(/[^\d]/g, "");
    if (onChange) onChange(rawValue);

    // Format tampilan
    const formatted = new Intl.NumberFormat("id-ID").format(rawValue || 0);
    input.value = formatted;

    // Atur caret agar tetap di posisi benar
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(formatted.length, formatted.length);
      }
    }, 0);
  };

  // Tampilkan value terformat
  const displayValue = value ? new Intl.NumberFormat("id-ID").format(value) : "";

  return (
    <Input
      ref={inputRef}
      label={label}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      disabled={disabled}
      required={required}
      className={className}
      leftIcon={leftIcon}
      {...props}
    />
  );
};

export default PriceInput;