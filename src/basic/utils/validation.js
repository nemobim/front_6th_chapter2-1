import { ValidationError } from '../types/errors.js';

// 상품 유효성 검증
export function validateProduct(product, productId) {
  if (!product) {
    throw new ValidationError(`상품을 찾을 수 없습니다: ${productId}`, 'product');
  }

  if (product.q < 0) {
    throw new ValidationError(`상품 재고가 잘못되었습니다: ${productId}`, 'stock');
  }

  return true;
}

// 수량 유효성 검증
export function validateQuantity(quantity, product, currentQuantity = 0) {
  if (quantity <= 0) {
    throw new ValidationError('수량은 0보다 커야 합니다.', 'quantity');
  }

  if (quantity > product.q + currentQuantity) {
    throw new ValidationError('재고가 부족합니다.', 'stock');
  }

  return true;
}

// DOM 요소 존재 확인
export function validateDOMElement(element, elementName) {
  if (!element) {
    throw new ValidationError(`DOM 요소를 찾을 수 없습니다: ${elementName}`, 'dom');
  }
  return true;
}

// 계산 결과 유효성 검증
export function validateCalculationResult(result) {
  if (!result || typeof result.totalAmount !== 'number' || result.totalAmount < 0) {
    throw new ValidationError('계산 결과가 유효하지 않습니다.', 'calculation');
  }
  return true;
}
