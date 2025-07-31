import { updateProductOptions } from '../components/product/ProductSelector';
import { CartEventHandler } from '../services/CartEventHandler';
import { DiscountCalculator } from '../services/DiscountCalculator';
import { TimerService } from '../services/TimerService';
import { UIUpdater } from '../services/UIUpdater';
import { getProductList } from '../state/appState.js';
import { useCartUpdater } from './useCart.js';

/**
 * 서비스 초기화 로직을 관리하는 커스텀 훅 스타일 함수
 */
export function useServiceInitialization() {
  /**
   * 핵심 서비스들을 초기화
   * DOM 생성 전에 호출되어야 함
   */
  function initializeCoreServices() {
    const discountCalculator = new DiscountCalculator();
    return { discountCalculator };
  }

  /**
   * DOM 의존 서비스들을 초기화
   * DOM 컴포넌트 생성 후에 호출되어야 함
   */
  function initializeServices(productSelector, cartDisplay, discountCalculator) {
    const uiUpdater = new UIUpdater(cartDisplay, getProductList());

    const { calculateCart, updatePricesAndCalculate } = useCartUpdater(cartDisplay, discountCalculator, uiUpdater);

    const timerService = new TimerService(
      getProductList(),
      () => updateProductOptions(productSelector, getProductList()),
      updatePricesAndCalculate
    );

    const cartEventHandler = new CartEventHandler(
      getProductList(),
      cartDisplay,
      productSelector,
      timerService,
      calculateCart
    );

    return { timerService, cartEventHandler, uiUpdater };
  }

  return { initializeCoreServices, initializeServices };
}
