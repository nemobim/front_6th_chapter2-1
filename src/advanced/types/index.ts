// 상품 관련 타입
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  isOnSale: boolean;
  isRecommended: boolean;
}

// 카트 아이템 타입
export interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// 카트 상태 타입
export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItemCount: number;
  discountAmount: number;
}

// 상품 상태 타입
export interface ProductState {
  selected: string | null;
  list: Product[];
  stockInfo: string | null;
}

// 앱 전체 상태 타입
export interface AppState {
  cart: CartState;
  product: ProductState;
}

// 정책 관련 타입
export interface PointsPolicy {
  BASE_RATE: number;
  TUESDAY_MULTIPLIER: number;
  SET_BONUS: {
    KEYBOARD_MOUSE: number;
    FULL_SET: number;
  };
  BULK_PURCHASE_BONUS: {
    SMALL: { minQuantity: number; points: number };
    MEDIUM: { minQuantity: number; points: number };
    LARGE: { minQuantity: number; points: number };
  };
}

export interface DiscountPolicy {
  BULK_PURCHASE_MIN: number;
}

// 상품 상태 설정 타입
export interface ProductStateConfig {
  badge: string;
  color: string;
}

// 유틸리티 타입
export type ProductId = string;
export type Quantity = number;
export type Price = number;
export type DiscountRate = number;
