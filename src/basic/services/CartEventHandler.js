import { addItemToCart, removeItemFromCart } from '../components/CartDisplay.js';
import { updateProductOptions } from '../components/ProductSelector.js';

export class CartEventHandler {
  constructor(productList, cartDisplay, productSelector, timerService, onCartUpdate) {
    this.productList = productList;
    this.cartDisplay = cartDisplay;
    this.productSelector = productSelector;
    this.timerService = timerService;
    this.onCartUpdate = onCartUpdate;
  }

  // 상품 찾기
  findProductById(productId) {
    for (let i = 0; i < this.productList.length; i++) {
      if (this.productList[i].id === productId) {
        return this.productList[i];
      }
    }
    return null;
  }

  // 상품 유효성 검증
  validateProduct(productId) {
    if (!productId) return false;
    return this.findProductById(productId) !== null;
  }

  // 카트에 상품 추가 처리
  handleAddToCart() {
    const selectedProductId = this.productSelector.value;

    if (!this.validateProduct(selectedProductId)) {
      return;
    }

    const productToAdd = this.findProductById(selectedProductId);

    if (productToAdd && productToAdd.q > 0) {
      const existingItem = document.getElementById(productToAdd.id);

      if (existingItem) {
        // 기존 아이템 수량 증가
        this.increaseItemQuantity(existingItem, productToAdd);
      } else {
        // 새 아이템 추가
        addItemToCart(this.cartDisplay, productToAdd);
        productToAdd.q--;
      }

      this.onCartUpdate();
      this.timerService.setLastSelectedProduct(selectedProductId);
    }
  }

  // 아이템 수량 증가
  increaseItemQuantity(itemElement, product) {
    const qtyElem = itemElement.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + 1;

    if (newQty <= product.q + currentQty) {
      qtyElem.textContent = newQty;
      product.q--;
    } else {
      alert('재고가 부족합니다.');
    }
  }

  // 카트 아이템 클릭 처리
  handleCartItemClick(event) {
    const target = event.target;

    if (!target.classList.contains('quantity-change') && !target.classList.contains('remove-item')) {
      return;
    }

    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = this.findProductById(productId);

    if (!product) return;

    if (target.classList.contains('quantity-change')) {
      this.handleQuantityChange(target, itemElement, product);
    } else if (target.classList.contains('remove-item')) {
      this.handleItemRemove(itemElement, product, productId);
    }

    this.onCartUpdate();
    updateProductOptions(this.productSelector, this.productList);
  }

  // 수량 변경 처리
  handleQuantityChange(target, itemElement, product) {
    const qtyChange = parseInt(target.dataset.change);
    const qtyElem = itemElement.querySelector('.quantity-number');
    const currentQty = parseInt(qtyElem.textContent);
    const newQty = currentQty + qtyChange;

    if (newQty > 0 && newQty <= product.q + currentQty) {
      qtyElem.textContent = newQty;
      product.q -= qtyChange;
    } else if (newQty <= 0) {
      product.q += currentQty;
      removeItemFromCart(this.cartDisplay, product.id);
    } else {
      alert('재고가 부족합니다.');
    }
  }

  // 아이템 삭제 처리
  handleItemRemove(itemElement, product, productId) {
    const qtyElem = itemElement.querySelector('.quantity-number');
    const quantity = parseInt(qtyElem.textContent);
    product.q += quantity;
    removeItemFromCart(this.cartDisplay, productId);
  }

  // 이벤트 리스너 등록
  attachEventListeners(addButton) {
    addButton.addEventListener('click', () => this.handleAddToCart());
    this.cartDisplay.addEventListener('click', (event) => this.handleCartItemClick(event));
  }
}
