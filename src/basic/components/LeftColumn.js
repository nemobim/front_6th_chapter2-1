export const createLeftColumn = ({ productSelector, cartAddButton, stockStatusElement, cartDisplay }) => {
  // 매개변수명 변경
  const leftColumn = document.createElement('div');
  leftColumn.className = 'bg-white border border-gray-200 p-8 overflow-y-auto';

  const selectorContainer = document.createElement('div');
  selectorContainer.className = 'space-y-2';
  selectorContainer.appendChild(productSelector);

  selectorContainer.appendChild(cartAddButton); // 변경

  leftColumn.appendChild(selectorContainer);
  leftColumn.appendChild(stockStatusElement);
  leftColumn.appendChild(cartDisplay);

  return leftColumn;
};
