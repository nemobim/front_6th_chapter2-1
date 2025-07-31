import { useCartContext } from '../../hooks/CartContext';
import ProductPicker from './ProductPicker';

const ShoppingCart = () => {
  const { cartItems, updateQuantity, removeFromCart, products } = useCartContext();

  const handleQuantityChange = (productId: string, change: number) => {
    const currentItem = cartItems.find((item) => item.productId === productId);
    if (currentItem) {
      updateQuantity(productId, currentItem.quantity + change);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker />
      <div id="cart-items">
        {cartItems.map((cartItem) => {
          const product = products.find((p) => p.productId === cartItem.productId);
          if (!product) return null;

          return (
            <div
              key={cartItem.productId}
              className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
              </div>
              <div>
                <h3
                  className={`text-base mb-1 tracking-tight ${cartItem.quantity >= 10 ? 'font-bold' : 'font-normal'}`}
                >
                  {product.isOnSale && product.isRecommended && '⚡💝'}
                  {product.isOnSale && !product.isRecommended && '⚡'}
                  {!product.isOnSale && product.isRecommended && '💝'}
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
                <p className="text-xs mb-3">
                  {product.isOnSale || product.isRecommended ? (
                    <>
                      <span className="line-through text-gray-400">₩{product.originalPrice.toLocaleString()}</span>{' '}
                      <span
                        className={
                          product.isOnSale && product.isRecommended
                            ? 'text-purple-600'
                            : product.isOnSale
                              ? 'text-red-500'
                              : 'text-blue-500'
                        }
                      >
                        ₩{product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-black">₩{product.price.toLocaleString()}</span>
                  )}
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(cartItem.productId, -1)}
                    className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                  >
                    -
                  </button>
                  <span className="text-sm font-normal min-w-[20px] text-center tabular-nums">{cartItem.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(cartItem.productId, 1)}
                    className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`text-lg mb-2 tracking-tight tabular-nums ${cartItem.quantity >= 10 ? 'font-bold' : 'font-normal'}`}
                >
                  {product.isOnSale || product.isRecommended ? (
                    <>
                      <span className="line-through text-gray-400">
                        ₩{(product.originalPrice * cartItem.quantity).toLocaleString()}
                      </span>{' '}
                      <span
                        className={
                          product.isOnSale && product.isRecommended
                            ? 'text-purple-600'
                            : product.isOnSale
                              ? 'text-red-500'
                              : 'text-blue-500'
                        }
                      >
                        ₩{(product.price * cartItem.quantity).toLocaleString()}
                      </span>
                    </>
                  ) : (
                    `₩${(product.price * cartItem.quantity).toLocaleString()}`
                  )}
                </div>
                <a
                  onClick={() => handleRemove(cartItem.productId)}
                  className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
                >
                  Remove
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShoppingCart;
