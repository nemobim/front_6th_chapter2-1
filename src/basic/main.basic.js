import { createCartDisplay, getCartItems } from './components/CartDisplay';
import { createProductSelector, updateProductOptions } from './components/ProductSelector';
import { CartEventHandler } from './services/CartEventHandler';
import { CartPriceUpdater } from './services/CartPriceUpdater';
import { DiscountCalculator } from './services/DiscountCalculator';
import { TimerService } from './services/TimerService';
import { UIUpdater } from './services/UIUpdater';
import { 
  getProductList, 
  updateCartItems, 
  updateCartItemCount, 
  updateCartTotal, 
  updateCartDiscount
} from './state/appState.js';
import { useCartCalculation, useCartPriceUpdate } from './hooks/useCart.js';
import { useAppInitialization } from './hooks/useAppInitialization.js';
import { useComponentCreation } from './hooks/useComponentCreation.js';

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
function initializeDOMDependentServices(sel, cartDisp, discountCalculator) {
  const uiUpdater = new UIUpdater(cartDisp, getProductList());
  
  const { handleCalculateCartStuff } = useCartCalculation(cartDisp, discountCalculator, uiUpdater);
  const { doUpdatePricesInCart } = useCartPriceUpdate(cartDisp, discountCalculator, uiUpdater);

  const timerService = new TimerService(getProductList(), () => updateProductOptions(sel, getProductList()), doUpdatePricesInCart);

  const cartEventHandler = new CartEventHandler(getProductList(), cartDisp, sel, timerService, handleCalculateCartStuff);

  return { timerService, cartEventHandler, uiUpdater };
}

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

function main() {
  const { initializeAppState, setupStateSubscription } = useAppInitialization();
  const { createCoreComponents, createLayoutComponents, mountComponentsToDOM } = useComponentCreation();

  // 1. 애플리케이션 상태 초기화
  initializeAppState();

  // 2. 핵심 서비스 초기화 (DOM 생성 전)
  const { discountCalculator } = initializeCoreServices();

  // 3. 핵심 컴포넌트 생성
  const { sel, addBtn, stockInfo, cartDisp } = createCoreComponents();

  // 4. 레이아웃 컴포넌트 생성 및 조립
  const layoutComponents = createLayoutComponents(sel, addBtn, stockInfo, cartDisp);

  // 5. DOM에 컴포넌트 마운트
  mountComponentsToDOM(layoutComponents);

  // 6. DOM 의존 서비스 초기화
  const { cartEventHandler, uiUpdater } = initializeDOMDependentServices(sel, cartDisp, discountCalculator);

  // 7. 초기 렌더링 수행
  performInitialRendering(sel, cartDisp, discountCalculator, uiUpdater);

  // 8. 이벤트 핸들러 등록
  setupEventHandlers(cartEventHandler, addBtn);

  // 9. 상태 구독 설정
  setupStateSubscription();
}

main();
