import { updateCartItemPrice } from '../components/cart/CartItem.js';
import { findProductById } from '../utils/productUtils.js';

export class CartPriceUpdater {
  constructor(productList) {
    this.productList = productList;
  }

  // 카트 아이템들의 가격 업데이트
  updateCartItemPrices(cartItems) {
    for (let index = 0; index < cartItems.length; index++) {
      const itemId = cartItems[index].id;
      const product = findProductById(this.productList, itemId);

      if (product) {
        updateCartItemPrice(cartItems[index], product);
      }
    }
  }

  // 전체 카트 가격 업데이트
  updateAllPrices(cartDisplay, onComplete) {
    const cartItems = cartDisplay.children ? Array.from(cartDisplay.children) : [];
    this.updateCartItemPrices(cartItems);

    if (onComplete) {
      onComplete();
    }
  }
}
