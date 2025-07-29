import { PRODUCT_IDS } from '../data/products.js';

export class DiscountCalculator {
  constructor() {
    this.discountRates = {
      [PRODUCT_IDS.KEYBOARD]: 0.1, // 10%
      [PRODUCT_IDS.MOUSE]: 0.15, // 15%
      [PRODUCT_IDS.MONITOR_ARM]: 0.2, // 20%
      [PRODUCT_IDS.POUCH]: 0.05, // 5%
      [PRODUCT_IDS.SPEAKER]: 0.25, // 25%
    };
  }

  // 개별 상품 할인 계산
  calculateItemDiscount(productId, quantity) {
    if (quantity < 10) return 0;
    return this.discountRates[productId] || 0;
  }

  // 대량구매 할인 계산
  calculateBulkDiscount(totalItemCount) {
    return totalItemCount >= 30 ? 0.25 : 0; // 25% 할인
  }

  // 화요일 할인 계산
  calculateTuesdayDiscount() {
    const today = new Date();
    return today.getDay() === 2 ? 0.1 : 0; // 10% 할인
  }

  // 전체 할인 계산
  calculateTotalDiscount(cartItems, productList) {
    let subtotal = 0;
    let totalAmount = 0;
    let itemCount = 0;
    const itemDiscounts = [];

    // 각 아이템별 계산
    for (const cartItem of cartItems) {
      const product = productList.find((p) => p.id === cartItem.id);
      if (!product) continue;

      const qtyElem = cartItem.querySelector('.quantity-number');
      const quantity = parseInt(qtyElem.textContent);
      const itemTotal = product.val * quantity;

      itemCount += quantity;
      subtotal += itemTotal;

      // 개별 상품 할인
      const discount = this.calculateItemDiscount(product.id, quantity);
      if (discount > 0) {
        itemDiscounts.push({
          name: product.name,
          discount: discount * 100,
        });
      }

      totalAmount += itemTotal * (1 - discount);
    }

    // 대량구매 할인 적용
    const bulkDiscount = this.calculateBulkDiscount(itemCount);
    if (bulkDiscount > 0) {
      totalAmount = subtotal * (1 - bulkDiscount);
    }

    // 화요일 할인 적용
    const tuesdayDiscount = this.calculateTuesdayDiscount();
    const originalTotal = totalAmount;
    if (tuesdayDiscount > 0 && totalAmount > 0) {
      totalAmount = totalAmount * (1 - tuesdayDiscount);
    }

    const finalDiscountRate = 1 - totalAmount / subtotal;

    return {
      subtotal,
      totalAmount,
      itemCount,
      itemDiscounts,
      discountRate: finalDiscountRate,
      originalTotal,
      isTuesday: tuesdayDiscount > 0,
      bulkDiscount,
      tuesdayDiscount,
    };
  }
}
