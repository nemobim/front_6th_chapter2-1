import { useCartContext } from '../../hooks/CartContext';
import { calculateDiscount } from '../utils/discountCalculator';
import { calculatePoints } from '../utils/pointsCalculator';

const OrderSummary = () => {
  const { cartItems, products } = useCartContext();

  const discountResult = calculateDiscount(cartItems, products);
  const pointsResult = calculatePoints(cartItems, products, discountResult.discountedTotal);
  const today = new Date();
  const isTuesday = today.getDay() === 2;

  return (
    <div className="bg-black text-white p-8 flex flex-col">
      <h2 className="text-xs font-medium mb-5 tracking-extra-wide uppercase">Order Summary</h2>
      <div className="flex-1 flex flex-col">
        <div className="space-y-3">
          {cartItems.map((cartItem) => {
            const product = products.find((p) => p.productId === cartItem.productId);
            if (!product) return null;

            return (
              <div key={cartItem.productId} className="flex justify-between text-xs tracking-wide text-gray-400">
                <span>
                  {product.name} x {cartItem.quantity}
                </span>
                <span>₩{(product.price * cartItem.quantity).toLocaleString()}</span>
              </div>
            );
          })}

          {cartItems.length > 0 && (
            <>
              <div className="border-t border-white/10 my-3"></div>
              <div className="flex justify-between text-sm tracking-wide">
                <span>Subtotal</span>
                <span>₩{discountResult.originalTotal.toLocaleString()}</span>
              </div>

              {discountResult.discountDetails.map((discount, index) => (
                <div key={index} className="flex justify-between text-sm tracking-wide text-green-400">
                  <span className="text-xs">{discount.name}</span>
                  <span className="text-xs">-{discount.discountRate}%</span>
                </div>
              ))}

              <div className="flex justify-between text-sm tracking-wide text-gray-400">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </>
          )}
        </div>

        <div className="mt-auto">
          {discountResult.discountRate > 0 && discountResult.discountedTotal > 0 && (
            <div className="mb-4">
              <div className="bg-green-500/20 rounded-lg p-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
                  <span className="text-sm font-medium text-green-400">
                    {(discountResult.discountRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="text-2xs text-gray-300">
                  ₩{Math.round(discountResult.savedAmount).toLocaleString()} 할인되었습니다
                </div>
              </div>
            </div>
          )}

          <div className="pt-5 border-t border-white/10">
            <div className="flex justify-between items-baseline">
              <span className="text-sm uppercase tracking-wider">Total</span>
              <div className="text-2xl tracking-tight">
                ₩{Math.round(discountResult.discountedTotal).toLocaleString()}
              </div>
            </div>

            {cartItems.length > 0 && pointsResult.totalPoints > 0 && (
              <div className="text-xs text-blue-400 mt-2 text-right">
                <div>
                  적립 포인트: <span className="font-bold">{pointsResult.totalPoints}p</span>
                </div>
                <div className="text-2xs opacity-70 mt-1">{pointsResult.pointsDetails.join(', ')}</div>
              </div>
            )}
          </div>

          {isTuesday && discountResult.discountedTotal > 0 && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xs">🎉</span>
                <span className="text-xs uppercase tracking-wide">Tuesday Special 10% Applied</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <button className="w-full py-4 bg-white text-black text-sm font-normal uppercase tracking-super-wide cursor-pointer mt-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30">
        Proceed to Checkout
      </button>
      <p className="mt-4 text-2xs text-white/60 text-center leading-relaxed">
        Free shipping on all orders.
        <br />
        <span>Earn loyalty points with purchase.</span>
      </p>
    </div>
  );
};

export default OrderSummary;
