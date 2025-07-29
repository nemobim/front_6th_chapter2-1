import { createAddToCartButton } from './components/AddToCartButton';
import { addItemToCart, createCartDisplay, getCartItems, removeItemFromCart } from './components/CartDisplay';
import { updateCartItemPrice } from './components/CartItem';
import { updateCartTotal } from './components/CartTotal';
import { updateDiscountInfo } from './components/DiscountInfo';
import { createGridContainer } from './components/GridContainer';
import { createHeader } from './components/Header';
import { updateItemCount } from './components/ItemCount';
import { createLeftColumn } from './components/LeftColumn';
import { updateLoyaltyPoints } from './components/LoyaltyPoints';
import { createManualOverlay } from './components/ManualOverlay';
import { createProductSelector, updateProductOptions } from './components/ProductSelector';
import { createRightColumn } from './components/RightColumn';
import { createStockInfo, updateStockInfo } from './components/StockInfo';
import { updateSummaryDetails } from './components/SummaryDetails';
import { PRODUCT_IDS, PRODUCT_LIST } from './data/products';
import { TimerService } from './services/TimerService';

let prodList;
let stockInfo;
let itemCnt;
let sel;
let addBtn;
let totalAmt = 0;
let cartDisp;
let timerService;

// ========================================
// MAIN INITIALIZATION FUNCTION
// ========================================
function main() {
  // 상태 초기화
  totalAmt = 0;
  itemCnt = 0;

  // 상품 데이터 초기화
  prodList = PRODUCT_LIST;

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

  // 왼쪽 컬럼 생성
  const leftColumn = createLeftColumn({
    productSelector: sel,
    addToCartButton: addBtn,
    stockStatusElement: stockInfo,
    cartDisplay: cartDisp,
  });

  // 오른쪽 컬럼 (주문 요약) 생성
  const rightColumn = createRightColumn();

  // ----------------------------------------
  // 매뉴얼 오버레이 생성
  // ----------------------------------------
  const { manualToggle, manualOverlay } = createManualOverlay();

  // ----------------------------------------
  // DOM 최종 조립
  // ----------------------------------------

  // 헤더 생성
  const header = createHeader({ cartItemCount: itemCnt });
  // 그리드 컨테이너 생성
  const gridContainer = createGridContainer({ leftColumn, rightColumn });

  // append
  root.appendChild(header);
  root.appendChild(gridContainer);
  root.appendChild(manualToggle);
  root.appendChild(manualOverlay);

  // ----------------------------------------
  // 초기 렌더링
  // ----------------------------------------
  updateProductOptions(sel, prodList);
  handleCalculateCartStuff();

  // ----------------------------------------
  // 타이머 서비스 시작
  // ----------------------------------------
  timerService = new TimerService(prodList, updateProductOptions, doUpdatePricesInCart);
  timerService.startTimers();
}

