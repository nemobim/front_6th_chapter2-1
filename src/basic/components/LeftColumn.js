export const createLeftColumn = ({ productSelector, addToCartButton, stockStatusElement, cartDisplay }) => {
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  // 상품 선택 컨테이너 생성
  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'mb-6 pb-6 border-b border-gray-200';

  // DOM 구조 조립
  selectorContainer.appendChild(productSelector);
  selectorContainer.appendChild(addToCartButton);
  selectorContainer.appendChild(stockStatusElement);
  leftColumn.appendChild(selectorContainer);

  // 카트 디스플레이 추가
  leftColumn.appendChild(cartDisplay);

  return leftColumn;
};
