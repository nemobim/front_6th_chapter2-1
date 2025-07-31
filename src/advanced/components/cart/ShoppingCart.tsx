import { useState } from 'react';

import { PRODUCT_STATE_CONFIG } from '../../constants';
import type { CartItem, Product } from '../../types';
import { calculateItemDiscountRate } from '../../utils/discountUtils';
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
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set());

  // 제품 상태 확인
  const getProductState = (product: Product) => {
    if (product.isOnSale && product.isRecommended) return PRODUCT_STATE_CONFIG.SALE_AND_RECOMMEND;
    if (product.isOnSale) return PRODUCT_STATE_CONFIG.SALE_ONLY;
    if (product.isRecommended) return PRODUCT_STATE_CONFIG.RECOMMEND_ONLY;
    return PRODUCT_STATE_CONFIG.DEFAULT;
  };

  // 상품 상태 배지 생성
  const createSaleBadge = (product: Product): string => {
    const state = getProductState(product);
    return state.badge;
  };

  // 가격 표시 포맷팅
  const formatPriceDisplay = (product: Product): JSX.Element => {
    const state = getProductState(product);

    // 할인이나 추천이 없는 경우 일반 가격 표시
    if (state === PRODUCT_STATE_CONFIG.DEFAULT) {
      return <span>₩{product.price.toLocaleString()}</span>;
    }

    // 할인/추천 상품의 경우 원가와 할인가 표시
    return (
      <>
        <span className="line-through text-gray-400">₩{product.originalPrice.toLocaleString()}</span>{' '}
        <span className={state.color}>₩{product.price.toLocaleString()}</span>
      </>
    );
  };

  const handleQuantityChange = async (productId: string, change: number) => {
    setUpdatingItems((prev) => new Set(prev).add(productId));

    // 약간의 지연으로 애니메이션 효과 제공
    await new Promise((resolve) => setTimeout(resolve, 100));

    onQuantityChange?.(productId, change);
    setUpdatingItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(productId);
      return newSet;
    });
  };

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
            const product = products.find((p: Product) => p.id === item.productId);
            if (!product) return null;

            const isUpdating = updatingItems.has(item.productId);
            const itemDiscountRate = calculateItemDiscountRate(item.productId, item.quantity);
            const hasDiscount = itemDiscountRate > 0;
            const saleBadge = createSaleBadge(product);

            return (
              <div
                key={item.productId}
                className={`grid grid-cols-[80px_1fr_auto] gap-5 py-5 border-b border-gray-100 first:pt-0 last:border-b-0 last:pb-0 transition-all duration-200 ${
                  isUpdating ? 'opacity-75 scale-[0.98]' : ''
                }`}
              >
                <div className="w-20 h-20 bg-gradient-black relative overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 w-[60%] h-[60%] bg-white/10 -translate-x-1/2 -translate-y-1/2 rotate-45" />
                </div>
                <div>
                  <h3 className="text-base font-normal mb-1 tracking-tight">
                    {saleBadge}
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-0.5 tracking-wide">PRODUCT</p>
                  <p className="text-xs text-black mb-3">{formatPriceDisplay(product)}</p>
                  {hasDiscount && (
                    <div className="text-xs text-green-600 mb-2">
                      ✨ {Math.round(itemDiscountRate * 100)}% 할인 적용
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      disabled={isUpdating}
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      −
                    </button>
                    <span
                      className={`text-sm font-normal min-w-[20px] text-center tabular-nums transition-all duration-200 ${
                        isUpdating ? 'text-purple-600 font-semibold' : ''
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      disabled={isUpdating}
                      className="quantity-change w-6 h-6 border border-black bg-white text-sm flex items-center justify-center transition-all hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg mb-2 tracking-tight tabular-nums transition-all duration-200 ${
                      isUpdating ? 'text-purple-600' : ''
                    }`}
                  >
                    {formatPriceDisplay(product)}
                  </div>
                  <button
                    onClick={() => onRemoveItem?.(item.productId)}
                    disabled={isUpdating}
                    className="remove-item text-2xs text-gray-500 uppercase tracking-wider cursor-pointer transition-colors border-b border-transparent hover:text-black hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
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
