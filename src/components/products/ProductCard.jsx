import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { VariantSection } from './index';

// Component untuk Card Produk
const ProductCard = ({
  product,
  onDelete,
  onToggleVariants,
  showVariants,
  onAddVariant,
  onDeleteVariant,
  // onUpdateProduct,
  onUpdateVariant,
  onEditProduct
}) => {

  // Kumpulkan ukuran & warna unik dari varian
  const variants = Array.isArray(product?.product_variants) ? product.product_variants : [];
  const uniq = (arr) => [...new Set(arr)];
  const sizes = uniq(
    variants
      .map(v => v?.sizes?.name)
      .filter(Boolean)
  );

  // Normalisasi hex (auto tambahkan # jika perlu, valid hanya 3/6 digit)
  const normalizeHex = (hex) => {
    if (!hex) return null;
    const h = String(hex).trim();
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(h)) return h;
    if (/^([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(h)) return `#${h}`;
    return null;
  };

  // Ambil info warna: { name, hex }
  const colorMap = new Map();
  for (const v of variants) {
    const name = v?.colors?.name ?? null;
    const rawHex = v?.colors?.hex_code ?? null;
    const hex = normalizeHex(rawHex);
    // Kunci unik: utamakan hex, fallback ke name
    const key = (hex || (name ? name.toLowerCase() : '')) || null;
    if (!key) continue;
    if (!colorMap.has(key)) {
      colorMap.set(key, { name, hex });
    }
  }
  const colorList = Array.from(colorMap.values());

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Product Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {product.partner && (
              <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-1 py-1 rounded-sm mt-2 mb-1 shadow-sm">
                Partner: {product.partner}
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
            <div className="flex gap-4 text-sm text-gray-600 mt-1">
              <span>{product.categories?.name}</span>
              {product.types && <span>• {product.types?.name}</span>}
            </div>

            {/* Daftar ukuran & warna secara compact */}
            {(sizes.length > 0 || colorList.length > 0) && (
              <div className="flex flex-col gap-2 mt-2 text-sm">
                {sizes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Ukuran:</span>
                    <div className="flex flex-wrap gap-1">
                      {sizes.slice(0, 8).map((s) => (
                        <span
                          key={String(s)}
                          className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs border border-gray-200"
                        >
                          {s}
                        </span>
                      ))}
                      {sizes.length > 8 && (
                        <span className="text-xs text-gray-500">+{sizes.length - 8}</span>
                      )}
                    </div>
                  </div>
                )}
                {colorList.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Warna:</span>
                    <div className="flex flex-wrap gap-1">
                      {colorList.slice(0, 8).map((c, idx) => (
                        <span
                          key={`${c.hex || c.name || idx}`}
                          // className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-xs border border-gray-200"
                          title={c.name || c.hex || 'Warna'}
                        >
                          <svg width="20" height="20" viewBox="0 0 12 12" aria-hidden="true">
                            <circle
                              cx="6"
                              cy="6"
                              r="5"
                              fill={c.hex || c.name || '#9CA3AF'}
                              stroke="#E5E7EB"
                              strokeWidth="1"
                            />
                          </svg>
                        </span>
                      ))}
                      {colorList.length > 8 && (
                        <span className="text-xs text-gray-500">+{colorList.length - 8}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {product.reference_price && (
              <p className="text-lg font-medium text-green-600 mt-2">
                Rp {product?.reference_price?.toLocaleString('id-ID')}
              </p>
            )}
            {product.description && (
              <p className="text-gray-700 mt-2">{product.description}</p>
            )}
          </div>
          
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onToggleVariants(product.id)}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-4 py-2 rounded-lg transition-colors"
            >
              {showVariants ? 'Sembunyikan' : 'Lihat'} Varian ({product.product_variants.length})
            </button>
            <button
              onClick={() => onEditProduct(product)}
              className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Variants Section */}
      <VariantSection
        product={product}
        show={showVariants}
        onAddVariant={onAddVariant}
        onDeleteVariant={onDeleteVariant}
        onUpdateVariant={onUpdateVariant}
      />

    </div>
  );
};

export default ProductCard;