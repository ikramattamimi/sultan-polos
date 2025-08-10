import { Package, Plus, Search } from "lucide-react";
import UtilityService from "../../../services/UtilityServices.js";
import { ColorCircle, SizeBadge } from "../../common";

// ProductSelector Component
const ProductSelector = ({
  products,
  searchQuery,
  setSearchQuery,
  onProductSelect,
  onAddProductClick,
  submitting,
}) => {
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.categories?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      product.types?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Package className="mr-2 text-green-600" />
        Pilih Produk
      </h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Cari produk..."
          disabled={submitting}
        />
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => onProductSelect(product)}
              disabled={submitting}
            />
          ))}
        </div>
        {filteredProducts.length === 0 && <EmptyProductList />}
      </div>

      {/* <button
        onClick={onAddProductClick}
        disabled={submitting}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="mr-2 h-4 w-4" />
        Tambah Produk ke Keranjang
      </button> */}
    </div>
  );
};

// EmptyProductList Component
const EmptyProductList = () => (
  <div className="text-center py-8 text-gray-500">
    <Package className="mx-auto h-12 w-12 mb-4 text-gray-300" />
    <p>Tidak ada produk ditemukan</p>
    <p className="text-sm">Coba sesuaikan kata kunci pencarian</p>
  </div>
);

// ProductCard Component
const ProductCard = ({ product, onClick, disabled }) => {
  // Kumpulkan ukuran & warna unik dari varian
  const variants = Array.isArray(product?.product_variants)
    ? product.product_variants
    : [];
  const uniq = (arr) => [...new Set(arr)];
  const sizes = uniq(variants.map((v) => v?.sizes?.name).filter(Boolean));

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
    const key = hex || (name ? name.toLowerCase() : "") || null;
    if (!key) continue;
    if (!colorMap.has(key)) {
      colorMap.set(key, { name, hex });
    }
  }
  const colorList = Array.from(colorMap.values());

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 hover:border-blue-300 cursor-pointer transition-colors bg-white shadow-sm`}
      onClick={() => !disabled && onClick()}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Mitra/Partner */}
          {product.partner && (
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-sm mb-1 shadow-sm">
              Mitra: {product.partner}
            </div>
          )}
          <h3 className="font-medium text-gray-900">{product.name}</h3>
          <div className="flex gap-4 text-sm text-gray-600 mt-1">
            <span>{product.categories?.name}</span>
            {product.types && <span>• {product.types?.name}</span>}
          </div>

          {/* Daftar ukuran & warna secara compact */}
          {(sizes.length > 0 || colorList.length > 0) && (
            <div className="flex flex-col gap-2 mt-3 text-sm">
              {sizes.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Ukuran:</span>
                  <div className="flex flex-wrap gap-1">
                    {sizes.slice(0, 8).map((s) => (
                      <SizeBadge key={String(s)} size={s} />
                    ))}
                    {sizes.length > 8 && (
                      <span className="text-xs text-gray-500">
                        +{sizes.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              )}
              {colorList.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Warna:</span>
                  <div className="flex flex-wrap gap-2">
                    {colorList.slice(0, 8).map((c, idx) => (
                      <ColorCircle
                        key={`${c.hex || c.name || idx}`}
                        color={c.hex}
                        title={c.name || c.hex || "Warna"}
                        size={20}
                      />
                    ))}
                    {colorList.length > 8 && (
                      <span className="text-xs text-gray-500">
                        +{colorList.length - 8}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Harga dan deskripsi */}
          {product.description && (
            <p className="text-gray-700 mt-2 text-xs">{product.description}</p>
          )}
          <p className="text-lg font-semibold text-green-600 mt-3">
            {UtilityService.formatCurrency(product.reference_price || 0)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductSelector;
