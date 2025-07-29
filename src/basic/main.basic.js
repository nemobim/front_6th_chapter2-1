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
import { CartState, ProductState } from './types/state.js';
import { createState } from './utils/stateManager.js';

// 기존 전역 변수들
/** 상품 카탈로그 데이터 */
let prodList;

/** 재고 정보 표시 컴포넌트 */
let stockInfo;

/** 상품 선택 드롭다운 */
let sel;

/** 카트 추가 버튼 컴포넌트 */
let addBtn;

/** 카트 표시 컴포넌트 */
let cartDisp;

/** 할인 계산 및 가격 로직 처리 */
let discountCalculator;

/** 모든 컴포넌트의 UI 업데이트 관리 */
let uiUpdater;

// 카트 상태 관리 (정의된 타입 사용)
const [getCartState, setCartState, subscribeCart] = createState(CartState);

// 실제 사용하는 함수만 추가
function updateCartItemCount(newCount) {
  setCartState((prev) => ({ ...prev, totalItemCount: newCount }));
}

/**
 * 할인 계산과 UI 업데이트를 조율하는 메인 카트 계산 함수
 *
 * 카트 내용이 변경되거나 가격이 업데이트될 때 호출됨
 */
function handleCalculateCartStuff() {
  // 필요한 서비스가 초기화되었는지 확인
  if (!discountCalculator || !uiUpdater) {
    return;
  }

  // 표시 컴포넌트에서 현재 카트 상태 가져오기
  const cartItems = getCartItems(cartDisp);

  // 할인, 총액, 아이템 수 계산
  const calculationResult = discountCalculator.calculateTotalDiscount(cartItems, prodList);

  // 정의된 타입의 필드명 사용
  updateCartItemCount(calculationResult.itemCount);

  // 모든 컴포넌트에서 UI 업데이트 트리거
  uiUpdater.updateAllUI(calculationResult);
}

/**
 * 세일 가격이 변경될 때 카트 아이템 가격을 업데이트
 *
 * TimerService에 의해 세일 가격 업데이트 시 호출됨
 * 카트 아이템이 현재 세일 가격을 반영하도록 보장
 */
function doUpdatePricesInCart() {
  const cartItems = getCartItems(cartDisp);

  // 모든 카트 아이템의 가격을 현재 세일 반영하여 업데이트
  CartPriceUpdater.updateCartItemPrices(cartItems);

  // 업데이트된 가격으로 총액 재계산
  handleCalculateCartStuff();
}

/**
 * 핵심 서비스들을 초기화
 * DOM 생성 전에 호출되어야 함
 */
function initializeCoreServices() {
  discountCalculator = new DiscountCalculator();
}

/**
 * DOM 의존 서비스들을 초기화
 * DOM 컴포넌트 생성 후에 호출되어야 함
 */
function initializeDOMDependentServices() {
  uiUpdater = new UIUpdater(cartDisp, prodList);

  const timerService = new TimerService(prodList, () => updateProductOptions(sel, prodList), doUpdatePricesInCart);

  const cartEventHandler = new CartEventHandler(prodList, cartDisp, sel, timerService, handleCalculateCartStuff);

  return { timerService, cartEventHandler };
}

/**
 * 핵심 상호작용 컴포넌트들을 생성
 */
function createCoreComponents() {
  sel = createProductSelector();
  addBtn = createAddToCartButton();
  stockInfo = createStockInfo();
  cartDisp = createCartDisplay();
}

/**
 * 레이아웃 컴포넌트들을 생성하고 조립
 */
function createLayoutComponents() {
  const header = createHeader({ cartItemCount: getCartState('totalItemCount') });

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
function performInitialRendering() {
  updateProductOptions(sel, prodList);
  handleCalculateCartStuff();
}

/**
 * 이벤트 핸들러를 등록
 */
function setupEventHandlers(cartEventHandler) {
  cartEventHandler.attachEventListeners(addBtn);
}

function main() {
  // 1. 애플리케이션 상태 초기화
  // 기존: itemCnt = 0;
  // 새로운: 상태 초기화
  updateCartItemCount(0);
  prodList = PRODUCT_LIST;

  // 2. 핵심 서비스 초기화 (DOM 생성 전)
  initializeCoreServices();

  // 3. 핵심 컴포넌트 생성
  createCoreComponents();

  // 4. 레이아웃 컴포넌트 생성 및 조립
  const layoutComponents = createLayoutComponents();

  // 5. DOM에 컴포넌트 마운트
  mountComponentsToDOM(layoutComponents);

  // 6. DOM 의존 서비스 초기화
  const { cartEventHandler } = initializeDOMDependentServices();

  // 7. 초기 렌더링 수행
  performInitialRendering();

  // 8. 이벤트 핸들러 등록
  setupEventHandlers(cartEventHandler);

  // 카트 상태 변경 시 UI 업데이트
  subscribeCart((newCartState) => {
    const header = document.querySelector('header');
    if (header) {
      const itemCountElement = header.querySelector('.cart-item-count');
      if (itemCountElement) {
        itemCountElement.textContent = newCartState.totalItemCount;
      }
    }
  });
}

main();
