import React from "react";

/**
 * ColorCircle - Komponen bulatan warna untuk preview warna produk/varian
 * @param {string} color - kode hex warna (wajib, contoh: #FF0000)
 * @param {string} [title] - tooltip/teks warna
 * @param {string} [className] - kelas tambahan
 * @param {number|string} [size] - diameter px (default: 20)
 */
const ColorCircle = ({
  color = "#ccc",
  title = "Warna",
  className = "",
  size = 20,
}) => (
  <span
    title={title || color || "Warna"}
    className={`inline-block rounded-full border border-gray-300 align-middle ${className}`}
    style={{
      backgroundColor: color,
      width: size,
      height: size,
      minWidth: size,
      minHeight: size,
    }}
  />
);

export const ColorBadge = ({ color = "#ccc", title = "Warna", className = "" }) => (
  <>
    <div
      title={title || color || "Warna"}
      className={`p-1 inline-flex gap-2 align-center rounded-sm border text-xs bg-gray-100 border-gray-200 align-middle ${className}`}
    >
      <ColorCircle color={color} title={title} size={15} />
      <span className="text-gray-700 dark:text-gray-50">{title || color}</span>
    </div>
  </>
);

export default ColorCircle;
