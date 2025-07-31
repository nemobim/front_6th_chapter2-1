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
  discountPrice: number;
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
