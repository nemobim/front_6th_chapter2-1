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

let prodList;
let stockInfo;
let itemCnt;
let sel;
let addBtn;
let cartDisp;

// 서비스 인스턴스들
let discountCalculator;
let uiUpdater;

// ========================================
// MAIN INITIALIZATION FUNCTION
// ========================================
function main() {
  // 상태 초기화
  itemCnt = 0;

  // 상품 데이터 초기화
  prodList = PRODUCT_LIST;

  // ----------------------------------------
  // 서비스 초기화 (DOM 생성 전에 먼저 초기화)
  // ----------------------------------------
  discountCalculator = new DiscountCalculator();

  // ----------------------------------------
  // DOM 요소 생성
  // ----------------------------------------
  const root = document.getElementById('app');

  // 상품 선택기 생성
  sel = createProductSelector();

  // 추가 버튼 생성
  addBtn = createAddToCartButton();

  // 재고 정보 생성
  stockInfo = createStockInfo();

  // 카트 디스플레이 생성
  cartDisp = createCartDisplay();

  // 헤더 생성 (컴포넌트 사용)
  const header = createHeader({ cartItemCount: itemCnt });

  // 왼쪽 컬럼 생성
  const leftColumn = createLeftColumn({
    productSelector: sel,
    addToCartButton: addBtn,
    stockStatusElement: stockInfo,
    cartDisplay: cartDisp,
  });

  // 오른쪽 컬럼 생성
  const rightColumn = createRightColumn();

  // 매뉴얼 오버레이 생성
  const { manualToggle, manualOverlay } = createManualOverlay();

  // 그리드 컨테이너 생성
  const gridContainer = createGridContainer({ leftColumn, rightColumn });

  // append
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // ----------------------------------------
  // 나머지 서비스 초기화
  // ----------------------------------------
  uiUpdater = new UIUpdater(cartDisp, prodList);
  const timerService = new TimerService(prodList, () => updateProductOptions(sel, prodList), doUpdatePricesInCart);
  const cartEventHandler = new CartEventHandler(prodList, cartDisp, sel, timerService, handleCalculateCartStuff);

  // ----------------------------------------
  // 초기 렌더링 (서비스 초기화 후)
  // ----------------------------------------
  updateProductOptions(sel, prodList);
  handleCalculateCartStuff();

  // ----------------------------------------
  // 이벤트 리스너 등록
  // ----------------------------------------
  cartEventHandler.attachEventListeners(addBtn);
}

// 카트 계산 메인 함수 (대폭 단순화)
function handleCalculateCartStuff() {
  // 서비스가 초기화되었는지 확인
  if (!discountCalculator || !uiUpdater) {
    return;
  }

  const cartItems = getCartItems(cartDisp);

  // 할인 계산
  const calculationResult = discountCalculator.calculateTotalDiscount(cartItems, prodList);

  itemCnt = calculationResult.itemCount;

  // UI 업데이트
  uiUpdater.updateAllUI(calculationResult);
}

// 카트 내 가격 업데이트 (세일 상품 반영)
function doUpdatePricesInCart() {
  const cartItems = getCartItems(cartDisp);
  CartPriceUpdater.updateCartItemPrices(cartItems);
  handleCalculateCartStuff();
}

// 애플리케이션 시작
main();