// 카트 계산 메인 함수에서 ItemCount 컴포넌트 사용
function handleCalculateCartStuff() {
  let subTot;
  let stockMsg;

  // 초기 값 설정
  totalAmt = 0;
  itemCnt = 0;

  const cartItems = getCartItems(cartDisp);
  subTot = 0;

  const itemDiscounts = [];

  // 카트 아이템별 계산
  for (let i = 0; i < cartItems.length; i++) {
    (function () {
      let curItem;
      for (let j = 0; j < prodList.length; j++) {
        if (prodList[j].id === cartItems[i].id) {
          curItem = prodList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      let disc;
      const q = parseInt(qtyElem.textContent);
      const itemTot = curItem.val * q;
      disc = 0;
      itemCnt += q;
      subTot += itemTot;

      // UI 업데이트
      const itemDiv = cartItems[i];
      const priceElems = itemDiv.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach(function (elem) {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = q >= 10 ? 'bold' : 'normal';
        }
      });

      // 개별 상품 할인 계산
      if (q >= 10) {
        if (curItem.id === PRODUCT_IDS.KEYBOARD) {
          disc = 10 / 100;
        } else {
          if (curItem.id === PRODUCT_IDS.MOUSE) {
            disc = 15 / 100;
          } else {
            if (curItem.id === PRODUCT_IDS.MONITOR_ARM) {
              disc = 20 / 100;
            } else {
              if (curItem.id === PRODUCT_IDS.POUCH) {
                disc = 5 / 100;
              } else {
                if (curItem.id === PRODUCT_IDS.SPEAKER) {
                  disc = 25 / 100;
                }
              }
            }
          }
        }
        if (disc > 0) {
          itemDiscounts.push({ name: curItem.name, discount: disc * 100 });
        }
      }
      totalAmt += itemTot * (1 - disc);
    })();
  }

  // 대량구매 할인 계산
  let discRate = 0;
  const originalTotal = subTot;
  if (itemCnt >= 30) {
    totalAmt = (subTot * 75) / 100;
    discRate = 25 / 100;
  } else {
    discRate = (subTot - totalAmt) / subTot;
  }

  // 화요일 할인 적용
  const today = new Date();
  const isTuesday = today.getDay() === 2;
  const tuesdaySpecial = document.getElementById('tuesday-special');
  if (isTuesday) {
    if (totalAmt > 0) {
      totalAmt = (totalAmt * 90) / 100;
      discRate = 1 - totalAmt / originalTotal;
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  } else {
    tuesdaySpecial.classList.add('hidden');
  }

  // ----------------------------------------
  // UI 업데이트
  // ----------------------------------------

  // 아이템 카운트 업데이트
  const itemCountElement = document.getElementById('item-count');
  if (itemCountElement) {
    const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
    updateItemCount(itemCountElement, itemCnt, previousCount);
  }

  // 주문 요약 업데이트
  const summaryDetails = document.getElementById('summary-details');
  if (summaryDetails) {
    updateSummaryDetails(summaryDetails, getCartItems(cartDisp), prodList, subTot, itemCnt, itemDiscounts, isTuesday);
  }

  // 총 금액 업데이트
  const cartTotal = document.getElementById('cart-total');
  if (cartTotal) {
    updateCartTotal(cartTotal, totalAmt);
  }

  // 적립 포인트 업데이트
  const loyaltyPointsDiv = document.getElementById('loyalty-points');
  if (loyaltyPointsDiv) {
    updateLoyaltyPoints(loyaltyPointsDiv, getCartItems(cartDisp), prodList, totalAmt, itemCnt);
    // bonusPts = finalPoints; // 제거 - 컴포넌트 내부에서 상태 관리
  }

  // 할인 정보 업데이트
  const discountInfoDiv = document.getElementById('discount-info');
  if (discountInfoDiv) {
    updateDiscountInfo(discountInfoDiv, discRate, totalAmt, originalTotal);
  }

  // 재고 메시지 업데이트
  stockMsg = '';
  for (let stockIdx = 0; stockIdx < prodList.length; stockIdx++) {
    const item = prodList[stockIdx];
    if (item.q < 5) {
      if (item.q > 0) {
        stockMsg = stockMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        stockMsg = stockMsg + item.name + ': 품절\n';
      }
    }
  }
  stockInfo.textContent = stockMsg;

  // 추가 함수 호출
  handleStockInfoUpdate();
  // doRenderBonusPoints(); // 기존 doRenderBonusPoints 함수 제거
}

// 재고 정보 업데이트 함수에서 컴포넌트 함수 사용
const handleStockInfoUpdate = function () {
  updateStockInfo(stockInfo, prodList);
};

// ========================================
// 가격 업데이트 함수들
// ========================================

// 카트 내 가격 업데이트 (세일 상품 반영)
function doUpdatePricesInCart() {
  // 카트 아이템별 가격 업데이트
  const cartItems = getCartItems(cartDisp);
  for (let i = 0; i < cartItems.length; i++) {
    const itemId = cartItems[i].id;
    let product = null;
    for (let productIdx = 0; productIdx < prodList.length; productIdx++) {
      if (prodList[productIdx].id === itemId) {
        product = prodList[productIdx];
        break;
      }
    }
    if (product) {
      updateCartItemPrice(cartItems[i], product);
    }
  }
  handleCalculateCartStuff();
}

// ========================================
// 애플리케이션 시작 및 이벤트 리스너
// ========================================

// 애플리케이션 시작
main();

// ----------------------------------------
// 카트 추가 이벤트 리스너
// ----------------------------------------
addBtn.addEventListener('click', function () {
  const selItem = sel.value;
  let hasItem = false;

  // 선택된 상품 유효성 검증
  for (let idx = 0; idx < prodList.length; idx++) {
    if (prodList[idx].id === selItem) {
      hasItem = true;
      break;
    }
  }
  if (!selItem || !hasItem) {
    return;
  }

  // 상품 찾기
  let itemToAdd = null;
  for (let j = 0; j < prodList.length; j++) {
    if (prodList[j].id === selItem) {
      itemToAdd = prodList[j];
      break;
    }
  }

  if (itemToAdd && itemToAdd.q > 0) {
    const item = document.getElementById(itemToAdd['id']);
    if (item) {
      // 기존 아이템 수량 증가
      const qtyElem = item.querySelector('.quantity-number');
      const newQty = parseInt(qtyElem['textContent']) + 1;
      if (newQty <= itemToAdd.q + parseInt(qtyElem.textContent)) {
        qtyElem.textContent = newQty;
        itemToAdd['q']--;
      } else {
        alert('재고가 부족합니다.');
      }
    } else {
      // 새 아이템 추가 (CartDisplay 컴포넌트 함수만 사용)
      addItemToCart(cartDisp, itemToAdd);
      itemToAdd.q--;
    }
    handleCalculateCartStuff();
    timerService.setLastSelectedProduct(selItem); // 타이머 서비스에 선택된 상품 알림
  }
});

// ----------------------------------------
// 카트 수량 변경 및 삭제 이벤트 리스너
// ----------------------------------------
cartDisp.addEventListener('click', function (event) {
  const tgt = event.target;
  if (tgt.classList.contains('quantity-change') || tgt.classList.contains('remove-item')) {
    const prodId = tgt.dataset.productId;
    const itemElem = document.getElementById(prodId);
    let prod = null;

    // 상품 찾기
    for (let prdIdx = 0; prdIdx < prodList.length; prdIdx++) {
      if (prodList[prdIdx].id === prodId) {
        prod = prodList[prdIdx];
        break;
      }
    }

    if (tgt.classList.contains('quantity-change')) {
      // 수량 변경
      const qtyChange = parseInt(tgt.dataset.change);
      const qtyElem = itemElem.querySelector('.quantity-number');
      const currentQty = parseInt(qtyElem.textContent);
      const newQty = currentQty + qtyChange;
      if (newQty > 0 && newQty <= prod.q + currentQty) {
        qtyElem.textContent = newQty;
        prod.q -= qtyChange;
      } else if (newQty <= 0) {
        prod.q += currentQty;
        removeItemFromCart(cartDisp, prodId);
      } else {
        alert('재고가 부족합니다.');
      }
    } else if (tgt.classList.contains('remove-item')) {
      // 아이템 삭제
      const qtyElem = itemElem.querySelector('.quantity-number');
      const remQty = parseInt(qtyElem.textContent);
      prod.q += remQty;
      removeItemFromCart(cartDisp, prodId);
    }

    handleCalculateCartStuff();
    updateProductOptions(sel, prodList); // onUpdateSelectOptions() → updateProductOptions(sel, prodList)
  }
});
