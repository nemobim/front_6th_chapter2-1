import { updateProductOptions } from '../components/product/ProductSelector';
import { createCartEventHandler } from '../services/CartEventHandler';
import { calculateTotalDiscount } from '../services/DiscountCalculator';
import { createTimerService } from '../services/TimerService';
import { UIUpdater } from '../services/UIUpdater';
import { getProductList } from '../state/appState.js';
import { useCartUpdater } from './useCart.js';

/** 서비스 초기화 */
export function useServiceInitialization() {
  // DOM 독립적 핵심 서비스 초기화
  function initializeCoreServices() {
    return { calculateTotalDiscount };
  }

  // UI 업데이터 초기화
  function createUIUpdater(cartDisplay) {
    return new UIUpdater(cartDisplay, getProductList());
  }

  // 타이머 서비스 초기화
  function createTimerServiceInstance(productSelector, updatePricesAndCalculate) {
    const productList = getProductList();
    const updateProductOptionsFn = () => updateProductOptions(productSelector, productList);

    return createTimerService(productList, updateProductOptionsFn, updatePricesAndCalculate);
  }

  // 카트 이벤트 핸들러 초기화
  function createCartEventHandlerInstance(cartDisplay, productSelector, timerService, calculateCart) {
    return createCartEventHandler({
      productList: getProductList(),
      cartDisplay,
      productSelector,
      timerService,
      onCartUpdate: calculateCart,
    });
  }

  // DOM 의존 서비스 초기화
  function initializeServices(productSelector, cartDisplay, discountCalculator) {
    const uiUpdater = createUIUpdater(cartDisplay);
    const { calculateCart, updatePricesAndCalculate } = useCartUpdater(cartDisplay, discountCalculator, uiUpdater);
    const timerService = createTimerServiceInstance(productSelector, updatePricesAndCalculate);
    const cartEventHandler = createCartEventHandlerInstance(cartDisplay, productSelector, timerService, calculateCart);

    return { timerService, cartEventHandler, uiUpdater };
  }

  return { initializeCoreServices, initializeServices };
}
