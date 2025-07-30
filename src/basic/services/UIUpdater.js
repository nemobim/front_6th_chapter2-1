import { updateCartTotal } from '../components/CartTotal.js';
import { updateDiscountInfo } from '../components/DiscountInfo.js';
import { updateItemCount } from '../components/ItemCount.js';
import { updateLoyaltyPoints } from '../components/LoyaltyPoints.js';
import { updateStockInfo } from '../components/StockInfo.js';
import { updateSummaryDetails } from '../components/SummaryDetails.js';

export class UIUpdater {
  constructor(cartDisplay, productList) {
    this.cartDisplay = cartDisplay;
    this.productList = productList;
  }

  // 카트 아이템 UI 스타일 업데이트
  updateCartItemStyles(cartItems) {
    for (const cartItem of cartItems) {
      const qtyElem = cartItem.querySelector('.quantity-number');
      const quantity = parseInt(qtyElem.textContent);

      const priceElems = cartItem.querySelectorAll('.text-lg, .text-xs');
      priceElems.forEach((elem) => {
        if (elem.classList.contains('text-lg')) {
          elem.style.fontWeight = quantity >= 10 ? 'bold' : 'normal';
        }
      });
    }
  }

  // 화요일 특별 할인 배너 업데이트
  updateTuesdaySpecial(isTuesday, hasItems) {
    const tuesdaySpecial = document.getElementById('tuesday-special');
    if (!tuesdaySpecial) return;

    if (isTuesday && hasItems) {
      tuesdaySpecial.classList.remove('hidden');
    } else {
      tuesdaySpecial.classList.add('hidden');
    }
  }

  // 재고 메시지 생성
  createStockMessage() {
    let stockMessage = '';

    for (const item of this.productList) {
      if (item.q < 5) {
        if (item.q > 0) {
          stockMessage += `${item.name}: 재고 부족 (${item.q}개 남음)\n`;
        } else {
          stockMessage += `${item.name}: 품절\n`;
        }
      }
    }

    return stockMessage;
  }

  // 아이템 카운트 업데이트
  updateItemCountDisplay(itemCount) {
    const itemCountElement = document.getElementById('item-count');
    if (itemCountElement) {
      const previousCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
      updateItemCount(itemCountElement, itemCount, previousCount);
    }
  }

  // 주문 요약 업데이트
  updateSummaryDisplay(cartItems, subtotal, itemCount, itemDiscounts, isTuesday) {
    const summaryDetails = document.getElementById('summary-details');
    if (summaryDetails) {
      updateSummaryDetails(summaryDetails, cartItems, this.productList, subtotal, itemCount, itemDiscounts, isTuesday);
    }
  }

  // 총 금액 업데이트
  updateTotalDisplay(totalAmount) {
    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
      updateCartTotal(cartTotal, totalAmount);
    }
  }

  // 적립 포인트 업데이트
  updateLoyaltyPointsDisplay(cartItems, totalAmount, itemCount) {
    const loyaltyPointsDiv = document.getElementById('loyalty-points');
    if (loyaltyPointsDiv) {
      updateLoyaltyPoints(loyaltyPointsDiv, cartItems, this.productList, totalAmount, itemCount);
    }
  }

  // 할인 정보 업데이트
  updateDiscountDisplay(discountRate, totalAmount, originalTotal) {
    const discountInfoDiv = document.getElementById('discount-info');
    if (discountInfoDiv) {
      updateDiscountInfo(discountInfoDiv, discountRate, totalAmount, originalTotal);
    }
  }

  // 재고 정보 업데이트
  updateStockDisplay() {
    const stockInfo = document.getElementById('stock-status');
    if (stockInfo) {
      const stockMessage = this.createStockMessage();
      stockInfo.textContent = stockMessage;
      updateStockInfo(stockInfo, this.productList);
    }
  }

  // 모든 UI 업데이트
  updateAllUI(calculationResult) {
    const { subtotal, totalAmount, itemCount, itemDiscounts, discountRate, originalTotal, isTuesday } =
      calculationResult;

    const cartItems = Array.from(this.cartDisplay.children);

    this.updateCartItemStyles(cartItems);
    this.updateTuesdaySpecial(isTuesday, totalAmount > 0);
    this.updateItemCountDisplay(itemCount);
    this.updateSummaryDisplay(cartItems, subtotal, itemCount, itemDiscounts, isTuesday);
    this.updateTotalDisplay(totalAmount);
    this.updateLoyaltyPointsDisplay(cartItems, totalAmount, itemCount);
    this.updateDiscountDisplay(discountRate, totalAmount, originalTotal);
    this.updateStockDisplay();
  }
}
