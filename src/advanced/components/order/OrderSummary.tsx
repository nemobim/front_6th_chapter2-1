import type { CartItem, Product } from '../../types';
import { isTuesday } from '../../utils/dateUtils';
import { calculateBulkDiscountRate } from '../../utils/discountUtils';
import { calculateTotalPoints } from '../../utils/pointUtils';

interface OrderSummaryProps {
  cartItems?: CartItem[];
  products?: Product[];
}

const OrderSummary = ({ cartItems = [], products = [] }: OrderSummaryProps) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscountPrice = cartItems.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isTuesdayDiscount = isTuesday();
  const tuesdayDiscountRate = 0.1; // 10% 할인

  // 대량구매 할인 적용
  const bulkDiscountRate = calculateBulkDiscountRate(itemCount);
  const bulkDiscountAmount = bulkDiscountRate > 0 ? totalDiscountPrice * bulkDiscountRate : 0;
  const priceAfterBulkDiscount = totalDiscountPrice - bulkDiscountAmount;

  // 화요일 할인 적용
  const finalPrice = isTuesdayDiscount ? priceAfterBulkDiscount * (1 - tuesdayDiscountRate) : priceAfterBulkDiscount;

  // 포인트 계산
  const { totalPoints, pointsDetails } = calculateTotalPoints(cartItems, products, finalPrice, itemCount);

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/40 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-white mb-2">주문 요약</h3>
            <p className="text-sm text-white/60 mb-4">카트에 상품을 추가하면 여기에 표시됩니다</p>
            <div className="text-xs text-white/40">총 {products.length}개의 상품 중에서 선택해보세요</div>
          </div>
        ) : (
          <>
            <div id="summary-details" className="space-y-3">
              {cartItems.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                if (!product) return null;

                return (
                  <div key={item.productId} className="flex justify-between text-xs tracking-wide text-gray-400">
                    <span>
                      {product.name} x {item.quantity}
                    </span>
                    <span>₩{(item.discountPrice * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}

              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{totalPrice.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>

              {bulkDiscountRate > 0 && (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span>대량구매 할인 ({Math.round(bulkDiscountRate * 100)}%)</span>
                  <span>-₩{bulkDiscountAmount.toLocaleString()}</span>
                </div>
              )}

              {isTuesdayDiscount && (
                <div className="flex justify-between text-sm tracking-wide text-green-400">
                  <span>화요일 특별 할인 (10%)</span>
                  <span>-₩{(priceAfterBulkDiscount * tuesdayDiscountRate).toLocaleString()}</span>
                </div>
              )}
            </div>
            <div className="mt-auto">
              <div id="discount-info" className="mb-4"></div>
              <div id="cart-total" className="pt-5 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm uppercase tracking-wider">Total</span>
                  <div className="text-2xl tracking-tight">₩{finalPrice.toLocaleString()}</div>
                </div>
                <div id="loyalty-points" className="text-xs text-blue-400 mt-2 text-right block">
                  <div>
                    적립 포인트: <span className="font-bold">{totalPoints}p</span>
                  </div>
                  <div className="text-2xs opacity-70 mt-1">{pointsDetails.join(', ')}</div>
                </div>
              </div>
              {isTuesdayDiscount && (
                <div id="tuesday-special" className="mt-4 p-3 bg-white/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-2xs">🎉</span>
                    <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <button
        disabled={cartItems.length === 0}
        className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
      >
        {cartItems.length === 0 ? '카트에 상품을 추가해주세요' : 'Proceed to Checkout'}
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span id="points-notice">Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;
