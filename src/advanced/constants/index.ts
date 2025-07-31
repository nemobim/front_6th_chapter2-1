// 상품 ID 상수
export const PRODUCT_IDS = {
  KEYBOARD: 'p1',
  MOUSE: 'p2',
  MONITOR_ARM: 'p3',
  POUCH: 'p4',
  SPEAKER: 'p5',
} as const;

// 할인율 상수
export const DISCOUNT_RATE = 0.24; // 24% 할인

// 정책 상수들 재export
export * from './policy';
export * from './product';
