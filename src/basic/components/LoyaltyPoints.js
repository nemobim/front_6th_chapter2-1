export const createLoyaltyPoints = () => {
  const loyaltyPoints = document.createElement('div');
  loyaltyPoints.id = 'loyalty-points';
  loyaltyPoints.className = 'text-xs text-blue-400 mt-2 text-right';
  loyaltyPoints.textContent = '적립 포인트: 0p';

  return loyaltyPoints;
};

// 포인트 계산 및 업데이트
export const updateLoyaltyPoints = (loyaltyPointsElement, cartItems, productList, totalAmount, itemCount) => {
  let finalPoints;
  let hasKeyboard;
  let hasMouse;
  let hasMonitorArm;

  if (cartItems.length === 0) {
    loyaltyPointsElement.style.display = 'none';
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
    loyaltyPointsElement.innerHTML =
      '<div>적립 포인트: <span class="font-bold">' +
      finalPoints +
      'p</span></div>' +
      '<div class="text-2xs opacity-70 mt-1">' +
      pointsDetail.join(', ') +
      '</div>';
    loyaltyPointsElement.style.display = 'block';
  } else {
    loyaltyPointsElement.textContent = '적립 포인트: 0p';
    loyaltyPointsElement.style.display = 'block';
  }

  return finalPoints;
};
