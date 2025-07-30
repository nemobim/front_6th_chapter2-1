export const createOrderSummary = () => {
  const orderSummary = document.createElement('div');
  orderSummary.id = 'summary-details'; // ID는 테스트 호환성 위해 유지
  orderSummary.className = 'space-y-3';

  return orderSummary;
};

// 주문 요약 상세 정보 업데이트
export const updateOrderSummary = (
  orderSummaryElement,
  cartItems,
  productList,
  subtotal,
  itemCount,
  itemDiscounts,
  isTuesday
) => {
  orderSummaryElement.innerHTML = '';

  if (subtotal > 0) {
    // 각 상품별 정보 추가
    for (let i = 0; i < cartItems.length; i++) {
      let curItem;
      for (let j = 0; j < productList.length; j++) {
        if (productList[j].id === cartItems[i].id) {
          curItem = productList[j];
          break;
        }
      }
      const qtyElem = cartItems[i].querySelector('.quantity-number');
      const q = parseInt(qtyElem.textContent);
      const itemTotal = curItem.val * q;
      orderSummaryElement.innerHTML += /* HTML */ `
        <div class="flex justify-between text-xs tracking-wide text-gray-400">
          <span>${curItem.name} x ${q}</span>
          <span>₩${itemTotal.toLocaleString()}</span>
        </div>
      `;
    }

    // 구분선 추가
    orderSummaryElement.innerHTML += /* HTML */ `
      <div class="border-t border-white/10 my-3"></div>
      <div class="flex justify-between text-sm tracking-wide">
        <span>Subtotal</span>
        <span>₩${subtotal.toLocaleString()}</span>
      </div>
    `;

    // 대량구매 할인 정보
    if (itemCount >= 30) {
      orderSummaryElement.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-green-400">
          <span class="text-xs">👍 대량구매 할인 (30개 이상)</span>
          <span class="text-xs">-25%</span>
        </div>
      `;
    } else if (itemDiscounts.length > 0) {
      itemDiscounts.forEach(function (item) {
        orderSummaryElement.innerHTML += /* HTML */ `
          <div class="flex justify-between text-sm tracking-wide text-green-400">
            <span class="text-xs">${item.name} (10개↑)</span>
            <span class="text-xs">-${item.discount}%</span>
          </div>
        `;
      });
    }

    // 화요일 할인 정보
    if (isTuesday) {
      orderSummaryElement.innerHTML += /* HTML */ `
        <div class="flex justify-between text-sm tracking-wide text-purple-400">
          <span class="text-xs">🌟 화요일 추가 할인</span>
          <span class="text-xs">-10%</span>
        </div>
      `;
    }

    // 배송 정보
    orderSummaryElement.innerHTML += /* HTML */ `
      <div class="flex justify-between text-sm tracking-wide text-gray-400">
        <span>Shipping</span>
        <span>Free</span>
      </div>
    `;
  }
};
