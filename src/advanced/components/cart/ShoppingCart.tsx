import type { CartItem, Product } from '../../types';
import ProductPicker from './ProductPicker';

interface ShoppingCartProps {
  selectedProductId?: string;
  onProductSelect?: (productId: string) => void;
  onAddToCart?: () => void;
  cartItems?: CartItem[];
  products?: Product[];
  onQuantityChange?: (productId: string, change: number) => void;
  onRemoveItem?: (productId: string) => void;
}

const ShoppingCart = ({
  selectedProductId,
  onProductSelect,
  onAddToCart,
  cartItems = [],
  products = [],
  onQuantityChange,
  onRemoveItem,
}: ShoppingCartProps) => {
  return (
    <div className="bg-white border border-gray-200 p-8 overflow-y-auto">
      <ProductPicker
        selectedProductId={selectedProductId}
        onProductSelect={onProductSelect}
        onAddToCart={onAddToCart}
      />
      <div id="cart-items">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">카트가 비어있습니다</h3>
            <p className="text-sm text-gray-500 mb-4">위에서 상품을 선택하고 "Add to Cart" 버튼을 클릭해보세요</p>
            <div className="text-xs text-gray-400">현재 {products.length}개의 상품이 준비되어 있습니다</div>
          </div>
        ) : (
          cartItems.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;

            return (
              <div
                key={item.productId}
                className="grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                </div>
                <div>
                  <h3 className="text-base font-normal mb-1 tracking-tight">{product.name}</h3>
                  <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
                  <p className="text-xs text-black mb-3">₩{product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onQuantityChange?.(item.productId, -1)}
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => onQuantityChange?.(item.productId, 1)}
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg mb-2 tracking-tight tabular-nums">
                    <span className="line-through text-gray-400">₩{(item.price * item.quantity).toLocaleString()}</span>{' '}
                    <span className="text-purple-600">₩{(item.discountPrice * item.quantity).toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => onRemoveItem?.(item.productId)}
                    className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
