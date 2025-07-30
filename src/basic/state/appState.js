import { AppState } from '../types/state.js';
import { createState } from '../utils/stateManager.js';

// 앱 전체 상태 관리
const [getAppState, setAppState, subscribeApp] = createState(AppState);

// 앱 상태 접근 함수들
export function getProductList() {
  return getAppState().product.list;
}

export function setProductList(productList) {
  setAppState((prev) => ({
    ...prev,
    product: { ...prev.product, list: productList },
  }));
}

export function getCartState() {
  return getAppState().cart;
}

export function setCartState(newCartState) {
  setAppState((prev) => ({
    ...prev,
    cart: { ...prev.cart, ...newCartState },
  }));
}

// 카트 상태 업데이트 함수들
export function updateCartItemCount(newCount) {
  setCartState((prev) => ({ ...prev, totalItemCount: newCount }));
}

export function updateCartItems(newItems) {
  setCartState((prev) => ({ ...prev, items: newItems }));
}

export function updateCartTotal(newTotal) {
  setCartState((prev) => ({ ...prev, totalAmount: newTotal }));
}

export function updateCartDiscount(newDiscount) {
  setCartState((prev) => ({ ...prev, discountAmount: newDiscount }));
}

export { subscribeApp };
