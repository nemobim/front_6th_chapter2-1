import { createCartItem } from './CartItem';

export const createCartDisplay = () => {
  const cartDisplay = document.createElement('div');
  cartDisplay.id = 'cart-items';

  return cartDisplay;
};

// 카트 디스플레이에 아이템 추가
export const addItemToCart = (cartDisplay, product) => {
  const cartItem = createCartItem(product);
  cartDisplay.appendChild(cartItem);
  return cartItem;
};

// 카트 디스플레이에서 아이템 제거
export const removeItemFromCart = (cartDisplay, productId) => {
  const itemElement = document.getElementById(productId);
  if (itemElement) {
    itemElement.remove();
  }
};

// 카트 디스플레이의 모든 아이템 가져오기
export const getCartItems = (cartDisplay) => {
  return cartDisplay.children;
};

// 카트 디스플레이 비우기
export const clearCartDisplay = (cartDisplay) => {
  cartDisplay.innerHTML = '';
};

// 카트 디스플레이에 아이템이 있는지 확인
export const hasCartItems = (cartDisplay) => {
  return cartDisplay.children.length > 0;
};

// 카트 디스플레이의 아이템 개수 가져오기
export const getCartItemCount = (cartDisplay) => {
  return cartDisplay.children.length;
};
