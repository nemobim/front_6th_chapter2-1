import { getCartItems } from '../components/CartDisplay.js';
import { updateCartItems, updateCartItemCount, updateCartTotal, updateCartDiscount } from '../state/appState.js';

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