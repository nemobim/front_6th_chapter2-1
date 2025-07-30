import { updateProductOptions } from '../components/ProductSelector.js';
import { getProductList } from '../state/appState.js';
import { useCartCalculation } from './useCart.js';

/**
 * 렌더링 및 이벤트 핸들러 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useRendering() {
  /**
   * 초기 UI 상태를 설정
   */
  function performInitialRendering(productSelector, cartDisplay, discountCalculator, uiUpdater) {
    updateProductOptions(productSelector, getProductList());

    // useCart의 공통 로직 사용
    const { handleCalculateCart } = useCartCalculation(cartDisplay, discountCalculator, uiUpdater);
    handleCalculateCart();
  }

  /**
   * 이벤트 핸들러를 등록
   */
  function setupEventHandlers(cartEventHandler, addToCartButton) {
    cartEventHandler.attachEventListeners(addToCartButton);
  }

  return { performInitialRendering, setupEventHandlers };
}
