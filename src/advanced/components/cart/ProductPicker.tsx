import { useCartContext } from '../../hooks/CartContext';

const ProductPicker = () => {
  const { products, addToCart, cartItems } = useCartContext();

  const handleAddToCart = () => {
    const select = document.getElementById('product-select') as HTMLSelectElement;
    const selectedProductId = select.value;

    if (!selectedProductId) return;

    const product = products.find((p) => p.productId === selectedProductId);
    const cartItem = cartItems.find((item) => item.productId === selectedProductId);
    const currentQuantity = cartItem?.quantity || 0;

    if (product && product.stock > currentQuantity) {
      addToCart(selectedProductId);
    } else {
      alert('재고가 부족합니다.');
    }
  };

  const getStockMessage = () => {
    return products
      .filter((product) => product.stock < 5)
      .map((product) =>
        product.stock === 0 ? `${product.name}: 품절` : `${product.name}: 재고 부족 (${product.stock}개 남음)`
      )
      .join('\n');
  };

  return (
    <div className="mb-6 pb-6 border-b border-gray-200">
      <select id="product-select" className="w-full p-3 border border-gray-300 rounded-lg text-base mb-3">
        {products.map((product) => {
          const cartItem = cartItems.find((item) => item.productId === product.productId);
          const currentQuantity = cartItem?.quantity || 0;
          const isOutOfStock = product.stock <= currentQuantity;

          return (
            <option
              key={product.productId}
              value={product.productId}
              disabled={isOutOfStock}
              className={
                isOutOfStock
                  ? 'text-gray-400'
                  : product.isOnSale && product.isRecommended
                    ? 'text-purple-600 font-bold'
                    : product.isOnSale
                      ? 'text-red-500 font-bold'
                      : product.isRecommended
                        ? 'text-blue-500 font-bold'
                        : ''
              }
            >
              {product.isOnSale && product.isRecommended && '⚡💝'}
              {product.isOnSale && !product.isRecommended && '⚡'}
              {!product.isOnSale && product.isRecommended && '💝'}
              {product.name} -
              {product.isOnSale || product.isRecommended ? (
                <>
                  <span style={{ textDecoration: 'line-through' }}>{product.originalPrice.toLocaleString()}원</span>
                  {' → '}
                  {product.price.toLocaleString()}원{product.isOnSale && product.isRecommended && ' (25% SUPER SALE!)'}
                  {product.isOnSale && !product.isRecommended && ' (20% SALE!)'}
                  {!product.isOnSale && product.isRecommended && ' (5% 추천할인!)'}
                </>
              ) : (
                `${product.price.toLocaleString()}원`
              )}
              {isOutOfStock ? ' (품절)' : ''}
            </option>
          );
        })}
      </select>
      <button
        onClick={handleAddToCart}
        className="w-full py-3 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-800 transition-all"
      >
        Add to Cart
      </button>
      <div className="text-xs text-red-500 mt-3 whitespace-pre-line">{getStockMessage()}</div>
    </div>
  );
};

export default ProductPicker;
