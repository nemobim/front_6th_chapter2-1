import { updateProductOptions } from '../components/product/ProductSelector.js';
import { getProductList } from '../state/appState.js';
import { useCartUpdater } from './useCart.js';

/**
 * 렌더링 및 이벤트 핸들러 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useRendering() {
  /**
   * 초기 UI 상태를 설정
   */
  function initializeRendering(productSelector, cartDisplay, discountCalculator, uiUpdater) {
    updateProductOptions(productSelector, getProductList());

    // useCart의 공통 로직 사용
    const { calculateCart } = useCartUpdater(cartDisplay, discountCalculator, uiUpdater);
    calculateCart();
  }

  /**
   * 이벤트 핸들러를 등록
   */
  function attachEventHandlers(cartEventHandler, addToCartButton) {
    cartEventHandler.attachEventListeners(addToCartButton);
  }

  return { initializeRendering, attachEventHandlers };
}
