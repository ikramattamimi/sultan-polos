import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { VariantSection } from './index';
import { ColorCircle, SizeBadge } from '../common';

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

  // Responsive limits for display
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const sizeLimit = isMobile ? 3 : 6;
  const colorLimit = isMobile ? 3 : 6;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Product Header */}
      <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Header row with partner badge and actions */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              {product.partner && (
                <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-sm mb-2 shadow-sm">
                  Partner: {product.partner}
                </div>
              )}
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 break-words leading-tight">
                {product.name}
              </h3>
              <div className="flex flex-col sm:flex-row sm:gap-2 text-xs sm:text-sm text-gray-600 mt-1">
                <span>{product.categories?.name}</span>
                {product.types && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span>{product.types?.name}</span>
                  </>
                )}
              </div>
            </div>
            
            {/* Action buttons - responsive layout */}
            <div className="flex flex-row gap-2 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => onToggleVariants(product.id)}
                className="flex-1 sm:flex-none bg-green-100 hover:bg-green-200 text-green-700 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm whitespace-nowrap"
              >
                <span className="hidden sm:inline">{showVariants ? 'Sembunyikan' : 'Lihat'} Varian</span>
                <span className="sm:hidden">{showVariants ? 'Hide' : 'Show'}</span>
                <span className="ml-1">({product.product_variants.length})</span>
              </button>
              <button
                onClick={() => onEditProduct(product)}
                className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1.5 sm:p-2 rounded-lg transition-colors"
                title="Edit Produk"
              >
                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 sm:p-2 rounded-lg transition-colors"
                title="Hapus Produk"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>

          {/* Sizes and Colors - responsive display */}
          {(sizes.length > 0 || colorList.length > 0) && (
            <div className="flex flex-col gap-2 text-xs sm:text-sm">
              {sizes.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 shrink-0 font-medium">Ukuran:</span>
                  <div className="flex flex-wrap gap-1">
                    {sizes.slice(0, sizeLimit).map((s) => (
                      <SizeBadge key={s} size={s} className="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5" />
                    ))}
                    {sizes.length > sizeLimit && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                        +{sizes.length - sizeLimit}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {colorList.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-gray-500 shrink-0 font-medium">Warna:</span>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {colorList.slice(0, colorLimit).map((c, idx) => (
                      <ColorCircle 
                        key={`${c.hex || c.name || idx}`} 
                        color={c.hex || c.name || '#9CA3AF'} 
                        title={c.name || c.hex || 'Warna'}
                        className="w-4 h-4 sm:w-5 sm:h-5"
                      />
                    ))}
                    {colorList.length > colorLimit && (
                      <span className="text-xs text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                        +{colorList.length - colorLimit}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Price and Description */}
          <div className="space-y-2">
            {product.reference_price && (
              <p className="text-sm sm:text-base lg:text-lg font-medium text-green-600">
                Rp {product?.reference_price?.toLocaleString('id-ID')}
              </p>
            )}
            {product.description && (
              <p className="text-gray-700 text-xs sm:text-sm lg:text-base line-clamp-2 sm:line-clamp-3">
                {product.description}
              </p>
            )}
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