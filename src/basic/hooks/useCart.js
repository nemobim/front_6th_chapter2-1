import { getCartItems } from '../components/CartDisplay.js';
import { CartPriceUpdater } from '../services/CartPriceUpdater.js';
import { 
  getProductList, 
  updateCartItems, 
  updateCartItemCount, 
  updateCartTotal, 
  updateCartDiscount 
} from '../state/appState.js';

/**
 * 카트 계산 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useCartCalculation(cartDisp, discountCalculator, uiUpdater) {
  function handleCalculateCartStuff() {
    // 필요한 서비스가 초기화되었는지 확인
    if (!discountCalculator || !uiUpdater) {
      return;
    }

    // 표시 컴포넌트에서 현재 카트 상태 가져오기
    const cartItems = getCartItems(cartDisp);

    // 할인, 총액, 아이템 수 계산
    const calculationResult = discountCalculator.calculateTotalDiscount(cartItems, getProductList());

    // 카트 아이템, 아이템 수, 총액 모두 상태로 업데이트
    updateCartItems(cartItems);
    updateCartItemCount(calculationResult.itemCount);
    updateCartTotal(calculationResult.totalAmount);
    updateCartDiscount(calculationResult.discountAmount);

    // 모든 컴포넌트에서 UI 업데이트 트리거
    uiUpdater.updateAllUI(calculationResult);
  }

  return { handleCalculateCartStuff };
}

/**
 * 카트 가격 업데이트 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useCartPriceUpdate(cartDisp, discountCalculator, uiUpdater) {
  function doUpdatePricesInCart() {
    const cartItems = getCartItems(cartDisp);

    // 모든 카트 아이템의 가격을 현재 세일 반영하여 업데이트
    CartPriceUpdater.updateCartItemPrices(cartItems);

    // 업데이트된 가격으로 총액 재계산
    handleCalculateCartStuff();
  }

  function handleCalculateCartStuff() {
    // 필요한 서비스가 초기화되었는지 확인
    if (!discountCalculator || !uiUpdater) {
      return;
    }

    // 표시 컴포넌트에서 현재 카트 상태 가져오기
    const cartItems = getCartItems(cartDisp);

    // 할인, 총액, 아이템 수 계산
    const calculationResult = discountCalculator.calculateTotalDiscount(cartItems, getProductList());

    // 카트 아이템, 아이템 수, 총액 모두 상태로 업데이트
    updateCartItems(cartItems);
    updateCartItemCount(calculationResult.itemCount);
    updateCartTotal(calculationResult.totalAmount);
    updateCartDiscount(calculationResult.discountAmount);

    // 모든 컴포넌트에서 UI 업데이트 트리거
    uiUpdater.updateAllUI(calculationResult);
  }

  return { doUpdatePricesInCart };
} 