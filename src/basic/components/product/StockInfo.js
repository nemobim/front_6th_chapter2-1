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
