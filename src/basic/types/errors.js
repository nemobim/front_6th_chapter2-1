// 커스텀 에러 클래스들
export class CartError extends Error {
  constructor(message, type = 'CART_ERROR') {
    super(message);
    this.name = 'CartError';
    this.type = type;
  }
}

export class ProductError extends Error {
  constructor(message, productId = null) {
    super(message);
    this.name = 'ProductError';
    this.productId = productId;
  }
}

export class ValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
  }
}

// 에러 타입 상수
export const ERROR_TYPES = {
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  INVALID_QUANTITY: 'INVALID_QUANTITY',
  DOM_ELEMENT_NOT_FOUND: 'DOM_ELEMENT_NOT_FOUND',
  CALCULATION_ERROR: 'CALCULATION_ERROR',
};
