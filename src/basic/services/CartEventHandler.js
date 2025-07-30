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

  // 선택된 상품 가져오기
  getSelectedProduct() {
    const selectedProductId = this.productSelector.value;
    return this.validateProduct(selectedProductId) ? this.findProductById(selectedProductId) : null;
  }

  // 기존 아이템 확인
  findExistingCartItem(productId) {
    return document.getElementById(productId);
  }

  // 새 아이템 추가 처리
  addNewItemToCart(productToAdd) {
    addItemToCart(this.cartDisplay, productToAdd);
    productToAdd.q--;
  }

  // 카트에 상품 추가 처리
  handleAddToCart() {
    const productToAdd = this.getSelectedProduct();
    if (!productToAdd || productToAdd.q <= 0) return;

    const existingItem = this.findExistingCartItem(productToAdd.id);

    if (existingItem) {
      this.increaseItemQuantity(existingItem, productToAdd);
    } else {
      this.addNewItemToCart(productToAdd);
    }

    this.onCartUpdate();
    this.timerService.setLastSelectedProduct(this.productSelector.value);
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

  // 클릭된 요소 유효성 검증
  isValidClickTarget(target) {
    return target.classList.contains('quantity-change') || target.classList.contains('remove-item');
  }

  // 클릭 이벤트 타입 확인
  getClickEventType(target) {
    if (target.classList.contains('quantity-change')) return 'quantity-change';
    if (target.classList.contains('remove-item')) return 'remove-item';
    return null;
  }

  // 카트 아이템 클릭 처리
  handleCartItemClick(event) {
    const target = event.target;
    if (!this.isValidClickTarget(target)) return;

    const productId = target.dataset.productId;
    const itemElement = document.getElementById(productId);
    const product = this.findProductById(productId);
    if (!product) return;

    const eventType = this.getClickEventType(target);
    this.processCartItemAction(eventType, target, itemElement, product);

    this.onCartUpdate();
    updateProductOptions(this.productSelector, this.productList);
  }

  // 카트 아이템 액션 처리
  processCartItemAction(eventType, target, itemElement, product) {
    if (eventType === 'quantity-change') {
      this.handleQuantityChange(target, itemElement, product);
    } else if (eventType === 'remove-item') {
      this.handleItemRemove(itemElement, product, target.dataset.productId);
    }
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
