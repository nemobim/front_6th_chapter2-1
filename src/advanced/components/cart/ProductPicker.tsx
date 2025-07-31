import { useCartContext } from '../../hooks/CartContext';

const ProductPicker = () => {
  const { products, addToCart } = useCartContext();

  const handleAddToCart = () => {
    const select = document.getElementById('product-select') as HTMLSelectElement;
    const selectedProductId = select.value;

    if (selectedProductId) {
      addToCart(selectedProductId);
    }
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
        {products.map((product) => (
          <option key={product.productId} value={product.productId}>
            {product.name} - {product.price}원
          </option>
        ))}
      </select>
      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>
      <div id="stock-status" className="text-xs text-red-500 mt-3 whitespace-pre-line">
        에러 방지 노트북 파우치: 품절
      </div>
    </div>
  );
};

export default ProductPicker;
