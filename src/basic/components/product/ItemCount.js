export const createItemCount = () => {
  const itemCount = document.createElement('p');
  itemCount.id = 'item-count';
  itemCount.className = 'text-sm text-gray-500 font-normal mt-3';
  itemCount.textContent = '🛍️ 0 items in cart';

  return itemCount;
};

// 아이템 카운트 업데이트
export const updateItemCount = (itemCountElement, itemCount, previousCount = null) => {
  if (itemCountElement) {
    if (previousCount !== null) {
      // 이전 카운트와 비교하여 변경 추적
      const currentCount = parseInt(itemCountElement.textContent.match(/\d+/) || 0);
      itemCountElement.textContent = '🛍️ ' + itemCount + ' items in cart';
      if (currentCount !== itemCount) {
        itemCountElement.setAttribute('data-changed', 'true');
      }
    } else {
      // 단순 업데이트
      itemCountElement.textContent = '🛍️ ' + itemCount + ' items in cart';
    }
  }
};
