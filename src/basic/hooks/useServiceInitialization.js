import { updateProductOptions } from '../components/ProductSelector';
import { CartEventHandler } from '../services/CartEventHandler';
import { DiscountCalculator } from '../services/DiscountCalculator';
import { TimerService } from '../services/TimerService';
import { UIUpdater } from '../services/UIUpdater';
import { getProductList } from '../state/appState.js';
import { useCartCalculation, useCartPriceUpdate } from './useCart.js';

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
  function initializeDOMDependentServices(productSelector, cartDisplay, discountCalculator) {
    const uiUpdater = new UIUpdater(cartDisplay, getProductList());

    const { handleCalculateCart } = useCartCalculation(cartDisplay, discountCalculator, uiUpdater);
    const { handleUpdateCartPrices } = useCartPriceUpdate(cartDisplay, discountCalculator, uiUpdater);

    const timerService = new TimerService(
      getProductList(),
      () => updateProductOptions(productSelector, getProductList()),
      handleUpdateCartPrices
    );

    const cartEventHandler = new CartEventHandler(
      getProductList(),
      cartDisplay,
      productSelector,
      timerService,
      handleCalculateCart
    );

    return { timerService, cartEventHandler, uiUpdater };
  }

  return { initializeCoreServices, initializeDOMDependentServices };
}
