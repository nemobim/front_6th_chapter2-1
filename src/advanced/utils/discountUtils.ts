import { PRODUCT_IDS } from '../constants';
import type { CartItem, Product } from '../types';

// 할인 기준값
export const DISCOUNT_THRESHOLDS = {
  ITEM: 10, // 개별 상품 할인 적용 최소 수량
  BULK: 30, // 대량구매 할인 적용 최소 수량
} as const;

// 상품별 할인율
export const DISCOUNT_RATES = {
  [PRODUCT_IDS.KEYBOARD]: 0.1, // 키보드 10% 할인
  [PRODUCT_IDS.MOUSE]: 0.15, // 마우스 15% 할인
  [PRODUCT_IDS.MONITOR_ARM]: 0.2, // 모니터암 20% 할인
  [PRODUCT_IDS.POUCH]: 0.05, // 파우치 5% 할인
  [PRODUCT_IDS.SPEAKER]: 0.25, // 스피커 25% 할인
} as const;

// 화요일 할인 설정
export const TUESDAY_DISCOUNT = 0.1; // 화요일 10% 할인

// 할인 정보 타입
export interface DiscountInfo {
  name: string;
  discount: number;
}

export interface DiscountResult {
  subtotal: number;
  totalAmount: number;
  itemCount: number;
  itemDiscounts: DiscountInfo[];
  discountRate: number;
  isTuesday: boolean;
}

// 개별 상품 할인율 계산
export const calculateItemDiscountRate = (productId: string, quantity: number): number => {
  if (quantity < DISCOUNT_THRESHOLDS.ITEM) return 0;
  return DISCOUNT_RATES[productId] ?? 0;
};

// 대량구매 할인율 계산
export const calculateBulkDiscountRate = (totalCount: number): number => {
  return totalCount >= DISCOUNT_THRESHOLDS.BULK ? 0.25 : 0;
};

// 화요일 확인
export const isTuesday = (date: Date = new Date()): boolean => {
  return date.getDay() === 2; // 0: 일요일, 1: 월요일, 2: 화요일
};

// 개별 카트 아이템 할인 계산
export const calculateCartItemDiscount = (cartItem: CartItem, product: Product) => {
  const quantity = cartItem.quantity;
  const subtotal = product.price * quantity;
  const discountRate = calculateItemDiscountRate(product.id, quantity);
  const totalAmount = subtotal * (1 - discountRate);
  const itemDiscounts: DiscountInfo[] = discountRate > 0 ? [{ name: product.name, discount: discountRate * 100 }] : [];

  return { itemCount: quantity, subtotal, totalAmount, itemDiscounts };
};

// 모든 카트 아이템 할인 계산 및 집계
export const calculateCartItemsDiscount = (cartItems: CartItem[], products: Product[]) => {
  let itemCount = 0;
  let subtotal = 0;
  let totalAmount = 0;
  const itemDiscounts: DiscountInfo[] = [];

  for (const cartItem of cartItems) {
    const product = products.find((p: Product) => p.id === cartItem.productId);
    if (!product) continue;

    const {
      itemCount: count,
      subtotal: sub,
      totalAmount: total,
      itemDiscounts: discounts,
    } = calculateCartItemDiscount(cartItem, product);

    itemCount += count;
    subtotal += sub;
    totalAmount += total;
    itemDiscounts.push(...discounts);
  }

  return { itemCount, subtotal, totalAmount, itemDiscounts };
};

// 대량구매 할인 적용
export const applyBulkDiscount = (amount: number, subtotal: number, itemCount: number): number => {
  const rate = calculateBulkDiscountRate(itemCount);
  return rate > 0 ? subtotal * (1 - rate) : amount;
};

// 화요일 할인 적용
export const applyTuesdayDiscount = (amount: number) => {
  const rate = isTuesday() ? TUESDAY_DISCOUNT : 0;
  const finalAmount = rate > 0 ? amount * (1 - rate) : amount;

  return {
    totalAmount: finalAmount,
    originalTotal: amount,
    isTuesday: rate > 0,
    tuesdayDiscount: rate,
  };
};

// 최종 할인율 계산
export const calculateFinalDiscountRate = (total: number, subtotal: number): number => {
  return subtotal > 0 ? 1 - total / subtotal : 0;
};

// 전체 할인 계산 (메인 함수)
export const calculateTotalDiscount = (cartItems: CartItem[], products: Product[]): DiscountResult => {
  // 개별 아이템 할인 계산 및 집계
  const { itemCount, subtotal, totalAmount, itemDiscounts } = calculateCartItemsDiscount(cartItems, products);

  // 대량구매 할인 적용
  const bulkAppliedAmount = applyBulkDiscount(totalAmount, subtotal, itemCount);

  // 화요일 할인 적용
  const { totalAmount: finalAmount, isTuesday: isTuesdayDiscount } = applyTuesdayDiscount(bulkAppliedAmount);

  // 최종 할인율 계산
  const discountRate = calculateFinalDiscountRate(finalAmount, subtotal);

  return {
    subtotal,
    totalAmount: finalAmount,
    itemCount,
    itemDiscounts,
    discountRate,
    isTuesday: isTuesdayDiscount,
  };
};
