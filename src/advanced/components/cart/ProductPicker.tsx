import { PRODUCTS } from '../../lib/products';

interface ProductPickerProps {
  selectedProductId?: string;
  onProductSelect?: (productId: string) => void;
  onAddToCart?: () => void;
}

const ProductPicker = ({ selectedProductId = '', onProductSelect, onAddToCart }: ProductPickerProps) => {
  const selectedProduct = PRODUCTS.find((p) => p.id === selectedProductId);
  const isOutOfStock = selectedProduct?.stock === 0;

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select
        value={selectedProductId}
        onChange={(e) => onProductSelect?.(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3"
      >
        <option value="">Select a product</option>
        {PRODUCTS.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name} - ₩{product.price.toLocaleString()}
          </option>
        ))}
      </select>
      <button
        onClick={onAddToCart}
        disabled={!selectedProductId || isOutOfStock}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Add to Cart
      </button>
      {isOutOfStock && selectedProduct && <div className="text-xs text-red-500 mt-3">{selectedProduct.name}: 품절</div>}
    </div>
  );
};

export default ProductPicker;
