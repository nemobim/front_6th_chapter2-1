import { PRODUCT_LIST } from '../data/products';
import { setProductList, subscribeApp, updateCartItemCount } from '../state/appState.js';

/**
 * 앱 초기화 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useAppInitialization() {
  /**
   * 애플리케이션 초기 상태를 설정
   */
  function initializeAppState() {
    updateCartItemCount(0);
    setProductList(PRODUCT_LIST);
  }

  /**
   * 앱 상태 변경 시 UI 업데이트 구독 설정
   */
  function setupStateSubscription() {
    subscribeApp((newAppState) => {
      const header = document.querySelector('header');
      if (header) {
        const itemCountElement = header.querySelector('.cart-item-count');
        if (itemCountElement) {
          itemCountElement.textContent = newAppState.cart.totalItemCount;
        }
      }
    });
  }

  return { initializeAppState, setupStateSubscription };
}
