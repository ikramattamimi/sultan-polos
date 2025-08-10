import React from "react";

/**
 * SizeBadge - Komponen badge untuk menampilkan ukuran produk/varian
 * @param {string|number} size - Nama/label ukuran
 * @param {string} [className] - kelas tambahan
 */
const SizeBadge = ({ size, className = "" }) => (
  <span
    className={`px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs border border-gray-200 ${className}`}
  >
    {size}
  </span>
);

export default SizeBadge;
