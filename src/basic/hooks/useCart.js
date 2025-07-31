import { getCartItems } from '../components/cart/CartDisplay.js';
import { CartPriceUpdater } from '../services/CartPriceUpdater.js';
import {
  getProductList,
  updateCartDiscount,
  updateCartItemCount,
  updateCartItems,
  updateCartTotal,
} from '../state/appState.js';

/** 카트 업데이트
 * @param {Element} cartDisplay - 카트 디스플레이
 * @param {DiscountCalculator} discountCalculator - 할인 계산기
 * @param {UIUpdater} uiUpdater - UI 업데이트
 */
export function useCartUpdater(cartDisplay, discountCalculator, uiUpdater) {
  /** 공통 카트 업데이트 로직 */
  const updateCartState = (shouldUpdatePrices = false) => {
    if (!discountCalculator || !uiUpdater) return;

    const cartItems = getCartItems(cartDisplay);

    // 필요시 가격 업데이트
    if (shouldUpdatePrices) {
      const priceUpdater = new CartPriceUpdater(getProductList());
      priceUpdater.updateCartItemPrices(cartItems);
    }

    // 할인 및 총액 계산
    const calculationResult = discountCalculator.calculateTotalDiscount(cartItems, getProductList());

    // 상태 업데이트
    updateCartItems(cartItems);
    updateCartItemCount(calculationResult.itemCount);
    updateCartTotal(calculationResult.totalAmount);
    updateCartDiscount(calculationResult.discountAmount);

    // UI 업데이트
    uiUpdater.updateAllUI(calculationResult);

    return calculationResult;
  };

  return {
    calculateCart: () => updateCartState(false),
    updatePricesAndCalculate: () => updateCartState(true),
  };
}
