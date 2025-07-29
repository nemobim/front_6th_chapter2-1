import { updateCartItemPrice } from '../components/CartItem.js';

export class CartPriceUpdater {
  constructor(productList) {
    this.productList = productList;
  }

  // 상품 ID로 상품 찾기
  findProductById(productId) {
    for (let i = 0; i < this.productList.length; i++) {
      if (this.productList[i].id === productId) {
        return this.productList[i];
      }
    }
    return null;
  }

  // 카트 아이템들의 가격 업데이트
  updateCartItemPrices(cartItems) {
    for (let i = 0; i < cartItems.length; i++) {
      const itemId = cartItems[i].id;
      const product = this.findProductById(itemId);

      if (product) {
        updateCartItemPrice(cartItems[i], product);
      }
    }
  }

  // 전체 카트 가격 업데이트 (기존 doUpdatePricesInCart 로직)
  updateAllCartPrices(cartDisplay, onComplete) {
    const cartItems = cartDisplay.children ? Array.from(cartDisplay.children) : [];
    this.updateCartItemPrices(cartItems);

    if (onComplete) {
      onComplete();
    }
  }
}
