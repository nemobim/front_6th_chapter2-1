import { updateProductOptions } from '../components/product/ProductSelector';
import { CartEventHandler } from '../services/CartEventHandler';
import { DiscountCalculator } from '../services/DiscountCalculator';
import { TimerService } from '../services/TimerService';
import { UIUpdater } from '../services/UIUpdater';
import { getProductList } from '../state/appState.js';
import { useCartUpdater } from './useCart.js';

/** 서비스 초기화 */
export function useServiceInitialization() {
  // DOM 독립적 핵심 서비스 초기화
  function initializeCoreServices() {
    const discountCalculator = new DiscountCalculator();
    return { discountCalculator };
  }

  // UI 업데이터 초기화
  function createUIUpdater(cartDisplay) {
    return new UIUpdater(cartDisplay, getProductList());
  }

  // 타이머 서비스 초기화
  function createTimerService(productSelector, updatePricesAndCalculate) {
    return new TimerService(
      getProductList(),
      () => updateProductOptions(productSelector, getProductList()),
      updatePricesAndCalculate
    );
  }

  // 카트 이벤트 핸들러 초기화
  function createCartEventHandler(cartDisplay, productSelector, timerService, calculateCart) {
    return new CartEventHandler(getProductList(), cartDisplay, productSelector, timerService, calculateCart);
  }

  // DOM 의존 서비스 초기화
  function initializeServices(productSelector, cartDisplay, discountCalculator) {
    const uiUpdater = createUIUpdater(cartDisplay);
    const { calculateCart, updatePricesAndCalculate } = useCartUpdater(cartDisplay, discountCalculator, uiUpdater);
    const timerService = createTimerService(productSelector, updatePricesAndCalculate);
    const cartEventHandler = createCartEventHandler(cartDisplay, productSelector, timerService, calculateCart);

    return { timerService, cartEventHandler, uiUpdater };
  }

  return { initializeCoreServices, initializeServices };
}
