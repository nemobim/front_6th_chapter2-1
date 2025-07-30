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

  // 카트 아이템에서 상품 정보 추출
  extractProductFromCartItem(cartItem, productList) {
    const product = productList.find((p) => p.id === cartItem.id);
    if (!product) return null;

    const qtyElem = cartItem.querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);
    const itemTotal = product.val * quantity;

    return { product, quantity, itemTotal };
  }

  // 개별 아이템 할인 계산 및 적용
  calculateItemDiscountAndApply(cartItem, productList) {
    const itemData = this.extractProductFromCartItem(cartItem, productList);
    if (!itemData) return { itemCount: 0, subtotal: 0, totalAmount: 0, itemDiscounts: [] };

    const { product, quantity, itemTotal } = itemData;
    const discount = this.calculateItemDiscount(product.id, quantity);
    const discountedTotal = itemTotal * (1 - discount);

    const itemDiscounts = discount > 0 ? [{ name: product.name, discount: discount * 100 }] : [];

    return {
      itemCount: quantity,
      subtotal: itemTotal,
      totalAmount: discountedTotal,
      itemDiscounts,
    };
  }

  // 모든 아이템 계산 결과 집계
  aggregateItemCalculations(cartItems, productList) {
    let totalItemCount = 0;
    let totalSubtotal = 0;
    let totalAmount = 0;
    const allItemDiscounts = [];

    for (const cartItem of cartItems) {
      const result = this.calculateItemDiscountAndApply(cartItem, productList);
      totalItemCount += result.itemCount;
      totalSubtotal += result.subtotal;
      totalAmount += result.totalAmount;
      allItemDiscounts.push(...result.itemDiscounts);
    }

    return { totalItemCount, totalSubtotal, totalAmount, allItemDiscounts };
  }

  // 대량구매 할인 적용
  applyBulkDiscount(totalAmount, totalSubtotal, totalItemCount) {
    const bulkDiscount = this.calculateBulkDiscount(totalItemCount);
    return bulkDiscount > 0 ? totalSubtotal * (1 - bulkDiscount) : totalAmount;
  }

  // 화요일 할인 적용
  applyTuesdayDiscount(totalAmount) {
    const tuesdayDiscount = this.calculateTuesdayDiscount();
    const originalTotal = totalAmount;

    if (tuesdayDiscount > 0 && totalAmount > 0) {
      totalAmount = totalAmount * (1 - tuesdayDiscount);
    }

    return { totalAmount, originalTotal, isTuesday: tuesdayDiscount > 0, tuesdayDiscount };
  }

  // 최종 할인율 계산
  calculateFinalDiscountRate(totalAmount, subtotal) {
    return 1 - totalAmount / subtotal;
  }

  // 전체 할인 계산
  calculateTotalDiscount(cartItems, productList) {
    const { totalItemCount, totalSubtotal, totalAmount, allItemDiscounts } = this.aggregateItemCalculations(
      cartItems,
      productList
    );

    const amountAfterBulkDiscount = this.applyBulkDiscount(totalAmount, totalSubtotal, totalItemCount);
    const {
      totalAmount: finalAmount,
      originalTotal,
      isTuesday,
      tuesdayDiscount,
    } = this.applyTuesdayDiscount(amountAfterBulkDiscount);

    const finalDiscountRate = this.calculateFinalDiscountRate(finalAmount, totalSubtotal);
    const bulkDiscount = this.calculateBulkDiscount(totalItemCount);

    return {
      subtotal: totalSubtotal,
      totalAmount: finalAmount,
      itemCount: totalItemCount,
      itemDiscounts: allItemDiscounts,
      discountRate: finalDiscountRate,
      originalTotal,
      isTuesday,
      bulkDiscount,
      tuesdayDiscount,
    };
  }
}
