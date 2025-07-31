export const createRewardPoints = () => {
  const rewardPoints = document.createElement('div');
  rewardPoints.id = 'loyalty-points'; // ID는 테스트 호환성 위해 유지
  rewardPoints.className = 'text-xs text-blue-400 mt-2 text-right';
  rewardPoints.textContent = '적립 포인트: 0p';

  return rewardPoints;
};

// 포인트 계산 및 업데이트
export const updateRewardPoints = (rewardPointsElement, cartItems, productList, totalAmount, itemCount) => {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  if (cartItems.length === 0) {
    rewardPointsElement.style.display = 'none';
    return;
  }

  // 기본 포인트 계산
  const basePoints = Math.floor(totalAmount / 1000);
  finalPoints = 0;
  const pointsDetail = [];

  if (basePoints > 0) {
    finalPoints = basePoints;
    pointsDetail.push('기본: ' + basePoints + 'p');
  }

  // 화요일 2배 포인트
  if (new Date().getDay() === 2) {
    if (basePoints > 0) {
      finalPoints = basePoints * 2;
      pointsDetail.push('화요일 2배');
    }
  }

  // 상품 조합 확인
  hasKeyboard = false;
  hasMouse = false;
  hasMonitorArm = false;

  for (const node of cartItems) {
    let product = null;
    for (let pIdx = 0; pIdx < productList.length; pIdx++) {
      if (productList[pIdx].id === node.id) {
        product = productList[pIdx];
        break;
      }
    }
    if (!product) continue;

    if (product.id === 'p1') {
      // KEYBOARD
      hasKeyboard = true;
    } else if (product.id === 'p2') {
      // MOUSE
      hasMouse = true;
    } else if (product.id === 'p3') {
      // MONITOR_ARM
      hasMonitorArm = true;
    }
  }

  // 세트 구매 보너스 계산
  if (hasKeyboard && hasMouse) {
    finalPoints = finalPoints + 50;
    pointsDetail.push('키보드+마우스 세트 +50p');
  }
  if (hasKeyboard && hasMouse && hasMonitorArm) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('풀세트 구매 +100p');
  }

  // 대량구매 보너스 계산
  if (itemCount >= 30) {
    finalPoints = finalPoints + 100;
    pointsDetail.push('대량구매(30개+) +100p');
  } else {
    if (itemCount >= 20) {
      finalPoints = finalPoints + 50;
      pointsDetail.push('대량구매(20개+) +50p');
    } else {
      if (itemCount >= 10) {
        finalPoints = finalPoints + 20;
        pointsDetail.push('대량구매(10개+) +20p');
      }
    }
  }

  // 포인트 UI 업데이트
  if (finalPoints > 0) {
    rewardPointsElement.innerHTML =
      '<div>적립 포인트: <span class="font-bold">' +
      finalPoints +
      'p</span></div>' +
      '<div class="text-2xs opacity-70 mt-1">' +
      pointsDetail.join(', ') +
      '</div>';
    rewardPointsElement.style.display = 'block';
  } else {
    rewardPointsElement.textContent = '적립 포인트: 0p';
    rewardPointsElement.style.display = 'block';
  }

  return finalPoints;
};

export const createDiscountInfo = () => {
  const discountInfo = document.createElement('div');
  discountInfo.id = 'discount-info';
  discountInfo.className = 'mb-4';

  return discountInfo;
};

// 할인 정보 업데이트
export const updateDiscountInfo = (discountInfoElement, discountRate, totalAmount, originalTotal) => {
  discountInfoElement.innerHTML = '';

  if (discountRate > 0 && totalAmount > 0) {
    const savedAmount = originalTotal - totalAmount;
    discountInfoElement.innerHTML = /* HTML */ `
      <div class="bg-green-500/20 rounded-lg p-3">
        <div class="flex justify-between items-center mb-1">
          <span class="text-xs uppercase tracking-wide text-green-400">총 할인율</span>
          <span class="text-sm font-medium text-green-400">${(discountRate * 100).toFixed(1)}%</span>
        </div>
        <div class="text-2xs text-gray-300">₩${Math.round(savedAmount).toLocaleString()} 할인되었습니다</div>
      </div>
    `;
  }
};

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
          <span class="text-xs">🌟 대량구매 할인 (30개 이상)</span>
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
