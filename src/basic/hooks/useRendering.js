import { getCartItems } from '../components/CartDisplay.js';
import { updateProductOptions } from '../components/ProductSelector.js';
import {
  getProductList,
  updateCartItems,
  updateCartItemCount,
  updateCartTotal,
  updateCartDiscount,
} from '../state/appState.js';

/**
 * 렌더링 및 이벤트 핸들러 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useRendering() {
  /**
   * 초기 UI 상태를 설정
   */
  function performInitialRendering(sel, cartDisp, discountCalculator, uiUpdater) {
    updateProductOptions(sel, getProductList());

    // 초기 렌더링 시에는 UI 업데이트 없이 상태만 계산
    const cartItems = getCartItems(cartDisp);
    const calculationResult = discountCalculator.calculateTotalDiscount(cartItems, getProductList());

    // 카트 상태만 업데이트 (UI 업데이트는 나중에)
    updateCartItems(cartItems);
    updateCartItemCount(calculationResult.itemCount);
    updateCartTotal(calculationResult.totalAmount);
    updateCartDiscount(calculationResult.discountAmount);

    // uiUpdater가 있으면 UI 업데이트 수행
    if (uiUpdater) {
      uiUpdater.updateAllUI(calculationResult);
    }
  }

  /**
   * 이벤트 핸들러를 등록
   */
  function setupEventHandlers(cartEventHandler, addBtn) {
    cartEventHandler.attachEventListeners(addBtn);
  }

  return { performInitialRendering, setupEventHandlers };
}
