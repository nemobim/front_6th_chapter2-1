import { CartItem, Product, PRODUCT_IDS } from '../../lib/products';

export interface DiscountResult {
  originalTotal: number;
  discountedTotal: number;
  discountRate: number;
  savedAmount: number;
  discountDetails: Array<{
    name: string;
    discountRate: number;
  }>;
}

export function calculateDiscount(cartItems: CartItem[], products: Product[]): DiscountResult {
  // 번개세일과 추천할인이 적용된 실제 가격으로 계산
  const originalTotal = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.productId === item.productId);
    return total + (product ? product.originalPrice * item.quantity : 0);
  }, 0);

  const discountedPriceTotal = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.productId === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const discountDetails: Array<{ name: string; discountRate: number }> = [];
  let finalTotal = discountedPriceTotal;

  // 번개세일/추천할인이 이미 적용된 상태에서 추가 할인 계산
  const lightningDiscountTotal = cartItems.reduce((total, item) => {
    const product = products.find((p) => p.productId === item.productId);
    if (product && (product.isOnSale || product.isRecommended)) {
      const discountAmount = (product.originalPrice - product.price) * item.quantity;
      return total + discountAmount;
    }
    return total;
  }, 0);

  // 개별 상품 할인 (10개 이상) - 할인된 가격 기준으로 추가 할인
  let hasItemDiscount = false;
  cartItems.forEach((item) => {
    if (item.quantity >= 10) {
      const product = products.find((p) => p.productId === item.productId);
      if (product) {
        let discountRate = 0;
        switch (product.productId) {
          case PRODUCT_IDS.KEYBOARD:
            discountRate = 0.1;
            break;
          case PRODUCT_IDS.MOUSE:
            discountRate = 0.15;
            break;
          case PRODUCT_IDS.MONITOR_ARM:
            discountRate = 0.2;
            break;
          case PRODUCT_IDS.POUCH:
            discountRate = 0.05;
            break;
          case PRODUCT_IDS.SPEAKER:
            discountRate = 0.25;
            break;
        }
        if (discountRate > 0) {
          const itemTotal = product.price * item.quantity; // 이미 할인된 가격 기준
          finalTotal -= itemTotal * discountRate;
          discountDetails.push({
            name: `${product.name} (10개↑)`,
            discountRate: discountRate * 100,
          });
          hasItemDiscount = true;
        }
      }
    }
  });

  // 대량 구매 할인 (30개 이상) - 개별 할인과 중복 적용 안됨
  if (totalQuantity >= 30 && !hasItemDiscount) {
    finalTotal = discountedPriceTotal * 0.75;
    discountDetails.push({
      name: '🎉 대량구매 할인 (30개 이상)',
      discountRate: 25,
    });
  }

  // 화요일 할인 (추가 10%)
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  if (isTuesday && finalTotal > 0) {
    finalTotal = finalTotal * 0.9;
    discountDetails.push({
      name: '🌟 화요일 추가 할인',
      discountRate: 10,
    });
  }

  const savedAmount = originalTotal - finalTotal;
  const discountRate = originalTotal > 0 ? savedAmount / originalTotal : 0;

  return {
    originalTotal,
    discountedTotal: finalTotal,
    discountRate,
    savedAmount,
    discountDetails,
  };
}
