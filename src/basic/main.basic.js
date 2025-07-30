import { createAddToCartButton } from './components/AddToCartButton';
import { createCartDisplay, getCartItems } from './components/CartDisplay';
import { createGridContainer } from './components/GridContainer';
import { createHeader } from './components/Header';
import { createLeftColumn } from './components/LeftColumn';
import { createManualOverlay } from './components/ManualOverlay';
import { createProductSelector, updateProductOptions } from './components/ProductSelector';
import { createRightColumn } from './components/RightColumn';
import { createStockInfo } from './components/StockInfo';
import { PRODUCT_LIST } from './data/products';
import { CartEventHandler } from './services/CartEventHandler';
import { CartPriceUpdater } from './services/CartPriceUpdater';
import { DiscountCalculator } from './services/DiscountCalculator';
import { TimerService } from './services/TimerService';
import { UIUpdater } from './services/UIUpdater';
import { 
  getProductList, 
  setProductList, 
  getCartState, 
  updateCartItemCount, 
  updateCartItems, 
  updateCartTotal, 
  updateCartDiscount, 
  subscribeApp 
} from './state/appState.js';

/**
 * 할인 계산과 UI 업데이트를 조율하는 메인 카트 계산 함수
 *
 * 카트 내용이 변경되거나 가격이 업데이트될 때 호출됨
 */
function handleCalculateCartStuff(cartDisp, discountCalculator, uiUpdater) {
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

/**
 * 세일 가격이 변경될 때 카트 아이템 가격을 업데이트
 *
 * TimerService에 의해 세일 가격 업데이트 시 호출됨
 * 카트 아이템이 현재 세일 가격을 반영하도록 보장
 */
function doUpdatePricesInCart(cartDisp, discountCalculator, uiUpdater) {
  const cartItems = getCartItems(cartDisp);

  // 모든 카트 아이템의 가격을 현재 세일 반영하여 업데이트
  CartPriceUpdater.updateCartItemPrices(cartItems);

  // 업데이트된 가격으로 총액 재계산
  handleCalculateCartStuff(cartDisp, discountCalculator, uiUpdater);
}

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

  const timerService = new TimerService(getProductList(), () => updateProductOptions(sel, getProductList()), () => doUpdatePricesInCart(cartDisp, discountCalculator, uiUpdater));

  const cartEventHandler = new CartEventHandler(getProductList(), cartDisp, sel, timerService, () => handleCalculateCartStuff(cartDisp, discountCalculator, uiUpdater));

  return { timerService, cartEventHandler, uiUpdater };
}

/**
 * 핵심 상호작용 컴포넌트들을 생성
 */
function createCoreComponents() {
  const sel = createProductSelector();
  const addBtn = createAddToCartButton();
  const stockInfo = createStockInfo();
  const cartDisp = createCartDisplay();
  return { sel, addBtn, stockInfo, cartDisp };
}

/**
 * 레이아웃 컴포넌트들을 생성하고 조립
 */
function createLayoutComponents(sel, addBtn, stockInfo, cartDisp) {
  const header = createHeader({ cartItemCount: getCartState().totalItemCount });

  const leftColumn = createLeftColumn({
    productSelector: sel,
    addToCartButton: addBtn,
    stockStatusElement: stockInfo,
    cartDisplay: cartDisp,
  });

  const rightColumn = createRightColumn();
  const { manualToggle, manualOverlay } = createManualOverlay();
  const gridContainer = createGridContainer({ leftColumn, rightColumn });

  return { header, gridContainer, manualToggle, manualOverlay };
}

/**
 * 생성된 컴포넌트들을 DOM에 마운트
 */
function mountComponentsToDOM(components) {
  const { header, gridContainer, manualToggle, manualOverlay } = components;
  const root = document.getElementById('app');

  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);
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

function main() {
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
