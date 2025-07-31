import { updateCartTotal } from '../components/cart/CartTotal.js';
import { updateDiscountInfo } from '../components/order/DiscountInfo.js';
import { updateOrderSummary } from '../components/order/OrderSummary.js';
import { updateRewardPoints } from '../components/order/RewardPoints.js';
import { updateItemCount } from '../components/product/ItemCount.js';
import { updateStockInfo } from '../components/product/StockInfo.js';

// UI 관련 상수
const UI_THRESHOLDS = {
  LOW_STOCK_THRESHOLD: 5,
  QUANTITY_THRESHOLD: 10,
};

export class UIUpdater {
  constructor(cartDisplay, productList) {
    this.cartDisplay = cartDisplay;
    this.productList = productList;
  }

  // 카트 아이템 UI 스타일 업데이트
  updateCartItemStyles(cartItems) {
    for (const item of cartItems) {
      const quantityElement = item.querySelector('.quantity-number');
      const quantity = parseInt(quantityElement.textContent);

      const elem = item.querySelector('.product-name');
      if (elem) {
        elem.style.fontWeight = quantity >= UI_THRESHOLDS.QUANTITY_THRESHOLD ? 'bold' : 'normal';
      }

      if (item.q < UI_THRESHOLDS.LOW_STOCK_THRESHOLD) {
        item.style.color = 'red';
      }
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
      if (item.q < UI_THRESHOLDS.LOW_STOCK_THRESHOLD) {
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
      updateItemCount(itemCountElement, itemCount);
    }
  }

  // 주문 요약 업데이트
  updateOrderSummaryDisplay(cartItems, subtotal, itemCount, itemDiscounts, isTuesday) {
    const orderSummaryElement = document.getElementById('summary-details');
    if (orderSummaryElement) {
      updateOrderSummary(
        orderSummaryElement,
        cartItems,
        this.productList,
        subtotal,
        itemCount,
        itemDiscounts,
        isTuesday
      );
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
  updateRewardPointsDisplay(cartItems, totalAmount, itemCount) {
    const rewardPointsDiv = document.getElementById('loyalty-points');
    if (rewardPointsDiv) {
      updateRewardPoints(rewardPointsDiv, cartItems, this.productList, totalAmount, itemCount);
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
    this.updateOrderSummaryDisplay(cartItems, subtotal, itemCount, itemDiscounts, isTuesday);
    this.updateTotalDisplay(totalAmount);
    this.updateRewardPointsDisplay(cartItems, totalAmount, itemCount);
    this.updateDiscountDisplay(discountRate, totalAmount, originalTotal);
    this.updateStockDisplay();
  }
}
