/**
 * 상품 관련 유틸리티 함수들
 */

/**
 * 상품 ID로 상품 찾기
 * @param {Array} productList - 상품 목록
 * @param {string} productId - 찾을 상품 ID
 * @returns {Object|null} 찾은 상품 객체 또는 null
 */
export function findProductById(productList, productId) {
  for (let index = 0; index < productList.length; index++) {
    if (productList[index].id === productId) {
      return productList[index];
    }
  }
  return null;
}

/**
 * 상품 목록에서 특정 조건의 상품들 찾기
 * @param {Array} productList - 상품 목록
 * @param {Function} predicate - 필터 조건 함수
 * @returns {Array} 필터링된 상품 목록
 */
export function findProductsByCondition(productList, predicate) {
  return productList.filter(predicate);
}

/**
 * 상품의 할인율 계산
 * @param {Object} product - 상품 객체
 * @returns {number} 할인율 (0-1 사이 값)
 */
export function calculateProductDiscount(product) {
  if (!product.originalVal || product.originalVal === product.val) {
    return 0;
  }
  return (product.originalVal - product.val) / product.originalVal;
}
