export const createStockInfo = () => {
  const stockInfo = document.createElement('div');
  stockInfo.id = 'stock-status';
  stockInfo.className = 'text-xs text-red-500 mt-3 whitespace-pre-line';

  return stockInfo;
};

// 재고 정보 업데이트 함수
export const updateStockInfo = (stockInfoElement, productList) => {
  let infoMsg = '';

  productList.forEach(function (item) {
    if (item.q < 5) {
      if (item.q > 0) {
        infoMsg = infoMsg + item.name + ': 재고 부족 (' + item.q + '개 남음)\n';
      } else {
        infoMsg = infoMsg + item.name + ': 품절\n';
      }
    }
  });

  stockInfoElement.textContent = infoMsg;
};

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
      itemCountElement.textContent = '️ ' + itemCount + ' items in cart';
      if (currentCount !== itemCount) {
        itemCountElement.setAttribute('data-changed', 'true');
      }
    } else {
      // 단순 업데이트
      itemCountElement.textContent = '️ ' + itemCount + ' items in cart';
    }
  }
};

export const createProductSelector = () => {
  // 상품 선택기 생성
  const productSelector = document.createElement('select');
  productSelector.id = 'product-select';
  productSelector.className = 'w-full p-3 border border-gray-300 rounded-lg text-base mb-3';

  return productSelector;
};

// 상품 선택 옵션 업데이트 함수
export const updateProductOptions = (productSelector, productList) => {
  let totalStock;
  let opt;
  let discountText;

  productSelector.innerHTML = '';
  totalStock = 0;

  // 총 재고 계산
  for (let idx = 0; idx < productList.length; idx++) {
    const _p = productList[idx];
    totalStock = totalStock + _p.q;
  }

  // 상품 옵션 생성
  for (let i = 0; i < productList.length; i++) {
    (function () {
      const item = productList[i];
      opt = document.createElement('option');
      opt.value = item.id;
      discountText = '';

      if (item.onSale) discountText += ' ⚡SALE';
      if (item.suggestSale) discountText += ' 💝추천';

      if (item.q === 0) {
        opt.textContent = item.name + ' - ' + item.val + '원 (품절)' + discountText;
        opt.disabled = true;
        opt.className = 'text-gray-400';
      } else {
        if (item.onSale && item.suggestSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (25% SUPER SALE!)';
          opt.className = 'text-purple-600 font-bold';
        } else if (item.onSale) {
          opt.textContent = '⚡' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (20% SALE!)';
          opt.className = 'text-red-500 font-bold';
        } else if (item.suggestSale) {
          opt.textContent = '' + item.name + ' - ' + item.originalVal + '원 → ' + item.val + '원 (5% 추천할인!)';
          opt.className = 'text-blue-500 font-bold';
        } else {
          opt.textContent = item.name + ' - ' + item.val + '원' + discountText;
        }
      }
      productSelector.appendChild(opt);
    })();
  }

  // 재고 부족 시 테두리 색상 변경
  if (totalStock < 50) {
    productSelector.style.borderColor = 'orange';
  } else {
    productSelector.style.borderColor = '';
  }
};
